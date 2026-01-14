// src/controllers/auth.controller.js
const { registerUser, loginUser, verifyEmailOtp } = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json({
      status: 'success',
      ...result,
    });
  } catch (err) {
    if (err.code === 'EMAIL_EXISTS') {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    res.json({
      status: 'success',
      ...result,
    });
  } catch (err) {
    if (err.code === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (err.code === 'EMAIL_NOT_VERIFIED') {
      return res.status(403).json({
        message: 'Email belum diverifikasi. Silakan cek email atau minta kirim ulang verifikasi.',
      });
    }
    next(err);
  }
};

exports.verifyEmailOtp = async (req, res, next) => {
  try {
    const result = await verifyEmailOtp(req.body);
    res.json({
      status: 'success',
      ...result,
    });
  } catch (err) {
    if (err.code === 'OTP_INVALID') {
      return res.status(400).json({ message: 'Kode OTP tidak valid' });
    }
    if (err.code === 'OTP_EXPIRED') {
      return res.status(400).json({ message: 'Kode OTP sudah kadaluarsa' });
    }
    next(err);
  }
};
