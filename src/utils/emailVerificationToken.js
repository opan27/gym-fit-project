const jwt = require('jsonwebtoken');

const EMAIL_VERIFY_SECRET = process.env.EMAIL_VERIFY_SECRET || 'email-verify-secret';
const EMAIL_VERIFY_EXPIRES_IN = '24h';

function generateEmailVerificationToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      type: 'email_verification',
    },
    EMAIL_VERIFY_SECRET,
    { expiresIn: EMAIL_VERIFY_EXPIRES_IN }
  );
}

function verifyEmailVerificationToken(token) {
  return jwt.verify(token, EMAIL_VERIFY_SECRET);
}

module.exports = {
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
};
