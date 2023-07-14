/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('change_events', table => {
        table.uuid('id').primary()
        table.string('type').notNullable()
        table.timestamp('timestamp', { useTz: false }).notNullable()
        table.uuid('user').notNullable()
        table.uuid('grid').notNullable()
        table.foreign('grid').references('id').inTable('grids')
        table.foreign('user').references('id').inTable('users')
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('change_events')
}
