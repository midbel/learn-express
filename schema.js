const Joi = require('joi')

exports.Signin = Joi.object().keys({
  email: Joi.string().email().required(),
  pass: Joi.string().min(6).required(),
})
