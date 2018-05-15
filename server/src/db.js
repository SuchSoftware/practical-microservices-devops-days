const knex = require('knex')

function createDb ({ connectionString }) {
  const client = knex(connectionString)

  const retval = {
    client
  }

  /**
     * @description - Performs an upsert
     * @param {Object} params - the thing to upsert
     * @returns {Object} - The thing that was upserted
     */
  function upsert (params) {
    const { constraint, object, table } = params
    const insert = client(table).insert(object)
    const update = client.update(object)
    const raw = `${insert} ON CONFLICT (${constraint}) DO ${update} returning *`

    return client.raw(raw).then(res => res.rows[0])
  }

  retval.upsert = upsert

  return retval
}

module.exports = createDb
