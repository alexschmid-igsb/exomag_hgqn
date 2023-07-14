/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('columns', table => {
        table.uuid('id').primary()
        table.uuid('grid')
        table.string('label')
        table.string('type')
        table.jsonb('context')
        table.boolean('is_key')        
        table.foreign('grid').references('id').inTable('grids')
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('columns')
}
