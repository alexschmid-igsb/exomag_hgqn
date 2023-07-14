exports.up = function (knex) {
    return knex.schema.table('columns', function (table) {
        table.string('format_string')
    })
};

exports.down = function (knex) {
    return knex.schema.table('columns', function (table) {
        table.dropColumn('format_string')
    })
};