function createQueries({ db }) {
  // user should have id, email, and password
  function createUser(user) {
    return db.client('users').insert(user)
  }

  function findUserByEmail(email) {
    return db
      .client('users')
      .where({ email })
      .limit(1)
      .then(rows => rows[0])
  }

  function findUserByEmailAndPassword(email, password) {
    return db
      .client('users')
      .where({ email, password })
      .limit(1)
      .then(rows => rows[0])
  }

  return { createUser, findUserByEmail, findUserByEmailAndPassword }
}

module.exports = createQueries
