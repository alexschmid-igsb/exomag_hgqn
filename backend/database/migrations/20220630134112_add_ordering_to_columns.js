exports.up = function (knex) {
    return knex.schema.table('columns', function (table) {
        table.integer('ordering')
    })
};

exports.down = function (knex) {
    return knex.schema.table('columns', function (table) {
        table.dropColumn('ordering')
    })
};