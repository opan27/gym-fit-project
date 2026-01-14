// src/utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmailVerificationMail(to, verifyUrlOrText) {
  // kalau kamu pakai URL (link), bentuk HTML button
  const isUrl = verifyUrlOrText.startsWith('http') || verifyUrlOrText.startsWith('exp://');

  const html = isUrl
    ? `
      <p>Hai,</p>
      <p>Terima kasih sudah mendaftar di GymFit.</p>
      <p>Klik tombol di bawah untuk verifikasi email kamu:</p>
      <p>
        <a href="${verifyUrlOrText}"
           style="
             display:inline-block;
             padding:12px 20px;
             background-color:#1a73e8;
             color:#ffffff;
             text-decoration:none;
             border-radius:4px;
             font-weight:600;
           ">
          Verifikasi Email
        </a>
      </p>
      <p>Jika kamu tidak merasa mendaftar, abaikan email ini.</p>
    `
    : `
      <p>Hai,</p>
      <p>Terima kasih sudah mendaftar di GymFit.</p>
      <p>Kode verifikasi GymFit kamu: <b>${verifyUrlOrText}</b></p>
      <p>Jika kamu tidak merasa mendaftar, abaikan email ini.</p>
    `;

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: 'Verifikasi Email GymFit',
    html,
  });
}

module.exports = {
  sendEmailVerificationMail,
};
