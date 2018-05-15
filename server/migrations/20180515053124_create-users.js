exports.up = function up (knex) {
  return knex.schema.createTable('users', table => {
    table.string('id').primary()
    table.string('email')
    table.string('password')
  })
}

exports.down = knex => knex.schema.dropTable('users')
