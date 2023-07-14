/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('grids', table => {
        table.uuid('id').primary()
        table.uuid('group').notNullable()
        table.string('name').notNullable()
        table.integer('ordering')
        table.foreign('group').references('id').inTable('grid_groups');
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('grids')
}



