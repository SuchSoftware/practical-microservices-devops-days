const messages = require('../messages')

function createHandlers({ queries }) {
  return {
    users: {
      [messages.eventTypes.userRegistered]: event =>
        queries.createUser(event.payload),
    },
  }
}

function createQueries({ db }) {
  function createUser(user) {
    return db.client('users').insert(user)
  }

  return { createUser }
}

function createUserCredentialsAggregator({ db, eventStore }) {
  const queries = createQueries({ db })
  const handlers = createHandlers({ queries })

  function subscribeToStore() {
    eventStore.subscribe('aggregator:user-credentials', handlers)
  }

  return {
    subscribeToStore,
  }
}

module.exports = createUserCredentialsAggregator
