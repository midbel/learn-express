const jwt = require("jsonwebtoken")

exports.generate = function(payload, secret) {
  const jid = new Date()
  return jwt.sign({
    data: payload
  }, secret, {
    expiresIn: '1h',
    issuer: 'learn-express',
    jwtid: jid.getTime().toString()
  });
}

exports.verify = function(token, secret) {
  return jwt.verify(token, secret)
}
