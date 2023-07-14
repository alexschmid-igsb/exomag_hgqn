exports.up = function (knex) {
    return knex.schema.table('change_events', function (table) {
        table.uuid('file')
        table.foreign('file').references('id').inTable('files')
    })
};

exports.down = function (knex) {
    return knex.schema.table('change_events', function (table) {
        table.dropColumn('file')
    })
};