// src/controllers/emailVerification.controller.js
const prisma = require('../db/prisma');
const {
  verifyEmailVerificationToken,
} = require('../utils/emailVerificationToken');
const { verifyEmailOtp } = require('../services/emailVerification.service');

// ============== VERIF VIA LINK TOKEN (LAMA) ==============
exports.verifyEmailHandler = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: 'Token tidak ditemukan' });
    }

    let payload;
    try {
      payload = verifyEmailVerificationToken(token);
    } catch (err) {
      return res.status(400).json({
        message: 'Token tidak valid atau sudah kadaluarsa',
      });
    }

    if (payload.type !== 'email_verification') {
      return res.status(400).json({ message: 'Token salah tipe' });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    if (user.emailVerified) {
      return res.json({
        status: 'success',
        message: 'Email sudah terverifikasi sebelumnya.',
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    res.json({
      status: 'success',
      message: 'Email berhasil diverifikasi. Silakan login.',
    });
  } catch (err) {
    next(err);
  }
};

// ============== VERIF VIA OTP (BARU) ==============
exports.verifyEmailOtpHandler = async (req, res, next) => {
  try {
    const result = await verifyEmailOtp(req.body);
    res.json({
      status: 'success',
      ...result,
    });
  } catch (err) {
    if (err.code === 'BAD_REQUEST') {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === 'EMAIL_NOT_FOUND') {
      return res.status(404).json({ message: 'Email tidak ditemukan. Silakan register ulang.' });
    }
    if (err.code === 'OTP_INVALID') {
      return res.status(400).json({ message: 'Kode OTP tidak valid' });
    }
    if (err.code === 'OTP_EXPIRED') {
      return res.status(400).json({ message: 'Kode OTP sudah kadaluarsa' });
    }
    next(err);
  }
};
