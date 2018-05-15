exports.up = function up(knex) {
  return knex.schema.createTable('messages', table => {
    table.increments()
    table.string('type')
    table.string('stream_type')
    table.string('stream_id')
    table.string('correlation_id')
    table.json('payload')
    table.timestamp('timestamp').defaultTo(knex.fn.now())
  })
}

exports.down = knex => knex.schema.dropTable('messages')
