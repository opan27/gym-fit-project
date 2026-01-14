// src/middlewares/auth.js
const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // normalisasi ke { id, email } supaya konsisten
    req.user = { id: decoded.userId, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
