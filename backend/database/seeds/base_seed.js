const { v4: uuidv4 } = require('uuid')
const argon2 = require('argon2')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {

    function randHex(len) {
        let maxlen = 8
        let min = Math.pow(16, Math.min(len, maxlen) - 1)
        let max = Math.pow(16, Math.min(len, maxlen)) - 1
        let n = Math.floor(Math.random() * (max - min + 1)) + min
        let r = n.toString(16).toUpperCase()
        while (r.length < len) {
            r = r + randHex(len - maxlen);
        }
        return r;
    }

    function randBool() {
        return Math.random() > 0.5
    }

    // remove all
    await knex('cells').del()
    await knex('change_events').del()
    await knex('rows').del()
    await knex('columns').del()
    await knex('grids').del()
    await knex('grid_groups').del()
    await knex('users').del()



    // insert users
    const admin = {
        id: uuidv4(),
        username: 'MMustermann',
        email: 'admin@domain.de',
        password: await argon2.hash("123456"),
        firstname: 'Max',
        lastname: 'Mustermann',
        site: 'Bonn',
        role: 'Software Engineer',
        isAdmin: true,
        
        actions: {
            activation: {
                token: null,
                when: null
            },
            resetPassword:  {
                token: null,
                when: null
            }
        }
    }

    const user = {
        id: uuidv4(),
        username: 'HHasenkamp',
        email: 'heribert@hasenkamp.de',
        password: await argon2.hash("abc"),
        firstname: 'Heribert',
        lastname: 'Hasenkamp',
        site: 'München',
        role: 'Humangenetik',
        isAdmin: false,

        actions: {
            activation: {
                token: null,
                when: null
            },
            resetPassword:  {
                token: null,
                when: null
            }
        }
    }

    await knex('users').insert([
        admin,
        user
    ])




    // insert group
    var groupId = uuidv4()
    await knex('grid_groups').insert([
        { id: groupId, name: 'root', ordering: 1 }
    ])

    // insert grid
    // var gridId = uuidv4()
    var gridId = '93d023fa-3d76-476c-a7aa-f03d6dc4fe73'

    await knex('grids').insert([
        { id: gridId, group: groupId, name: 'Cases', ordering: 1 }
    ])










    // insert columns

    let columnKeys = [
        'internal case ID',
        'external case ID',
        'sequencing lab',
        'GestaltMatcher ID',
        'Face2Gene ID',
        'age in years',
        'sex',
        'referring clinician',
        'Start der Diagnostik',
        'Befunddatum',
        'HPO terms',
        'bisherige Diagnostik',
        'single/duo/trio',
        'disease category',
        'case solved/unsolved/unclear',
        'disease gene',
        'if new disease gene, level of evidence',
        'pmid',
        'HGVS_cDNA',
        'HGVS_gDNA',
        'zygosity',
        'de novo',
        'ACMG class',
        'ClinVar Accession ID',
        'mode of inheritance',
        'autozygosity',
        'secondary/incidental findings',
        'changes in management/therapy after test',
        'relevant findings for research'
    ]


    let columns = {
        'internal case ID': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: true,
            ordering: 10
        },
        'external case ID': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 20
        },
        'sequencing lab': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: true,
            ordering: 30
        },
        'GestaltMatcher ID': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 40
        },
        'Face2Gene ID': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 50
        },
        'age in years': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 60
        },
        'sex': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 70
        },
        'referring clinician': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 80
        },
        'Start der Diagnostik': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'date',
            context: null,
            is_key: false,
            ordering: 90
        },
        'Befunddatum': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'date',
            context: null,
            is_key: false,
            ordering: 100
        },
        'HPO terms': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 110
        },
        'bisherige Diagnostik': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 120
        },
        'single/duo/trio': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 130
        },
        'disease category': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 140
        },
        'case solved/unsolved/unclear': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 150
        },
        'disease gene': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 160
        },
        'if new disease gene, level of evidence': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 170
        },
        'pmid': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 180
        },
        'HGVS_cDNA': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 190
        },
        'HGVS_gDNA': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 200
        },
        'zygosity': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 210
        },
        'de novo': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 220
        },
        'ACMG class': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 230
        },
        'ClinVar Accession ID': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 240
        },
        'mode of inheritance': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 250
        },
        'autozygosity': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 260
        },
        'secondary/incidental findings': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 270
        },
        'changes in management/therapy after test': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 280
        },
        'relevant findings for research': {
            id: uuidv4(),
            label: "",
            gridId: gridId,
            type: 'string',
            context: null,
            is_key: false,
            ordering: 290
        },
    }



    let seedColumns = []

    for (let columnKey of columnKeys) {
        let column = columns[columnKey]
        let seedColumn = {
            id: column.id,
            grid: column.gridId,
            label: columnKey,
            type: column.type,
            context: column.context,
            is_key: column.is_key,
            ordering: columns.ordering
        }
        seedColumns.push(seedColumn)
    }

    await knex('columns').insert(seedColumns)








    // TEST DATA


    // change event
    var changeId = uuidv4()
    await knex('change_events').insert([{
        id: changeId,
        type: 'excel_upload',
        timestamp: '12.03.2022 12:34:56.123', // Math.floor(Date.now() / 1000),
        user: admin.id,
        grid: gridId
    }])





    let data = {
        'internal case ID': [
            'DE34NGSUKBD119637_931_I',
            'DE03NGSUKBD119613_923_I',
            'DE19NGSUKBD119616_924_I',
            'DE35NGSUKBD119619_925_I',
            'DE67NGSUKBD119625_927_I',
            'DE83NGSUKBD119628_928_I',
            'DE18NGSUKBD119634_930_I'
        ],

        'sequencing lab': [
            'Bonn',
            'Bonn',
            'Bonn',
            'Bonn',
            'Bonn',
            'Bonn',
            'Bonn'
        ],

        'GestaltMatcher ID': [
            '7050',
            '7051',
            '7052',
            '7053',
            '7054',
            'n/a',
            '7055'
        ],

        'Face2Gene ID': [
            '607103',
            '602039',
            '603611',
            '567203',
            '636011',
            '639288',
            '656905'
        ],

        'age in years': [
            '3',
            '4',
            '2',
            '2',
            '1',
            '7',
            '0.5'
        ],

        'sex': [
            'female',
            'female',
            'female',
            'female',
            'male',
            'female',
            'male'
        ],

        'referring clinician': [
            'Ekanem Ekure',
            'Ekanem Ekure',
            'Ekanem Ekure',
            'Ekanem Ekure',
            'Ekanem Ekure',
            'Ekanem Ekure',
            'Ekanem Ekure'
        ],

        'Start der Diagnostik': [
            '09/02/2021',
            '09/12/2021',
            '09/12/2021',
            '09/12/2021',
            '09/12/2021',
            '09/12/2021',
            '09/12/2021'
        ],

        'Befunddatum': [
            '24/01/2022',
            '24/01/2022',
            null,
            '24/01/2022',
            null,
            '24/01/2022',
            '24/01/2022'
        ],

        'HPO terms': [
            'Delayed speech and language development,Hypertelorism ,Global developmental delay ,Depressed nasal bridge ,Epicanthus ,Atrial septal defect ,Long palm ,Long philtrum ,Low-set, posteriorly rotated ears ,Muscular hypotonia ,Anteverted nares ,Short nose ,Seizures ,Scoliosis ,Congenital microcephaly ,Telecanthus ,Short ear',
            'Macrocephaly,Low-set ears,Protruding ear,Hypermelanotic macule,Global developmental delay,Failure to thrive,Ventricular septal defect,Hypertrophic cardiomyopathy,Pes planus,Genu valgum,Peripheral pulmonary artery stenosis,Depressed nasal bridge,Multiple cafe-au-lait spots, Thick vermilion border',
            'Hypertelorism, Protruding ear, Strabismus, Deeply set eye, Global developmental delay, Failure to thrive, Patent foramen ovale, Elbow flexion contracture, Depressed nasal bridge, Prominent forehead, Biventricular noncompaction cardiomyopathy, Increased size of nasopharyngeal adenoids',
            'Short finger, Short toe, Hypertelorism, Depressed nasal bridge, Low-set ears, Short nose, Pes planus, Patent ductus arteriosus after birth at term, Unilateral cleft lip, Unilateral cleft palate, Macrocephaly, Frontal bossing',
            'Hydrocephalus,Macrocephaly,Hypertelorism,Short philtrum,Broad forehead,Low-set ears,Proptosis,Depressed nasal bridge,Unilateral cleft lip,Bilateral cleft palate',
            'Hypertelorism,Highly arched eyebrow,Short stature,Epicanthus,Craniofacial asymmetry,Low-set ears,Anteverted nares,Unilateral narrow palpebral fissure,Short attention span,Absent fifth toenail,Thin upper lip vermilion',
            'Cryptorchidism,Micropenis,Microcephaly,Long eyelashes,Synophrys,Postaxial hand polydactyly,Growth delay,Pulmonary artery stenosis,Depressed nasal bridge,Neurodevelopmental abnormality,Thick hair'
        ],

        'single/duo/trio': [
            'trio',
            'trio',
            'trio',
            'trio',
            'duo',
            'trio',
            'trio'
        ],

        'disease category': [
            'neurodevelopmental',
            'neurodevelopmental',
            'neurodevelopmental',
            'neurodevelopmental',
            'neurodevelopmental',
            'developmental',
            'neurodevelopmental'
        ],

        'case solved/unsolved/unclear': [
            'solved',
            'solved',
            'unsolved',
            'solved',
            'unsolved',
            'solved',
            'solved'
        ],

        'disease gene': [
            'SOS1',
            'PTPN11',
            null,
            'DVL1',
            null,
            'X Monosomy',
            'NIPBL'
        ],

        'HGVS_cDNA': [
            'SOS1(NM_005633.4):c.508A>G;(p.Lys170Glu)',
            'PTPN11(NM_002834.5):c.1381G>A;(p.Ala461Thr)',
            null,
            'DVL1(NM_004421.3):c.1562del;(p.Pro521HisfsTer128)',
            null,
            null,
            'NIPBL(NM_133433.4):c.7948dup;(p.Ile2650AsnfsTer11)'
        ],

        'HGVS_gDNA': [
            'NC_000002.11:g.135744418C>T GRCh37:2:135744418:C:T NC_000002.12:g.134986848C>T	GRCh38:2:134986848:C:T',
            'NC_000012.11:g.112926248G>A GRCh37:12:112926248:G:A NC_000012.12:g.112488444G>A GRCh38:12:112488444:G:A',
            null,
            'NC_000001.10:g.1273438del	GRCh37:1:1273433:TG:T NC_000001.11:g.1338058del	GRCh38:1:1338053:TG:T',
            null,
            null,
            'NC_000005.9:g.37063979dup	GRCh37:5:37063977:C:CA NC_000005.10:g.37063877dup GRCh38:5:37063875:C:CA'
        ],

        'zygosity': [
            'heterozygous',
            'heterozygous',
            null,
            'heterozygous',
            null,
            null,
            null
        ],

        'de novo': [
            'ja',
            'ja',
            null,
            'ja',
            null,
            'ja',
            'ja'
        ],

        'ACMG class': [
            'pathogenic',
            'pathogenic',
            null,
            'pathogenic',
            null,
            null,
            'pathogenic'
        ],

        'ClinVar Accession ID': [
            'VCV000040651.20',
            'VCV000013342.16',
            null,
            'VCV000208049.1',
            null,
            null,
            'VCV001328515.1'
        ],

        'mode of inheritance': [
            'dominant',
            'dominant',
            null,
            'dominant',
            null,
            null,
            'dominant'
        ],

        'external case ID': [
            '931',
            null,
            null,
            null,
            null,
            null,
            '930'
        ],

        'bisherige Diagnostik': [
            null,
            null,
            'MLPA P245-Microdeletion Syndro',
            null,
            'MLPA P245-Microdeletion Syndro',
            null,
            null
        ]
    }




    let nRows = data['internal case ID'].length

    let idA = columns['sequencing lab'].id
    let idB = columns['internal case ID'].id

    let rows = []

    for (let i = 0; i < nRows; i++) {

        let rowKey = {}
        rowKey[idA] = data['sequencing lab'][i]
        rowKey[idB] = data['internal case ID'][i]

        let row = {
            id: uuidv4(),
            grid: gridId,
            key: rowKey
        }

        rows.push(row)
    }

    await knex('rows').insert(rows)



    let cells = []

    for(let columnKey of columnKeys) {

        let columnId = columns[columnKey].id
        let columnData = data[columnKey]

        if(columnData === undefined || columnData == null) {
            // spalten zu denen es keine daten gibt werden übersprungen
            continue
        }

        for (let i = 0; i < nRows; i++) {

            let rowId = rows[i].id

            let value = columnData[i]

            if(value !== undefined && value !== null && value.length > 0) {

                let cell = {
                    id: uuidv4(),
                    grid: gridId,
                    column: columnId,
                    row: rowId,
                    value: value,
                    change_event: changeId
                }
                cells.push(cell)
            }
        }
    }
    await knex('cells').insert(cells)


}
