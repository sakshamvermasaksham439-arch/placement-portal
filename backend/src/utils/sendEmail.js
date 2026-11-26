// Optional email notifications. If SMTP_* env vars are missing, the email is only logged (app never breaks).
const nodemailer = require('nodemailer');
let transporter = null;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}
module.exports = async function sendEmail(to, subject, text) {
  try {
    if (!transporter) { if (process.env.NODE_ENV !== 'test') console.log(`[email skipped] to=${to} subject="${subject}"`); return; }
    await transporter.sendMail({ from: process.env.EMAIL_FROM || 'Placement Portal <no-reply@portal.local>', to, subject, text });
  } catch (e) { console.error('Email failed:', e.message); }
};
