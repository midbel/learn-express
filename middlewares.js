const Joi = require('joi')

exports.validate = function(schema) {
  return (req, res, next) => {
    try {
      Joi.attempt(req.body, schema)
      next()
    } catch(error) {
      res.status(400).json("invalid data supplied")
    }
  }
}
