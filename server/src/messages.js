const commandTypes = {
  sendEmail: 'SendEmail',
}

const commands = {
  sendEmail(correlationId, emailType, to, subject, body, userId) {
    return {
      correlation_id: correlationId,
      type: commandTypes.sendEmail,
      payload: {
        emailType,
        to,
        subject,
        body,
        userId,
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
      correlation_id: correlationId,
      type: eventTypes.emailSent,
      payload: { emailType },
    }
  },
  userRegistered(correlationId, userId, email, password) {
    return {
      correlation_id: correlationId,
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
