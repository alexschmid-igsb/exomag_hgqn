exports.up = function (knex) {
    return knex.schema.table('cells', function (table) {
        table.text('value').alter()
    })
};

exports.down = function (knex) {
};