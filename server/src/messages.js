const commandTypes = {
  sendEmail: 'sendEmail',
}

const commands = {
  sendEmail(correlationId, to, subject, body) {
    return {
      correlationId,
      type: commandTypes.sendEmail,
      payload: {
        to,
        subject,
        body,
      },
      timestamp: new Date(),
    }
  },
}

const eventTypes = {
  emailSent: 'EmailSent',
  userRegistered: 'UserRegistered',
}

// The functions create event objects for us, so that we can have some measure
//   of confidence that we're creating those correctly
const events = {
  emailSent(correlationId, emailType) {
    return {
      correlationId,
      type: eventTypes.emailSent,
      payload: { emailType },
    }
  },
  userRegistered(correlationId, userId, email, password) {
    return {
      correlationId,
      type: eventTypes.userRegistered,
      payload: {
        id: userId,
        email,
        password,
      },
      timestamp: new Date(),
    }
  },
}

exports.commands = commands
exports.commandTypes = commandTypes
exports.events = events
exports.eventTypes = eventTypes
