const bodyParser = require('body-parser')
const cuid = require('cuid')
const express = require('express')
const path = require('path')

const createControllers = require('./controllers')
const createDb = require('./db')
const createQueries = require('./queries')

// ? Como se dice "for development only"?
const awesomeHardwiredDbConnectionString = 'postgres://pm:pm@pm_db:5432/pm'

const db = createDb({ connectionString: awesomeHardwiredDbConnectionString })
const queries = createQueries({ db })
const controllers = createControllers({ queries })

function attachContextToRequest(req, res, next) {
  req.context = {
    correlationId: cuid(),
  }

  next()
}

// Set up the express app
const app = express()

app.set('views', path.join(__dirname, 'templates'))
app.set('view engine', 'pug')

app.use(attachContextToRequest)
app.use(bodyParser.urlencoded({ extended: false }))

app.route('/').get((req, res) => res.redirect('/login'))

app
  .route('/login')
  .get((req, res) => res.render('login'))
  .post((req, res) => {
    controllers
      .handleLogin(req.context, req.body.email, req.body.password)
      .then(user => {
        if (!user) {
          res.send('no login')
        } else {
          res.send('yes, you logged in')
        }
      })
  })

app
  .route('/register')
  .get((req, res) => res.render('register'))
  .post((req, res) => {
    controllers
      .handleRegister(req.context, req.body.email, req.body.password)
      .then(user => {
        if (!user) {
          return res.send('no register')
        }

        return res.send('yay, registered!')
      })
  })

app.listen(3000)

console.log('listening on 3000')
