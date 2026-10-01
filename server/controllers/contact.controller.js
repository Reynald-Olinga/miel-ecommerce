import nodemailer from 'nodemailer';

export const sendContactEmail = async (name, email, subject, message) => {
  // Créer un transporteur (à configurer avec vos informations SMTP)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true pour 465, false pour les autres ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Options de l'email
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.CONTACT_EMAIL,
    subject: `[Contact] ${subject}`,
    text: message,
    html: `<p>Nouveau message de ${name} (${email})</p>
           <p>Sujet: ${subject}</p>
           <p>Message:<br>${message}</p>`
  };

  // Envoyer l'email
  await transporter.sendMail(mailOptions);
};