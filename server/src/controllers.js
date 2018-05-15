const cuid = require('cuid')

const messages = require('./messages')

function createControllers({ eventStore, queries }) {
  function handleLogin(context, email, password) {
    console.log('handleLogin', { context, email })

    return queries.findUserByEmailAndPassword(email, password)
  }

  function handleRegister(context, email, password) {
    const user = {
      id: cuid(),
      email,
      password,
    }

    const event = messages.events.userRegistered(
      context.correlationId,
      user.id,
      user.email,
      user.password,
    )

    const stream = `users:${user.id}`

    const sendEmailCommand = messages.commands.sendEmail(
      context.correlationId,
      'registration',
      user.email,
      'Welcome to the site!!1!',
      'We are so glad you are here',
      user.id,
    )

    return queries
      .findUserByEmail(email)
      .then(foundUser => {
        if (foundUser) {
          console.log('That email is taken')

          throw new Error('That email is already taken')
        }
      })
      .then(() => eventStore.emit(stream, [event]))
      .then(() => eventStore.emit('users', [sendEmailCommand]))
      .then(() => user)
      .catch(e => {
        if (e.message !== 'That email is already taken') {
          throw e
        }

        return null
      })
  }

  return {
    handleLogin,
    handleRegister,
  }
}

module.exports = createControllers
