exports.up = function (knex) {
    return knex.schema.table('columns', function (table) {
        table.string('filter_type')
    })
};

exports.down = function (knex) {
    return knex.schema.table('columns', function (table) {
        table.dropColumn('filter_type')
    })
};