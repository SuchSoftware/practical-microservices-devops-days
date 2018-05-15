const cuid = require('cuid')

function createControllers({ queries }) {
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

    return queries
      .findUserByEmail(email)
      .then(foundUser => {
        if (foundUser) {
          console.log('That email is taken')

          throw new Error('That email is already taken')
        }
      })
      .then(() => queries.createUser(user))
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
