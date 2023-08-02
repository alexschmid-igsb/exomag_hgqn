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
        username: 'Admin',
        email: 'admin@domain.de',
        password: await argon2.hash('123'),
        firstname: 'Max',
        lastname: 'Mustermann',
        site: 'Bonn',
        role: 'Software Engineer',
        isAdmin: true,
        isRegistered: true
    }

    const user = {
        id: uuidv4(),
        username: 'User',
        email: 'heribert@hasenkamp.de',
        password: await argon2.hash('abc'),
        firstname: 'Heribert',
        lastname: 'Hasenkamp',
        site: 'München',
        role: 'Humangenetik',
        isAdmin: false,
        isRegistered: true
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







    /*

    // ALT

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

    */





    // aus der aktuellen datenbank:





    /*
    
                      id                  |                 grid                 |                  label                   |  type   | context | is_key | ordering |   filter_type   | format_string 
    --------------------------------------+--------------------------------------+------------------------------------------+---------+---------+--------+----------+-----------------+---------------
     ce9741c7-99b7-40a4-8d20-c4b0b8752d67 | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | internal case ID                         | string  |         | t      |       10 |                 | 
     6d30294d-39eb-4e79-9922-4974836cb8d4 | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | external case ID                         | string  |         | f      |       20 |                 | 
     f869f3b8-0753-46e7-8e13-4ae7028fdae7 | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | sequencing lab                           | string  |         | t      |       30 | CustomSetFilter | 
     88f9b832-3ed7-4a41-a6ba-2c147162ff7c | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | GestaltMatcher ID                        | string  |         | f      |       40 |                 | 
     ea0027d2-2243-4bde-ab2b-7646706c7ce1 | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | Face2Gene ID                             | string  |         | f      |       50 |                 | 
     06202eba-7bdd-4c40-a808-fdae7f5b2c3b | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | age in years                             | integer |         | f      |       60 |                 | 
     3061cd97-5222-4a0a-98cd-ccf428533cb6 | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | sex                                      | string  |         | f      |       70 | CustomSetFilter | 
     81f36aa6-5dc6-40ae-8d7b-cf25d514dc8a | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | referring clinician                      | string  |         | f      |       80 |                 | 
     a03ed607-ab47-409f-8faf-945897ee6be8 | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | Start der Diagnostik                     | date    |         | f      |       90 |                 | 
     79360e97-cd56-4a42-bed5-3ee96a2b9a72 | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | Befunddatum                              | date    |         | f      |      100 |                 | 
     48373ac2-e2b7-4cec-9902-78e527eb8986 | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | HPO terms                                | string  |         | f      |      110 |                 | 
     f01f43f2-184b-49bc-a7de-ac8d3df01e7e | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | bisherige Diagnostik                     | string  |         | f      |      120 |                 | 
     48e69998-5c4e-4d78-8671-7ac73967ab31 | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | Selektivvertrag                          | string  |         | f      |      125 | CustomSetFilter | 
     d03e2984-337b-49ed-8006-c41d4677f939 | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | single/duo/trio                          | string  |         | f      |      130 | CustomSetFilter | 
     b8cf5983-19c7-4a71-b77b-595a4388f92d | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | disease category                         | string  |         | f      |      140 | CustomSetFilter | 
     78f4a1e4-6316-4f8a-aeac-a25977d62035 | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | case solved/unsolved/unclear             | string  |         | f      |      150 | CustomSetFilter | 
     b5337569-491b-4efe-ac95-f36c1742caa0 | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | disease gene                             | string  |         | f      |      160 |                 | 
     6f975add-3b39-41c9-8815-f3d7abb551a6 | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | if new disease gene, level of evidence   | string  |         | f      |      170 |                 | 
     8a7a8118-b6bb-4128-8ba0-8147b9ffa41c | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | pmid                                     | string  |         | f      |      180 |                 | 
     ce7b7316-1ec8-4c68-8bb7-850b0294779b | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | HGVS_cDNA                                | string  |         | f      |      190 |                 | 
     c67f889e-a671-47a8-93bc-e89bd6c08f1c | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | HGVS_gDNA                                | string  |         | f      |      200 |                 | 
     57c9625f-1c56-4dfe-9a34-0537c5452f93 | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | zygosity                                 | string  |         | f      |      210 |                 | 
     acdc3bca-d493-47df-998d-7b22bfe213fc | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | de novo                                  | string  |         | f      |      220 | CustomSetFilter | 
     c51cdaf2-b409-41f3-a648-7e6f221a354d | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | ACMG class                               | string  |         | f      |      230 | CustomSetFilter | 
     29d37ddc-3996-4a10-8c29-bd620b0c3f2a | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | ClinVar Accession ID                     | string  |         | f      |      240 |                 | 
     7efa68b8-b685-4c91-90b8-0ef46e0e1cb8 | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | mode of inheritance                      | string  |         | f      |      250 | CustomSetFilter | 
     607dbffd-f410-4ceb-8259-7bb488417466 | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | autozygosity                             | decimal |         | f      |      260 |                 | 
     77d82833-825b-4ae4-8519-6968cbc38e6c | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | secondary/incidental findings            | string  |         | f      |      270 |                 | 
     356dfa50-5a1a-4ba4-95ca-d80ffbf449b0 | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | changes in management/therapy after test | string  |         | f      |      280 |                 | 
     0f336973-9fa6-47be-9dbd-04fe00aba4c4 | 93d023fa-3d76-476c-a7aa-f03d6dc4fe73 | relevant findings for research           | string  |         | f      |      290 |                 | 
    (30 rows)
    
    
    CREATE TEMP VIEW bla AS SELECT regexp_replace(
                format( E'{ '
                     '   id: uuidv4(), '
                     '   grid: gridId, '
                     '   label: %s, '
                     '   type: %s, '
                     '   context: %s, '
                     '   is_key: %s, '
                     '   ordering: %s, '
                     '   filter_type: %s, '
                     '   format_string: %s '
                    '}, ',
                    CASE WHEN label IS NOT NULL THEN CONCAT('"',label,'"') ELSE 'null' END,
                    CASE WHEN type IS NOT NULL THEN CONCAT('"',type,'"') ELSE 'null' END,
                    CASE WHEN context IS NOT NULL THEN CONCAT('"',context,'"') ELSE 'null' END,
                    CASE WHEN is_key THEN 'true' ELSE 'false' END,
                    CASE WHEN ordering IS NOT NULL THEN ordering ELSE null END,
                    CASE WHEN filter_type IS NOT NULL THEN CONCAT('"',filter_type,'"') ELSE 'null' END,
                    CASE WHEN format_string IS NOT NULL THEN CONCAT('"',format_string,'"') ELSE 'null' END
                ),
                '"null"',
                'null'
            )
    FROM
        columns
    ORDER BY
        ordering;
    
    \copy (SELECT * FROM bla) TO 'out.alex';
    
    */


    let columns = [

        { id: uuidv4(), grid: gridId, label: "internal case ID", type: "string", context: null, is_key: true, ordering: 10, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "sequencing lab", type: "string", context: null, is_key: true, ordering: 20, filter_type: "CustomSetFilter", format_string: null },
        { id: uuidv4(), grid: gridId, label: "external case ID", type: "string", context: null, is_key: false, ordering: 30, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "GestaltMatcher ID", type: "string", context: null, is_key: false, ordering: 40, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "Face2Gene ID", type: "string", context: null, is_key: false, ordering: 50, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "prenatal", type: "integer", context: null, is_key: false, ordering: 60, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "DoB", type: "date", context: null, is_key: false, ordering: 70, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "age in months", type: "integer", context: null, is_key: false, ordering: 80, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "age in years", type: "integer", context: null, is_key: false, ordering: 90, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "sex", type: "string", context: null, is_key: false, ordering: 100, filter_type: "CustomSetFilter", format_string: null },
        { id: uuidv4(), grid: gridId, label: "referring clinician", type: "string", context: null, is_key: false, ordering: 110, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "Start der Diagnostik", type: "date", context: null, is_key: false, ordering: 120, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "Befunddatum", type: "date", context: null, is_key: false, ordering: 130, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "HPO terms", type: "string", context: null, is_key: false, ordering: 140, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "bisherige Diagnostik", type: "string", context: null, is_key: false, ordering: 150, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "Selektivvertrag", type: "string", context: null, is_key: false, ordering: 160, filter_type: "CustomSetFilter", format_string: null },
        { id: uuidv4(), grid: gridId, label: "single/duo/trio", type: "string", context: null, is_key: false, ordering: 170, filter_type: "CustomSetFilter", format_string: null },
        { id: uuidv4(), grid: gridId, label: "disease category", type: "string", context: null, is_key: false, ordering: 180, filter_type: "CustomSetFilter", format_string: null },
        { id: uuidv4(), grid: gridId, label: "case solved/unsolved/unclear", type: "string", context: null, is_key: false, ordering: 190, filter_type: "CustomSetFilter", format_string: null },
        { id: uuidv4(), grid: gridId, label: "changes in management/therapy after test", type: "string", context: null, is_key: false, ordering: 200, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "relevant findings for research", type: "string", context: null, is_key: false, ordering: 210, filter_type: null, format_string: null },
        // { id: uuidv4(), grid: gridId, label: "secondary/incidental findings", type: "string", context: null, is_key: false, ordering: 270, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "Test conducted", type: "string", context: null, is_key: false, ordering: 220, filter_type: "CustomSetFilter", format_string: null },
        { id: uuidv4(), grid: gridId, label: "wet lab meta info", type: "string", context: null, is_key: false, ordering: 230, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "AutoCasc", type: "string", context: null, is_key: false, ordering: 240, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "autozygosity", type: "decimal", context: null, is_key: false, ordering: 250, filter_type: null, format_string: null },

        { id: uuidv4(), grid: gridId, label: "gene", type: "string", context: null, is_key: false, ordering: 260, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "variant_solves_case", type: "string", context: null, is_key: false, ordering: 270, filter_type: "CustomSetFilter", format_string: null },
        { id: uuidv4(), grid: gridId, label: "if new disease gene, level of evidence", type: "string", context: null, is_key: false, ordering: 280, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "pmid", type: "string", context: null, is_key: false, ordering: 290, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "ISCN", type: "string", context: null, is_key: false, ordering: 300, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "HGVS_cDNA", type: "string", context: null, is_key: false, ordering: 310, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "HGVS_gDNA", type: "string", context: null, is_key: false, ordering: 320, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "HGVS_protein", type: "string", context: null, is_key: false, ordering: 330, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "ACMG class", type: "string", context: null, is_key: false, ordering: 340, filter_type: "CustomSetFilter", format_string: null },
        { id: uuidv4(), grid: gridId, label: "zygosity", type: "string", context: null, is_key: false, ordering: 350, filter_type: null, format_string: null },
        { id: uuidv4(), grid: gridId, label: "de novo", type: "string", context: null, is_key: false, ordering: 360, filter_type: "CustomSetFilter", format_string: null },
        { id: uuidv4(), grid: gridId, label: "mode of inheritance", type: "string", context: null, is_key: false, ordering: 370, filter_type: "CustomSetFilter", format_string: null },
        { id: uuidv4(), grid: gridId, label: "ClinVar Accession ID", type: "string", context: null, is_key: false, ordering: 380, filter_type: null, format_string: null },
    ]

    await knex('columns').insert(columns)



    // TODO
    // Die columns zentral irgendwo definieren. Dann können folgendes automatisch generiert werden:
    //   * Excel Template
    //   * Seed
    //   * Updatescript welches die columns anpasst ohne den seed neu laufen zu lassen
    //   * ....

    









    return


    

    // todo: beispielsdaten neu machen


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

    for (let columnKey of columnKeys) {

        let columnId = columns[columnKey].id
        let columnData = data[columnKey]

        if (columnData === undefined || columnData == null) {
            // spalten zu denen es keine daten gibt werden übersprungen
            continue
        }

        for (let i = 0; i < nRows; i++) {

            let rowId = rows[i].id

            let value = columnData[i]

            if (value !== undefined && value !== null && value.length > 0) {

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
