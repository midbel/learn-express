const express = require('express');
const cors = require('cors');
const repo = require('./repo.js');
const passport = require('passport');
const { validate, basic, bearer } = require('./middlewares.js');
const { Signin } = require('./schema.js');
const jwt = require('./token.js');

const app = express();
const port = 3001;

const secretkey = 'supersecretkey';

app.use(express.json());
app.use(cors());

app.post('/signin', validate(Signin), async (req, res) => {
  try {
    const item = await repo.authenticate(req.body.email, req.body.pass);
    const data = {
      item,
      token: jwt.generate(item, secretkey),
    };
    res.status(200).json(data);
  } catch (err) {
    res.status(401).json('bad credential provided');
  }
});

passport.use(basic);
passport.use(bearer);

const profile = express.Router();
profile.use(passport.authenticate(['basic', 'bearer'], { session: false }));

profile.get('/:id', async (req, res) => {
  try {
    const item = await repo.getProfile(req.params.id);
    res.status(200).json(item);
  } catch (err) {
    res.status(404).send('profile not found');
  }
});

profile.get('/', async (req, res) => {
  try {
    const list = await repo.getProfiles();
    res.status(list.length ? 200 : 204).json(list);
  } catch (err) {
    res.status(400).send(err.toString());
  }
});

app.use('/profiles', profile);

exports.run = function () {
  app.listen(port, () => {
    console.log(`resume running on :${port}`);
  });
};
