const messages = require('../messages')

function sendEmail(to, subject, body) {
  console.log('Sent email to', to, 'with subject', subject, 'and body', body)

  return Promise.resolve(true)
}

function createHandlers({ eventStore }) {
  return {
    users: {
      [messages.commandTypes.sendEmail]: command => {
        const sentEvent = messages.events.emailSent(
          command.correlation_id,
          command.payload.emailType,
        )

        const stream = `users:${command.payload.userId}`

        return sendEmail(
          command.payload.to,
          command.payload.subject,
          command.payload.body,
        ).then(() => eventStore.emit(stream, [sentEvent]))
      },
    },
  }
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
