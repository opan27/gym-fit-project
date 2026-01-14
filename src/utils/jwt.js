const jwt = require('jsonwebtoken');

exports.signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
