/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('cells', table => {
        table.uuid('id').primary()

        table.uuid('grid').notNullable()
        table.uuid('column').notNullable()
        table.uuid('row').notNullable()
        table.uuid('change_event').notNullable()

        table.string('value',2000)      // will be changed to 'text' in a subsequent migration

        table.foreign('grid').references('id').inTable('grids');
        table.foreign('column').references('id').inTable('columns');
        table.foreign('row').references('id').inTable('rows');
        table.foreign('change_event').references('id').inTable('change_events');
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('cells')
}
