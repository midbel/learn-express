const express = require('express')
const cors = require('cors')
const Joi = require('joi')
const repo = require('./repo.js')
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
const BearerStrategy = require('passport-http-bearer').Strategy

const app = express()
const port = 3001

const Signin = Joi.object().keys({
  email: Joi.string().email().required(),
  pass: Joi.string().min(6).required(),
})

function validate(schema) {
  return (req, res, next) => {
    try {
      Joi.attempt(req.body, schema)
      next()
    } catch(error) {
      res.status(400).json("invalid data supplied")
    }
  }
}


app.use(express.json())
app.use(cors())

app.post('/signin', validate(Signin), async (req, res) => {
  try {
    const item = await repo.authenticate(req.body.email, req.body.pass)
    res.status(200).json(item)
  } catch(err) {
    res.status(401).json('bad credential provided')
  }
})

const basic = new BasicStrategy((user, pass, done) => {
  console.log("basic:", user, pass)
  done(null, {})
})
const bearer = new BearerStrategy((token, done) => {
  console.log("bearer:", token)
  done(null, {})
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
