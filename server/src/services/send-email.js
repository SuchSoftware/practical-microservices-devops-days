const messages = require('../messages')

function createHandlers({ queries }) {
  return {}
}

function createSendEmailService({ eventStore }) {
  const handlers = createHandlers({ eventStore })

  function subscribeToStore() {
    eventStore.subscribe('service:send-email', handlers)
  }

  return {
    subscribeToStore,
  }
}

module.exports = createSendEmailService
