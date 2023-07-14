var express = require('express')
var router = express.Router()

const fs = require('fs')
const multer = require('multer')

const auth = require('../auth/auth')
const knex = require('../database/access').connection

const xlsx = require('xlsx')
xlsx.helper = require('../util/xlsx-helper')

const UUID = require('uuid')
const BackendError = require('../util/BackendError')

function validateUUID(uuid) {
  return UUID.validate(uuid) && UUID.version(uuid) === 4;
}


// GET GRID DATA
router.get('/get/:gridId', [auth], async function (req, res, next) {
    let gridId = req.params['gridId'] 
    if(gridId == undefined || gridId == null || validateUUID(gridId) == false) {
        throw new BackendError(`Could not find grid with id ${gridId}`, 404)
    }

    let gridData = await loadGridData(gridId)
    if(gridData == null) {
        throw new BackendError(`Could not find grid with id ${gridId}`, 404)
    }

    let result = {
        gridMetadata: gridData.gridMetadata,
        columns: gridData.columnDefs.columns,
        data: Array.from(gridData.rows.entries())
    }

    res.send(result)
})



async function loadColumnDefs(gridId) {
    let result = {}
    result.columns = await knex('columns').where({ grid: gridId }).orderBy('ordering','asc')
    result.columnIds = []
    result.columnsById = new Map()
    result.columnsByName = new Map()
    for(let column of result.columns) {
        result.columnsById.set(column.id,column)
        result.columnsByName.set(column.label,column)
        result.columnIds.push(column.id)
    }
    return result
}



async function loadGridData(gridId, loadRowKeyMaps = false) {

    // load column defs
    let columnDefs = await loadColumnDefs(gridId)

    // find 1-n fields and load the linked grid data
    const linkedGrids = new Map()
    for(let column of columnDefs.columns) {
        if(column.type === '1-n') {
            const linkedGridId = column?.context?.gridId
            if(linkedGridId == null) {
                continue
            }
            if(linkedGrids.has(linkedGridId) === false) {
                const linkedGridData = await loadGridData(linkedGridId, true)
                console.log(linkedGridData)
                linkedGrids.set(linkedGridId,linkedGridData)
            }
        }
    }

    // load grid meta data
    let gridMetadata = await knex('grids').where({ id: gridId }).first()
    if(!gridMetadata) {
        return null
    }

    // load row keys
    let rowKeys = await knex('rows').where({ grid: gridId })
    const rowKeyById = new Map()
    const rowKeyByKey = new Map()
    for(let rowKey of rowKeys) {
        rowKeyById.set(rowKey.id, rowKey)
        rowKeyByKey.set(rowKey.key, rowKey)
    }

    // get change events
    let changeEvents = await knex('change_events').where({ grid: gridId })
    const changeEventsById = new Map()
    for(let changeEvent of changeEvents) {
        changeEventsById.set(changeEvent.id, changeEvent)
    }

    // store for row data
    const rowData = new Map()

    // create and fill rows with cell data
    let cells = await knex('cells').where({ grid: gridId })

    cells.reverse()                 // HACK: Die cells kommen aus der datenbank in insertion order. Eine umgekehrte insertion order sorgt dafür, dass die neuesten cells
                                    //       zu erst kommen. Damit werden dann auch die rows mit neueren zellen als erste in der map angelegt, was dazu führt, dass
                                    //       neuere rows in der rückgabe als erstes kommen.
                                    // TODO: Das vorgehen ist unsauber. Besser sollte für alle rows jeweils ein last_modified feld basierend auf den change_events der
                                    //       cell berechnet und mit zurückgegeben werden. So kann dann auch frontend seite die default order auf diesem Feld laufen.

    for(let cell of cells) {

        let column = columnDefs.columnsById.get(cell.column)

        let row = rowData.get(cell.row)
        if(row == undefined) {
            let rowId = cell.row
            row = {}
            rowData.set(rowId, row)
            if(rowKeyById.has(rowId) == false) {
                throw new BackendError(`Integrity Error: Found cell data for non-existing row (cellId: ${cell.id}, rowId: ${rowId})`, 500)
            }
        }

        let changeEvent = changeEventsById.get(cell.change_event)
        if(changeEvent == undefined  || changeEvent == null) {
            throw new BackendError(`Integrity Error: Could not find change event for cell (cellId: ${cell.id}, changeEventId: ${cell.change_event})`, 500)
        }

        // set row data
        if( row[column.id] == undefined || row[column.id] == null || changeEvent.timestamp > row[column.id].timestamp) {
            row[column.id] = {
                value: cell.value,
                timestamp: changeEvent.timestamp
            }
        }
    }


    // replace linked data in cells
    for(let column of columnDefs.columns) {

        let columnId = column.id

        if(column.type === '1-n') {

            continue

            // ab hier alles in entwicklung

            let linkedGridId = column?.context?.gridId
            if(linkedGridId == null) {
                continue
            }            

            let linkedData = linkedGrids.get(linkedGridId)
            if(linkedData == null) {
                continue
            }

            // console.log(JSON.stringify(linkedData,2,null))
            // console.log("LINKED DATA ")
            // console.log(linkedData.rowKeys.byKey)
            // for(let bla of linkedData.rowKeys.byKey.keys()) {
            //    console.log(bla)
            //    console.log(linkedData.rowKeys.byKey.get(bla))
            // }

            for(let entry of rowData.entries()) {

                // let rowId = entry[0]

                let rowData = entry[1]
                if(rowData == null) {
                    continue
                }

                let cell = rowData[columnId]
                if(cell == null || cell.value == null) {
                    continue
                }

                let linkedKeys = JSON.parse(cell.value)
                // try {
                //     let linkedIds = JSON.parse(cell.value)
                // } catch(err) {
                //     continue
                // }

                console.log("LINKED CELL")

                for(let linkedKey of linkedKeys) {
                    // let linkedRowId = 
                    let linkedRow = linkedData.rowKeys.byKey.get(linkedKey)
                    // console.log(id)
                    console.log(linkedKey)
                    console.log(linkedRow)
                }

            }

        }
    }

    return {
        columnDefs: columnDefs,
        gridMetadata: gridMetadata,
        rows: rowData,
        rowKeys: loadRowKeyMaps ? { byId: rowKeyById, byKey: rowKeyByKey } : undefined
    }
}










router.post('/upload/clear-temp', [auth], async (req, res) => {
    try {
        await knex('files').where({is_temp: true}).del()
    } catch(err) {
        // ignore?
    }
    return res.status(200).send({})
})



const upload = multer({
    limits: {
        fileSize: 100*1024*1024,
        fieldSize: 100*1024*1024
    }})
    .fields([
        {
            name:'uploadId',
            maxCount:1
        }, {
            name:'file',
            maxCount:1
        }
    ])

router.post('/upload/file', [auth, upload], async (req, res) => {

    if(req.files === undefined || req.files.file === undefined || Array.isArray(req.files.file) == false) {
        throw new BackendError('Could not get file from request',400)
    }

    let file = undefined
    for(let f of req.files.file) {
        if(f.fieldname === 'file') {
            file = f
        }
    }

    if(file == undefined) {
        throw new BackendError('Could not get file from request',400)
    }

    console.log("file.size: " + file.size)
    console.log("file.buffer.length: " + file.buffer.length)

    if(typeof file.size !== 'number' || file.size <= 0 || !(file.buffer instanceof Buffer) || file.buffer.length <= 0 ) {
        throw new BackendError('Could not get file data from request',400)
    }

    if(file.originalname == undefined || file.originalname.length <= 0) {
        throw new BackendError('Could not get filename from request',400)
    }

    let filename = file.originalname

    console.log(req.body)

    let params = {}
    try {
        params = JSON.parse(req.body.params)
    } catch(e) {
        throw new BackendError('Could not parse params from request',400)
    }

    if(typeof params.uploadId === 'undefined' || params.uploadId.length <=0 ) {
        throw new BackendError('Could not get uploadId from request params',400)
    }
    let uploadId = params.uploadId

    console.log("uploadId: " + uploadId)

    try {
        var workbook = xlsx.read(file.buffer)
    } catch(err) {
        throw new BackendError("Could not parse excel file",400,err)
    }

    // put file in database
    const exist = await knex('files').where({id: uploadId}).first()
    if(typeof exist !== 'undefined') {
        throw new BackendError(`Internal Error. File already exist for uuid ${uploadId}`,500)
    }

    console.log("BUFFER FORMAT: " + (typeof file.buffer))

    try {
        await knex('files').insert([{
            id: uploadId,
            name: filename,
            filename: filename,
            is_temp: true,
            buffer: file.buffer
        }])
    } catch(err) {
        throw new BackendError(`Upload Error. Could not save file in database.`,500,err)
    }

    return res.status(200).send({})
})



router.post('/upload/sheet-names', [auth], async function (req, res, next) {

    if(typeof req.body === 'undefined' || typeof req.body.uploadId === 'undefined' || req.body.uploadId.length <=0 ) {
        throw new BackendError('Could not get uploadId from request',400)
    }
    const uploadId = req.body.uploadId

    let file = await knex('files').where({id: uploadId}).first()
    if(file == undefined) {
        throw new BackendError(`Could not find file for uploadId ${uploadId}`,400)
    }

    let workbook = null
    try {
        workbook = xlsx.read(file.buffer)
    } catch(err) {
        throw new BackendError("Internal Error: Could not open excel file",500,err)
    }

    if(Array.isArray(workbook['SheetNames'] == false) || workbook['SheetNames'].length <= 0) {
        throw new BackendError("Could not find any sheets in excel file",500)
    }

    res.send(workbook['SheetNames'])
})



router.post('/upload/sheet-columns', [auth], async function (req, res, next) {

    if(typeof req.body === 'undefined' || typeof req.body.uploadId === 'undefined' || req.body.uploadId.length <=0 ) {
        throw new BackendError('Could not get uploadId from request',400)
    }
    const uploadId = req.body.uploadId

    if(typeof req.body === 'undefined' || typeof req.body.gridId === 'undefined' || req.body.gridId.length <=0 ) {
        throw new BackendError("Missing gridId",400)
    }
    const gridId = req.body.gridId

    if(typeof req.body === 'undefined' || typeof req.body.sheetName === 'undefined' || req.body.sheetName.length <=0 ) {
        throw new BackendError("Missing sheetName",400)
    }
    const sheetName = req.body.sheetName

    let file = await knex('files').where({id: uploadId}).first()
    if(file == undefined) {
        throw new BackendError(`Could not find file for uploadId ${uploadId}`,400)
    }

    let workbook = null
    try {
        workbook = xlsx.read(file.buffer)
    } catch(err) {
        throw new BackendError("Internal Error: Could not open excel file",500,err)
    }

    let columnDefs = await loadColumnDefs(gridId)

    let excelData = xlsx.helper.parseRowsFromBuffer(file.buffer, sheetName, 1)

    res.send({
        gridColumns: columnDefs,
        excelColumns: excelData.columnNames
    })
})



async function processFile(params) {

    const { mode, userId, gridId, uploadId, sheetName, columnMapping } = params

    const debug = true
    const createPreview = mode === 'PREVIEW'
    const executeUpload = mode === 'EXECUTE'

    const preview = {
        columnInfo: {
            modifiedColumns: {}
        },
        rowInfo: {
            newlyInsertedRows: 0,
            modifiedRows: 0,
            unchangedRows: 0
        },
        cellInfo: {
            newlyInsertedCells: 0,
            modifiedCells: 0,
            unchangedCells: 0
        },
        errors: {
            illegalRowKeys: []
        }
    }

    // GET FILE FROM DATABASE
    let file = await knex('files').where({id: uploadId}).first()
    if(file == undefined) {
        throw new BackendError(`Could not find file for uploadId ${uploadId}`,400)
    }
    let excelData = xlsx.helper.parseRowsFromBuffer(file.buffer, sheetName, 1)

    // GET COLUMN DEFS AND GRID DATA FROM THE DATABASE
    let columnDefs = await loadColumnDefs(gridId)
    let gridData = await loadGridData(gridId,columnDefs)

    // PREPARE COLUMN MAPPING
    let columnMapper = {
        isActivated: new Map(),
        toSourceColumn: new Map(),
        getUpdateMode: new Map()
    }
    for(let entry of columnMapping) {
        columnMapper.isActivated.set(entry.id, entry.activated)
        columnMapper.toSourceColumn.set(entry.id, entry.sourceColumn)
        columnMapper.getUpdateMode.set(entry.id, entry.updateMode)
    }

    // GET ALL COLUMNS THAT BELONG TO THE ROW KEY
    let keyColumns = []
    for(let column of columnDefs.columns) {
        if(column.is_key) {
            // keyColumns.push(columnDefs.columnsById.get(column.id))
            keyColumns.push(column)
        }
    }
    if(debug) console.log("keyColumns: " + keyColumns)

    // LOAD ALL ROW KEYS FROM DATABASE
    let rowKeys = await knex('rows').where({ grid: gridId })
    const rowKeysById = new Map()
    const rowKeysByKey = new Map()
    for(let rowKey of rowKeys) {
        rowKeysById.set(rowKey.id, rowKey)
        rowKeysByKey.set(rowKey.key, rowKey)
    }
    // console.log("rowKeysById: " + rowKeysById)
    if(debug) console.log("rowKeysByKey: " + rowKeysByKey)

    // CREATE CHANGE EVENT (for execute mode only)
    var changeEventId = UUID.v4()
    if(executeUpload) {
        await knex('change_events').insert([{
            id: changeEventId,
            type: 'EXCEL_UPLOAD',
            timestamp: new Date(Date.now()).toISOString(),
            user: userId,
            grid: gridId,
            file: file.id
        }])
    }

    // START OF MAIN LOOP: ITERATE ROWS FROM EXCEL DATA
    let rowIndex = 0
    let rowModified = false
    for(let excelRow of excelData.rows) {

        rowIndex++
        rowModified = false

        if(debug) console.log("\n")
        if(debug) console.log("START PROCESSING EXCEL ROW: #" + rowIndex)
        // console.log(excelRow)

        // BUILD THE ROW KEY FOR THE GIVEN EXCEL ROW
        let skipRow = false
        let rowKey = {}
        for(let keyColumn of keyColumns) {
            const sourceColumn = columnMapper.toSourceColumn.get(keyColumn.id)
            const keyCell = excelRow[sourceColumn]
            console.log(keyCell)
            if(keyCell == undefined || keyCell == null || keyCell.value == null || keyCell.value == undefined) {
                if(debug) {
                    console.log("ERROR: Excel key column has no value: " + sourceColumn + " in excel row #" + rowIndex)
                }
                if(createPreview) {
                    preview.errors.illegalRowKeys.push({
                        rowIndex: rowIndex,
                        sourceColumn: sourceColumn,
                        targetColumn: keyColumn
                    })
                }
                skipRow = true
            } else {
                rowKey[keyColumn.id] = keyCell.value
            }
        }
        if(skipRow) {
            continue
        }
        console.log("Constructed RowKey")
        console.log(rowKey)

        // CHECK IF THE ROW KEY EXISTS
        let rowExists = false
        let rowId = undefined
        for(let rk of rowKeys) {
            let k = rk.key
            let check = true
            for(let v of Object.keys(rowKey)) {
                if(rowKey[v] !== k[v]) {
                    check = false
                    break
                }
            }
            if(check) {
                rowId = rk.id
                rowExists = true
                break
            }
        }
        console.log("exists: " + (rowExists ? 'JA' : 'NEIN'))

        // INSERT NEW ROW IF NOT EXIST
        if(rowExists === false) {
            console.log("insert new row key into database")
            if(executeUpload) {
                rowId = UUID.v4()
                let row = {
                    id: rowId,
                    grid: gridId,
                    key: rowKey
                }
                await knex('rows').insert(row)
            }
            if(createPreview) {
                preview.rowInfo.newlyInsertedRows++
            }
        }

        // ITERATE COLUMNS TO FETCH DATA FROM EXCL ROW
        for(let column of columnDefs.columns) {

            let columnId = column.id
            let columnLabel = column.label

            // CHECK IF COLUMN CAN BE SKIPPED
            if(columnMapper.isActivated.get(columnId) === false) {
                continue
            }

            // GET SOURCE COLUMN
            const sourceColumn = columnMapper.toSourceColumn.get(columnId)

            // GET COLUMN MODE
            const updateMode = columnMapper.getUpdateMode.get(columnId)

            console.log("\n")
            console.log("read value from excel column \"" + sourceColumn + "\" and map value to grid column " + columnLabel + " (" + columnId + ")")

            // GET CELL VALUE FROM EXCEL DATA
            let value = undefined
            let excelCell = excelRow[sourceColumn]
            console.log("excel cell:")
            console.log(JSON.stringify(excelCell))
            if(excelCell != undefined && excelCell != null && excelCell.value != undefined && excelCell.value != null) {

                console.log(typeof excelCell.value)
                if(excelCell.type === 'd') {
                    try {
                        value = excelCell.value.toISOString()
                    } catch(err) {
                        value = '#IMPORT_ERROR'         // TODO: ??!?
                    }
                } else if(typeof excelCell.value === 'string' && excelCell.value.length > 0) {
                    value = excelCell.value.trim()
                } else if(typeof excelCell.value !== 'string') {
                    try {
                        value = excelCell.value.toString().trim()
                    } catch(err) {
                        continue;
                    }
                }
            }
            console.log("excel value: " + value)

            // HANDLE NON EXISITING EXCEL VALUES DEPENDING ON THE COLUMN MODE
            if(value == undefined) {
                if(updateMode === 'KEEP') {
                    console.log("excel value is undefined: keep the old value (Mode KEEP)")
                    continue
                } else {
                    console.log("excel value is undefined: old value will be overwritten by the empty value (Mode DELETE)")
                }
            }

            // GET OLD CELL VALUE
            let oldValue = undefined
            let oldRow = gridData.rows.get(rowId)
            if(oldRow != undefined && oldRow[columnId] != undefined && oldRow[columnId].value != undefined) {
                oldValue = oldRow[columnId].value
            }

            // CHECK IF THE VALUE HAS BEEN CHANGED
            if(oldValue == undefined || oldValue == null || oldValue !== value) {
                if (createPreview) {
                    if(oldValue == undefined || oldValue == null) {
                        preview.cellInfo.newlyInsertedCells++
                    } else if(oldValue !== value) {
                        preview.cellInfo.modifiedCells++
                    }
                    if(rowExists === true && rowModified === false) {
                        rowModified = true
                        preview.rowInfo.modifiedRows++
                    }
                    if(preview.columnInfo.modifiedColumns[columnId] == null) {
                        preview.columnInfo.modifiedColumns[columnId] = 1
                    } else {
                        preview.columnInfo.modifiedColumns[columnId]++
                    }
                }
                if(executeUpload) {
                    console.log('insert cell')
                    await knex('cells').insert({
                        id: UUID.v4(),
                        grid: gridId,
                        column: columnId,
                        row: rowId,
                        change_event: changeEventId,
                        value: value == undefined ? null : value
                    })
                }
            } else {
                console.log("no change")
                if (createPreview) {
                    preview.cellInfo.unchangedCells++
                }
            }
        }

        if(createPreview && rowExists === true && rowModified === false) {
            preview.rowInfo.unchangedRows++
        }
    }



    // MAKE FILE PERMANENT
    if(executeUpload) {
        await knex('files').where({ id: uploadId }).update({ is_temp: false })
    }

    if(createPreview) {
        return preview
    }

    return {}
}





router.post('/upload/preview', [auth], async (req, res) => {

    if(typeof req.body === 'undefined' || typeof req.body.gridId === 'undefined' || req.body.gridId.length <=0 ) {
        throw new BackendError("Missing gridId",400)
    }
    const gridId = req.body.gridId
    
    if(typeof req.body === 'undefined' || typeof req.body.uploadId === 'undefined' || req.body.uploadId.length <=0 ) {
        throw new BackendError("Missing uploadId",400)
    }
    const uploadId = req.body.uploadId

    if(typeof req.body === 'undefined' || typeof req.body.sheetName === 'undefined' || req.body.sheetName.length <=0 ) {
        throw new BackendError("Missing sheetName",400)
    }
    const sheetName = req.body.sheetName

    if(typeof req.body === 'undefined' || typeof req.body.columnMapping === 'undefined' || req.body.columnMapping.length <=0 ) {
        throw new BackendError("Missing columnMapping",400)
    }
    const columnMapping = req.body.columnMapping

    const userId = req.auth.user.id
    if(userId == undefined || userId == null) {
        throw new BackendError("Could not get userId",400)
    }

    console.log("userId: " + userId)

    let params = {
        mode: 'PREVIEW',
        userId: userId,
        gridId: gridId,
        uploadId: uploadId,
        sheetName: sheetName,
        columnMapping: columnMapping
    }

    const result = await processFile(params)

    res.send(result)
})






router.post('/upload/execute', [auth], async (req, res) => {

    if(typeof req.body === 'undefined' || typeof req.body.gridId === 'undefined' || req.body.gridId.length <=0 ) {
        throw new BackendError("Missing gridId",400)
    }
    const gridId = req.body.gridId
    
    if(typeof req.body === 'undefined' || typeof req.body.uploadId === 'undefined' || req.body.uploadId.length <=0 ) {
        throw new BackendError("Missing uploadId",400)
    }
    const uploadId = req.body.uploadId

    if(typeof req.body === 'undefined' || typeof req.body.sheetName === 'undefined' || req.body.sheetName.length <=0 ) {
        throw new BackendError("Missing sheetName",400)
    }
    const sheetName = req.body.sheetName

    if(typeof req.body === 'undefined' || typeof req.body.columnMapping === 'undefined' || req.body.columnMapping.length <=0 ) {
        throw new BackendError("Missing columnMapping",400)
    }
    const columnMapping = req.body.columnMapping

    const userId = req.auth.user.id
    if(userId == undefined || userId == null) {
        throw new BackendError("Could not get userId",400)
    }

    console.log("userId: " + userId)

    let params = {
        mode: 'EXECUTE',
        userId: userId,
        gridId: gridId,
        uploadId: uploadId,
        sheetName: sheetName,
        columnMapping: columnMapping
    }

    const result = await processFile(params)

    res.send(result)
})




module.exports = router;















