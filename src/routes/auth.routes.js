// src/routes/auth.routes.js
const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const emailVerificationController = require('../controllers/emailVerification.controller');

// register & login
router.post('/register', authController.register);
router.post('/login', authController.login);

// verifikasi email via token (kalau masih mau dipakai)
router.get('/verify-email', emailVerificationController.verifyEmailHandler);

// verifikasi email via OTP (dipakai mobile)
router.post('/verify-otp', authController.verifyEmailOtp);

module.exports = router;
