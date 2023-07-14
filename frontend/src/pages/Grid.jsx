import React from 'react'

import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'

import { AgGridReact } from 'ag-grid-react'

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

import { v4 as uuidv4 } from 'uuid'

import PopoverButton from '../components/PopoverButton'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions, { dialogActionsClasses } from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '../components/DialogTitle'
import Checkbox from '@mui/material/Checkbox'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import GridsIcon from '@mui/icons-material/AutoAwesomeMotion'
import GridIcon from '@mui/icons-material/Article'
import HomeIcon from '@mui/icons-material/HomeRounded'
import DeleteIcon from '@mui/icons-material/Delete'

import { Icon as IconifyIcon, InlineIcon as IconifyIconInline } from "@iconify/react"
// import { as ExcelIcon } from "@iconify/icons-file-icons/microsoft-excel"

/*
import bla from "@iconify/icons-mdi-light/home"
import faceWithMonocle from "@iconify/icons-twemoji/face-with-monocle"
*/

import './Grid.scss'

import API from '../api/fetchAPI'

import { setToolbar } from '../store/toolbar'
import { setBreadcrumbs } from '../store/breadcrumbs'
// import { setGridSettings } from '../store/grid'
// import { setGridSortings, setGridFilterGlobalIncrement } from '../store/grid'
import * as GridStore from '../store/grid'

import { CellValueComparatorString, CellValueComparatorInteger, CellValueComparatorDecimal } from '../components/aggrid/CustomComparators'
import CustomSetFilter from '../components/aggrid/CustomSetFilter.jsx'
import createDateTimeFormater from '../components/aggrid/DateTimeFormatter.js'

import UploadIcon from '@mui/icons-material/Upload'
import RefreshIcon from '@mui/icons-material/Refresh'

import VerticalSeparator from '../components/VerticalSeparator'
import ExcelUpload from '../views/ExcelUpload'
import ExcelExport from '../views/ExcelExport'
import generateKey from '../util/generateKey'
import store from '../store/store'

import LinkedCellRenderer from '../components/aggrid/LinkedCellRenderer'
import { produce } from 'immer'

import SimpleList from '../components/SimpleList'





const ImportIcon = ({fontSize,className}) => <IconifyIcon fontSize={fontSize} className={className} icon="ph:import-bold"/>
const ExportIcon = ({fontSize,className}) => <IconifyIcon fontSize={fontSize} className={className} icon="ph:export-bold"/>
const ExcelIcon = ({fontSize,className}) => <IconifyIcon fontSize={fontSize} className={className} icon="file-icons:microsoft-excel"/>



const ColumnStateControl = ({columnApi,updateIncrement}) => {

    const toggleVisibility = columnState => () => {
        const column = columnApi.getColumn(columnState.colId)
        console.log("TOGGLE VISIBILITY: ")
        console.log(columnState)
        console.log(column)
        columnApi.applyColumnState({
            state: [{
                colId: columnState.colId,
                hide: column.visible
            }]
        })

    }

    const setAll = hide => () => {
        const columnState = columnApi.getColumnState()
        const newState = columnState.map( entry => ({ colId: entry.colId, hide: hide }) )
        // console.log(arr)
        columnApi.applyColumnState({ state: newState })
    }

    const renderList = () => {
        const columnState = columnApi.getColumnState()

        return(
            <>
                <span style={{display: 'none'}}>{updateIncrement}</span>
                <div className="buttons">
                    <Button
                        startIcon={<IconifyIcon icon="bxs:show"/>}
                        onClick={setAll(false)}
                    >
                        Show All
                    </Button>
                    <Button
                        startIcon={<IconifyIcon icon="bxs:hide"/>}
                        onClick={setAll(true)}
                    >
                        Hide All
                    </Button>
                </div>
                <List className="list" dense>
                    { columnState.map(columnStateEntry => {
                        const column = columnApi.getColumn(columnStateEntry.colId)
                        return(
                            <ListItem
                                className="item"
                                key={columnStateEntry.colId}
                                onClick={toggleVisibility(columnStateEntry)}
                            >
                                <ListItemIcon
                                    className="icon"
                                >
                                    <Checkbox
                                        className="checkbox"
                                        checked={columnStateEntry.hide == false}
                                        // edge="start"
                                        // 
                                        // tabIndex={-1}
                                        // disableRipple
                                        // inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    className="label"
                                    primary={column.colDef.headerName}
                                />
                            </ListItem>
                        )
                    })}
                </List>
            </>
        )
    }




        



    return (
        columnApi ? 
            <div className="column-state-control">
                { renderList() }
            </div>
         :
            null
    )
}







export default function Grid() {

    const routeParams = useParams()
    const navigate = useNavigate()

    const gridId = routeParams.gridId

    const dispatch = useDispatch()

    const rowCount = useSelector(state => state.grid[gridId]?.rowCount)
    const filterSummary = useSelector(state => state.grid[gridId]?.filterSummary)
    const sortings = useSelector(state => state.grid[gridId]?.sortings)
    const gridFilterGlobalIncrement = useSelector(state => state.grid[gridId]?.filter.globalIncrement)
    const columnState = useSelector(state => state.grid[gridId]?.columnState)

    const gridRef = React.useRef()

    const DateFormatter = createDateTimeFormater({type: 'date'})





    
    // const [expandedRows, setExpandedRows] = React.useState(new Map())
    const [hasExpandedRows, setHasExpandedRows] = React.useState(false)









    // const [test, setTest] = React.useState(0)

    const [gridMetadata, setGridMetadata] = React.useState({})
    const [columnDefs, setColumnDefs] = React.useState(null)
    const [data, setData] = React.useState(null)



    const [columnStateUpdateIncrement, setColumnStateUpdateIncrement] = React.useState(0)






    const buildBreadcrumbs = () => [
        {
            key: 'home',
            label: 'Home',
            path: '/home',
            icon: HomeIcon
        },
        {
            key: 'grids',
            label: 'Data Grids',
            path: '/grids',
            icon: GridsIcon
        },
        {
            key: 'grid',
            label: gridMetadata.name,
            path: `/grids/${gridMetadata.id}`,
            icon: GridIcon
        }
    ]

    React.useEffect(() => {
        // setUploadId(uuidv4())
        dispatch(setToolbar(renderToolbar()))
        // dispatch(setGridSettings(gridId,123))
    }, [gridId])

    React.useEffect(() => {
        dispatch(setBreadcrumbs(buildBreadcrumbs()))
    }, [gridMetadata])



    // DefaultColDef sets props common to all Columns
    const defaultColDef = React.useMemo(() => ({
        sortable: true
    }))



    // Example of consuming Grid Event
    const cellClickedListener = React.useCallback(event => {
        console.log('cellClicked', event)
    }, [])



    // Example load data from sever
    React.useEffect(() => {
        dispatch(GridStore.resetGrid(gridId))
        loadGridData()
    }, [gridId])







    const getRowId = params => params.data[0]

    const valueGetter = params => {
        let cell = params.data[1][params.column.colId]
        return cell ? cell.value : undefined
    }









    const updateRowCount = () => {
        if(gridRef?.current?.api == null) {
            return
        }
        const rowCount = {
            total: 0,
            afterFiltering: 0
        }
        gridRef.current.api.forEachNode( node => {
            if(!node.group) {
                rowCount.total++
            }
        })
        gridRef.current.api.forEachNodeAfterFilter( node => {
            if(!node.group) {
                rowCount.afterFiltering++
            }
        })
        dispatch(GridStore.setGridRowCount(gridId,rowCount))
    }





    const updateFilterSummary = () => {
        if(gridRef?.current?.api == null || gridRef?.current?.columnApi == null) {
            return
        }
        console.log("UPDATE FILTER SUMMARYYYIEIEEE")

        const filterModel = gridRef.current.api.getFilterModel()
        const colIds = Object.keys(filterModel)

        const filterSummary = []
        colIds.map( colId => {
            const column = gridRef.current.columnApi.getColumn(colId)
            const entry = {
                colId: colId,
                headerName: column.colDef.headerName
            }
            filterSummary.push(entry)
        })

        dispatch(GridStore.setGridFilterSummary(gridId,filterSummary))
    }



    React.useEffect(() => {

        // 1. update row count
        updateRowCount()

        // 2. update active filter summary
        updateFilterSummary()

    }, [gridFilterGlobalIncrement])



    function buildColumnDefs(columnsFromAPI) {
        console.log("BUILD COLUMN DEFINITIONS")
        let columnState = []                                    // column state to 
        let colDefs = []                                        // column defs for the grid
        for (let columnFromAPI of columnsFromAPI) {
            // console.log(JSON.stringify(columnFromAPI))
            // console.log(columnFromAPI)
            // consle.log(columnFromAPI.type)

            let colDef = {
                colId: columnFromAPI.id,
                // field: columnFromAPI.label,                          // field NICHT MEHR VERWENDEN!!! Daten immer nur ÜBER VALUE GETTER 
                headerName: columnFromAPI.label,
                filter: true,
                resizable: true,
                valueGetter: valueGetter,
                originalType: columnFromAPI.type        // der type aus der DB, hat für aggrid keine bedeutung
            }

            switch(columnFromAPI.type) {
                case 'string':
                    colDef.comparator = CellValueComparatorString
                    break
                case 'integer':
                    colDef.comparator = CellValueComparatorInteger
                    break
                case 'decimal':
                    colDef.comparator = CellValueComparatorDecimal
                    break
                case 'date':
                    colDef.valueFormatter = DateFormatter
                    break
                case '1-n':
                    colDef.autoHeight = true
                    colDef.cellRenderer = LinkedCellRenderer
                    // colDef.cellRendererParams = { flag: flag, toggleFlag: toggleFlag }

            }

            switch(columnFromAPI.filter_type) {
                case 'CustomSetFilter':
                    colDef.filter = CustomSetFilter
                    break
            }

            colDefs.push(colDef)
        }
        setColumnDefs(colDefs)
    }
















    function loadGridData() {
        const path = '/api/grid/get/' + gridId
        API.get(path, { doNotThrowFor: [404] }).then(data => {
            console.log("LOAD GRID DATA")
            console.log(data)

            buildColumnDefs(data.columns)

            setGridMetadata(data.gridMetadata)

            setData(data.data.map(entry => {
                entry.push({
                    isExpanded: false
                })
                return entry
            }))
        }).catch(err => {
            console.log(err)

            // anstatt auf 404 umzuleiten macht es hier vielleicht mehr sinn, innerhalb der komponenten einen "not found" error anzuzeigen
            navigate('/notfound')
        })
    }







    // Example using Grid's API
    const buttonListener = React.useCallback(e => {
        gridRef.current.api.deselectAll()
    }, [])

    const gridSizeChanged = () => {
        // gridRef.current.api.sizeColumnsToFit()
    }









    const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false)

    const openUploadDialog = () => {
        setUploadDialogOpen(true)
    }

    const closeUploadDialog = () => {
        setUploadDialogOpen(false)
        // setUploadId(uuidv4())
        loadGridData()
    }




    const [exportDialogOpen, setExportDialogOpen] = React.useState(false)

    const openExportDialog = () => {
        setExportDialogOpen(true)
    }

    const closeExportDialog = () => {
        setExportDialogOpen(false)
    }








    // Sorting API: clear sort, save sort, restore from save
    // https://www.ag-grid.com/react-data-grid/row-sorting/#sorting-api

    const handleRemoveSorting = colEntry => event => {
        console.log("REMOVE SORTING:")
        console.log(colEntry)

        gridRef.current.columnApi.applyColumnState({
            state: [{
                colId: colEntry.colId,
                sort: null
            }]
        })
    }

    const handleRemoveAllSortings = event => {
        gridRef.current.columnApi.applyColumnState({
            defaultState: { sort: null },
        })
    }




    const handleRemoveFilter = colEntry => event => {
        const filterInstance = gridRef.current.api.getFilterInstance(colEntry.colId)
        filterInstance.setModel(null)
        gridRef.current.api.onFilterChanged()
    }

    const handleRemoveAllFilters = event => {
        gridRef.current.api.setFilterModel(null)
    }






    const updateColumnStateControl = event => {
        console.log("UPDATE COLUMN STATE CONTROL")
        setColumnStateUpdateIncrement(columnStateUpdateIncrement+1)
    }

    const hiddenColumnCount = React.useMemo(() => {
        let count = {
            hiddenColumns: 0,
            totalColumns: 0
        }
        const columnApi = gridRef?.current?.columnApi
        if(columnApi != null) {
            const columnState = columnApi.getColumnState()
            for(let entry of columnState) {
                if(entry.hide) {
                    count.hiddenColumns++
                }
                count.totalColumns++
            }
        }
        return count
    }, [columnStateUpdateIncrement])







    const toggleExpand = (rowNode,state) => {

        // https://www.ag-grid.com/react-data-grid/row-height/

        console.log("toggleExpand")
        console.log(rowNode)
        console.log(state)
        console.log("rowIndex: " + rowNode.rowIndex)
        console.log(`data[${rowNode.rowIndex}]:`)
        console.log(data[rowNode.rowIndex])

        

        // setData innerhalb von aggrid ist eine möglichkeit, damit aggrid auch wirklich die row cells neu rendert
        // Man könnte auch die Daten im data state setzten, was allerdings aufwändiger ist. Es entsteht kein nachteil,
        // wenn man den expanded flag direkt über aggrig verwaltet und nicht über den data state. 
        rowNode.setData([
            rowNode.data[0],
            rowNode.data[1],
            {
                ...rowNode.data[2],
                isExpanded: state
            }
        ])

        // VERSCHIEDENE HEIGHT MODI

        // FUNKTIONIERT: Hier werden ALLE row heights erneut geholt und außerdem Positionen der Rows neu berechnet
        // gridRef.current.api.resetRowHeights()

        // FUNKTIONIERT AUCH UND RUFT NUR FÜR DIE GEÄNDERTE ROW DIE GET ROW HEIGHT AUF
        // rowNode.setRowHeight(state ? 200 : null)
        // gridRef.current.api.onRowHeightChanged()

        // FUNKTIONIERT AM BESTEN: AUTO ROW HEIGHT
        // https://www.ag-grid.com/react-data-grid/row-height/#auto-row-height
        // Der beste Ansatz. Für die column wird autoHeight = true gesetzt. Die zeilen höhe wird dann an die höhe des
        // Zelleninhalts angepasst. Die Zellen kann einfach dann je nach expanded flag gerendert werden.


        let hasExpandedRows = false
        gridRef.current.api.forEachNode( (rowNode, index) => {
            if(rowNode.data[2].isExpanded) {
                hasExpandedRows = true
            }
        })
        setHasExpandedRows(hasExpandedRows)

    }




    const rowClassRules = {
        'expanded': params => params.data[2].isExpanded
    }




    const renderToolbar = () =>
    <>
        <Tooltip title="Reload Grid">
            <IconButton aria-label="refresh" size="small">
                <RefreshIcon fontSize="small" />
            </IconButton>
        </Tooltip>
        <VerticalSeparator color={'#AAA'} />
        {/* <PopoverButton
            useSmallButton={true}
            useIconButton={false}
            useHover={false}
            buttonLabel="Import Export"
            buttonClass="inline-button"
            buttonKey="edit-column-settings"
            // buttonIcon={<IconifyIcon icon="fluent:edit-20-filled" />}
            buttonIcon={<IconifyIcon icon="ic:round-import-export" />}
            popoverId="edit-column-settings"
            popoverClass="testtesttest"
            paperClass="testtesttest"
            onOpen={()=>{}}
            onClose={()=>{}}
            // closeTrigger={null}
        >
            <SimpleList
                items={[
                    {
                        key: 'excel-import',
                        icon: ExcelIcon,
                        label: 'Excel Import',
                        // routerPath: '/profile'
                    },
                    {
                        key: 'excel-export',
                        icon: ExportIcon,
                        label: 'Excel Export',
                        // routerPath: '/profile'
                    }
                ]}
                // onClick={onClick}
            />
        </PopoverButton> */}
        <Button
            size="small"
            // startIcon={<UploadIcon />}
            onClick={openUploadDialog}
            // startIcon={<IconifyIcon icon={ExcelIcon}/>}
            startIcon={<IconifyIcon icon="clarity:import-line"/>}
        >
            Excel Import
        </Button>
        <VerticalSeparator color={'#AAA'} />
        <Button
            size="small"
            onClick={openExportDialog}
            startIcon={<IconifyIcon icon="clarity:export-line"/>}
        >
            Excel Export
        </Button>

    </>



    const renderUploadDialog = () =>
        <Dialog
            scroll='body'
            // maxWidth={false}
            fullWidth={true}
            maxWidth={'md'}
            open={uploadDialogOpen}
            onClose={closeUploadDialog}
        >
            <DialogTitle
                onClose={closeUploadDialog}
            >
                <IconifyIconInline icon="file-icons:microsoft-excel" style={{fontSize: '1.2rem', marginRight: '8px' /* color: '#227245'*/}}/>
                <span>Excel Import</span>
            </DialogTitle>

            <DialogContent>

                <ExcelUpload
                    gridId={gridId}
                    // uploadId={uploadId}
                    onClose={closeUploadDialog}
                />



                
            </DialogContent>


            {/* <DialogActions>
                <Button onClick={closeUploadDialog}>Close</Button>
            </DialogActions> */}

        </Dialog>




    const renderGrid = () =>
        <div className={`grid-container ag-theme-alpine ag-theme-alpine-modified`}>
            <AgGridReact
                className={`${hasExpandedRows ? 'has-expanded-rows' : ''}`}
                ref={gridRef} // Ref for accessing Grid's API

                columnDefs={columnDefs}             // Column Defs for Columns
                defaultColDef={defaultColDef}       // Default Column Properties

                rowData={data} // Row Data for Rows

                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                rowSelection='multiple' // Options - allows click selection of rows

                onCellClicked={cellClickedListener} // Optional - registering for Grid Event

                onGridSizeChanged={gridSizeChanged}
                getRowId={getRowId}

                suppressCellSelection={true}

                context={{
                    gridId: gridId,
                    toggleExpand: toggleExpand
                }}

                onFilterChanged={ event => {
                    console.log("onFilterChanged")
                    dispatch(GridStore.incrementGridFilterUpdateCount(gridId))
                }}

                onSortChanged={ event => {
                    const columnState = event.columnApi.getColumnState()
                    const sortings = []
                    for(let state of columnState) {
                        if(state.sort != null) {
                            let column = event.columnApi.getColumn(state.colId)
                            let sorting = {
                                colId: state.colId,
                                headerName: column.colDef.headerName,
                                sortDirection: state.sort,
                                sortIndex: state.sortIndex
                            }
                            sortings.push(sorting)
                            // console.log(state)
                        }
                    }
                    sortings.sort( (a,b) => a.sortIndex > b.sortIndex ? 1 : a.sortIndex < b.sortIndex ? -1 : 0 )
                    dispatch(GridStore.setGridSortings(gridId,sortings))
                }}

                onColumnVisible={updateColumnStateControl}
                onColumnMoved={updateColumnStateControl}

                // braucht man nicht, wenn man autoHeight verwendet
                // getRowHeight={getRowHeight}


                rowClassRules={rowClassRules}


            />

        </div>





        const renderFilterToolbar = () =>
            <div className="grid-filter-toolbar ag-theme-alpine">

                {/* COUNTS */}
                <div className="category active">
                    <IconifyIcon className="category-icon" icon="ic:round-numbers" />
                    <div className="text row-text">
                        <span className="primary">
                            {rowCount == null ? 0 : rowCount.afterFiltering} row{rowCount != null && rowCount.afterFiltering !== 1 ? 's' : null} showing
                        </span>
                        <span className="secondary">
                            {rowCount == null ? 0 : rowCount.total} total, {rowCount == null ? 0 : rowCount.total-rowCount.afterFiltering} filtered out
                        </span>
                    </div>
                </div>
                <div className="separator"></div>

                {/* COLUMNS */}
                <div className="category active">
                    <IconifyIcon className="category-icon" icon="fluent:column-triple-20-filled" />
                    <div className="text sorting-text">
                        <span className="primary">
                            { hiddenColumnCount.hiddenColumns > 0 ? `${hiddenColumnCount.hiddenColumns} column${hiddenColumnCount.hiddenColumns > 1 ? 's are' : ' is'} hidden` : "All columns are showing" }
                        </span>
                        <span className="secondary">
                            {/* <Tooltip title={"Edit column settings"}>
                            <div style={{}}> */}
                            <PopoverButton
                                useIconButton={true}
                                useHover={false}
                                buttonClass="inline-button"
                                buttonKey="edit-column-settings"
                                // buttonIcon={<IconifyIcon icon="fluent:edit-20-filled" />}
                                buttonIcon={<IconifyIcon icon="fluent:notepad-edit-16-regular" />}
                                popoverId="edit-column-settings"
                                popoverClass="testtesttest"
                                paperClass="testtesttest"
                                onOpen={()=>{}}
                                onClose={()=>{}}
                                // closeTrigger={null}
                            >
                                <ColumnStateControl
                                    columnApi={gridRef.current?.columnApi}
                                    updateIncrement={columnStateUpdateIncrement}
                                />
                            </PopoverButton>

                        </span>
                    </div>
                </div>

                <div className="separator"></div>

                {/* SORTINGS */}
                <div className={`category ${sortings != null && sortings.length > 0 ? 'active' : null}`}>
                    <IconifyIcon className="category-icon" icon="bi:sort-alpha-down" />
                    <div className="text sorting-text">
                        <span className="primary">
                            { sortings == null || sortings.length === 0 ? 'No' : sortings.length} sorting{sortings != undefined && sortings.length !== 1 ? 's' : null} active
                            { sortings == null || sortings.length <= 0 ? null :
                            <Tooltip title="Remove all sortings">
                                <IconButton
                                    disabled={sortings == undefined || sortings.length <= 0}
                                    className="inline-button"
                                    size="small"
                                    onClick={handleRemoveAllSortings}
                                >
                                    <IconifyIcon icon="icon-park-outline:delete-two" />
                                </IconButton>
                            </Tooltip>
                            }
                        </span>

                        <span className="secondary">
                        {
                            sortings != undefined && sortings.length > 0 ?
                            sortings.map(entry => 
                                <>
                                    {/* { sortings[0] === entry ? null : <>,&nbsp;&nbsp;</> } */}
                                    { entry.headerName }
                                    { entry.sortDirection === 'asc' ? <IconifyIcon style={{marginRight: '-2px'}} icon="fluent:arrow-sort-up-24-filled" /> : <IconifyIcon style={{marginRight: '-2px'}} icon="fluent:arrow-sort-down-24-filled" /> }
                                    <Tooltip title={`Remove sorting for '${entry.headerName}'`}>
                                        <IconButton
                                            // disabled={sortings == undefined || sortings.length <= 0}
                                            className="inline-button"
                                            size="small"
                                            onClick={handleRemoveSorting(entry)}
                                        >
                                            <IconifyIcon icon="icon-park-outline:delete-two" />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )
                            :
                            <>No entries</>
                        }
                        </span>
                    </div>
                </div>
                <div className="separator"></div>


                {/* FILTER */}
                <div className={`category ${filterSummary != null && filterSummary.length > 0 ? 'active' : null}`}>
                    <IconifyIcon className="category-icon" icon="dashicons:filter" />
                    <div className="text filter-text">
                        <span className="primary">
                            { filterSummary == null || filterSummary.length === 0 ? 'No' : filterSummary.length} filter{filterSummary != null && filterSummary.length !== 1 ? 's' : null} active
                            { filterSummary == null || filterSummary.length <= 0 ? null :
                            <Tooltip title="Remove all filters">
                                <IconButton
                                    disabled={filterSummary == null || filterSummary.length <= 0}
                                    className="inline-button"
                                    size="small"
                                    onClick={handleRemoveAllFilters}
                                >
                                    <IconifyIcon icon="icon-park-outline:delete-two" />
                                </IconButton>
                            </Tooltip>
                            }
                        </span>
                        <span className="secondary">
                        {
                            filterSummary != undefined && filterSummary.length > 0 ?
                            filterSummary.map(entry => 
                                <>
                                    { entry.headerName }
                                    <Tooltip title={`Remove filter for '${entry.headerName}'`}>
                                        <IconButton
                                            className="inline-button"
                                            size="small"
                                            onClick={handleRemoveFilter(entry)}
                                        >
                                            <IconifyIcon icon="icon-park-outline:delete-two" />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )
                            :
                            <>No entries</>
                        }
                        </span>
                    </div>
                </div>
                <div className="separator"></div>



            </div>









    return (
        <>
            {renderFilterToolbar()}
            {renderGrid()}
            {renderUploadDialog()}
            <ExcelExport
                open={exportDialogOpen}
                onClose={closeExportDialog}
                api={gridRef?.current?.api}
                columnApi={gridRef?.current?.columnApi}
                columnDefs={columnDefs}
            />
        </>
    )
}






