/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('rows', table => {
        table.uuid('id').primary()
        table.uuid('grid').notNullable()
        table.jsonb('key').unique()
        table.foreign('grid').references('id').inTable('grids')
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('rows')
}
