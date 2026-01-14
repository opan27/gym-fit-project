// src/services/auth.service.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../db/prisma');
const config = require('../config/env');
const { sendEmailVerificationMail } = require('../utils/mailer');

const SALT_ROUNDS = 10;

async function registerUser({ email, password, name }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email already registered');
    err.code = 'EMAIL_EXISTS';
    throw err;
  }

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  // generate OTP 6 digit
  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

  await prisma.user.create({
    data: {
      email,
      password: hash,
      name,
      emailVerified: false,
      otpCode: otp,
      otpExpiresAt: expires,
    },
  });

  await sendEmailVerificationMail(
    email,
    `Kode verifikasi GymFit kamu: ${otp}`
  );

  return {
    message: 'Registrasi berhasil. Cek email untuk kode OTP verifikasi.',
  };
}

async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error('Invalid credentials');
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    const err = new Error('Invalid credentials');
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  if (!user.emailVerified) {
    const err = new Error('Email not verified');
    err.code = 'EMAIL_NOT_VERIFIED';
    throw err;
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn || '7d' }
  );

  return {
    user: { id: user.id, email: user.email, name: user.name },
    token,
  };
}

async function verifyEmailOtp({ email, otp }) {
  if (!email || !otp) {
    const err = new Error('Email dan OTP wajib diisi');
    err.code = 'BAD_REQUEST';
    throw err;
  }

  const user = await prisma.user.findUnique({ where: { email } });

  const otpFromBody = String(otp).trim();

  if (!user || !user.otpCode || user.otpCode !== otpFromBody) {
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

  return { message: 'Email berhasil diverifikasi' };
}

module.exports = {
  registerUser,
  loginUser,
  verifyEmailOtp,
};
