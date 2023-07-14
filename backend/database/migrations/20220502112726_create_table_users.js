/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('users', table => {
        table.uuid('id').primary()
        table.string('username').notNullable().unique()
        table.string('email').notNullable().unique()
        table.string('password')
        table.string('firstname')
        table.string('lastname')
        table.string('site')
        table.string('role')
        table.boolean('isAdmin').notNullable()

        // Beim aufspielen des Updates müssen die Datenbanken der produktivversionen angepasst werden bzgl folgender änderungen:
        table.jsonb('actions').notNullable()
        // table.boolean('isRegistered').notNullable()
        // table.string('registryToken')
        // table.timestamp('registrySendWhen')
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('users')
}
