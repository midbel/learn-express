const Joi = require('joi');
const jwt = require('./token.js');
const BasicStrategy = require('passport-http').BasicStrategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

exports.validate = function (schema) {
  return (req, res, next) => {
    try {
      Joi.attempt(req.body, schema);
      next();
    } catch (error) {
      res.status(400).json('invalid data supplied');
    }
  };
};

const testuser = {
  user: 'admin',
  pass: 'supersecretpassword',
};

exports.basic = new BasicStrategy((user, pass, done) => {
  if (user === testuser.user && pass === testuser.pass) {
    done(null, testuser);
    return;
  }
  done(new Error('invalid credentials provided'));
});

const secretKey = 'supersecretkey';

exports.bearer = new BearerStrategy((token, done) => {
  try {
    const data = jwt.verify(token, secretKey);
    done(null, data);
  } catch (err) {
    done('invalid token provided');
  }
});
