exports.up = function up(knex) {
  return knex.schema.createTable('subscriber_positions', table => {
    table.string('id').primary()
    table.integer('position')
  })
}

exports.down = knex => knex.schema.dropTable('subscriber_positions')
