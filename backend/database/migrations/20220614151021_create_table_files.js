/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('files', table => {
        table.uuid('id').primary()
        table.string('name')
        table.string('filename')
        table.boolean('is_temp').notNullable().defaultTo(true)
        table.binary('buffer')
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('files')
}
