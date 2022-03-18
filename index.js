const express = require('express')
const cors = require('cors')
const repo = require('./repo.js')
const passport = require('passport')
const { validate } = require('./middlewares.js')
const { Signin } = require('./schema.js')
const jwt = require("./token.js")
const BasicStrategy = require('passport-http').BasicStrategy
const BearerStrategy = require('passport-http-bearer').Strategy

const app = express()
const port = 3001

const secretkey = "supersecretkey"


app.use(express.json())
app.use(cors())

app.post('/signin', validate(Signin), async (req, res) => {
  try {
    const item = await repo.authenticate(req.body.email, req.body.pass)
    const data = {
      item,
      token: jwt.generate(item, secretkey)
    }
    res.status(200).json(data)
  } catch(err) {
    res.status(401).json('bad credential provided')
  }
})

const testuser = {
  user: 'admin',
  pass: 'supersecretpassword'
}

const basic = new BasicStrategy((user, pass, done) => {
  if (user === testuser.user && pass === testuser.pass) {
    done(null, testuser)
    return
  }
  done(new Error("invalid credentials provided"))
})

const bearer = new BearerStrategy((token, done) => {
  try {
    const data = jwt.verify(token, secretkey)
    done(null, data)
  } catch(err) {
    done("invalid token provided")
  }
})

passport.use(basic)
passport.use(bearer)

const profile = express.Router()
profile.use(passport.authenticate(['basic', 'bearer'], { session: false }))

profile.get('/:id', async (req, res) => {
  try {
    const item = await repo.getProfile(req.params.id)
    res.status(200).json(item)
  } catch(err) {
    res.status(404).send(err.toString())
  }
})

profile.get('/', async (req, res) => {
  try {
    const list = await repo.getProfiles()
    res.status(list.length ? 200 : 204).json(list)
  } catch(err) {
    res.status(400).send(err.toString())
  }
})

app.use('/profiles', profile)

app.listen(port, () => { console.log(`resume running on :${port}`) })
