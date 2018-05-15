const messages = require('../messages')

function createHandlers({ queries }) {
  return {}
}

function createQueries({ db }) {
  return {}
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
