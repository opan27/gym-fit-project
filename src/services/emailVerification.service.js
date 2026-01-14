// src/services/emailVerification.service.js
const prisma = require('../db/prisma');

async function verifyEmailOtp({ email, otp }) {
  if (!email || !otp) {
    const err = new Error('Email dan OTP wajib diisi');
    err.code = 'BAD_REQUEST';
    throw err;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error('Email tidak ditemukan');
    err.code = 'EMAIL_NOT_FOUND';
    throw err;
  }

  const otpFromBody = String(otp).trim();

  if (!user.otpCode || user.otpCode !== otpFromBody) {
    const err = new Error('Kode OTP tidak valid');
    err.code = 'OTP_INVALID';
    throw err;
  }

  if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
    const err = new Error('Kode OTP sudah kadaluarsa');
    err.code = 'OTP_EXPIRED';
    throw err;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerifiedAt: new Date(),
      otpCode: null,
      otpExpiresAt: null,
    },
  });

  return {
    message: 'Email berhasil diverifikasi',
  };
}

module.exports = {
  verifyEmailOtp,
};
