import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,      // ex: smtp.gmail.com
  port: process.env.SMTP_PORT,      // 587 ou 465
  secure: false,                    // true pour 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;