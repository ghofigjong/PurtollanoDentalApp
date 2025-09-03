// Simple nodemailer utility for sending emails
const nodemailer = require('nodemailer');

// Configure this with your SMTP provider
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.puertollanodental.com',
  port: process.env.SMTP_PORT || 465,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'noreply@puertollanodental.com',
    pass: process.env.SMTP_PASS || ')D.(l0~iTr-*',
  },
});

async function sendMail({ to, subject, text, html }) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@puertollanodental.com',
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendMail };
