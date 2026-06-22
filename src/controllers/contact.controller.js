// src/controllers/contact.controller.js
// Envoi d'email via Nodemailer

const nodemailer = require("nodemailer");
const asyncHandler = require("../middleware/asyncHandler");
const logger = require("../utils/logger");

// Création du transporteur email
const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false, // TLS
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

/**
 * POST /api/contact
 * Envoie un email de contact
 */
const sendContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const transporter = createTransporter();

  // Email reçu par l'ONG
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: process.env.MAIL_TO,
    replyTo: email,
    subject: `[Contact CEG] ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #15803D; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">ONG C.E.G — Nouveau Message</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; width: 120px;">Nom :</td><td style="padding: 8px;">${name}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Email :</td><td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Téléphone :</td><td style="padding: 8px;">${phone || "Non renseigné"}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Sujet :</td><td style="padding: 8px;">${subject}</td></tr>
          </table>
          <hr style="margin: 20px 0; border: 1px solid #ddd;" />
          <h3 style="color: #15803D;">Message :</h3>
          <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        <div style="padding: 15px; background: #e8f5e9; text-align: center; font-size: 12px; color: #666;">
          Message reçu le ${new Date().toLocaleString("fr-FR")}
        </div>
      </div>
    `,
  });

  // Email de confirmation à l'expéditeur
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Votre message a bien été reçu — ONG C.E.G",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #15803D; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">ONG C.E.G</h1>
          <p style="color: #a7f3d0; margin: 5px 0 0;">Club Environnemental de Guinée</p>
        </div>
        <div style="padding: 30px;">
          <p>Bonjour <strong>${name}</strong>,</p>
          <p>Nous avons bien reçu votre message concernant <strong>"${subject}"</strong>.</p>
          <p>Notre équipe vous répondra dans les plus brefs délais.</p>
          <p>Merci de votre intérêt pour nos activités de protection de l'environnement en Guinée.</p>
          <br/>
          <p style="color: #666;">Cordialement,<br/><strong>L'équipe ONG C.E.G</strong></p>
        </div>
        <div style="padding: 15px; background: #f0fdf4; text-align: center; font-size: 12px; color: #666;">
          Km 66/Maléah Centre I — Préfecture de Forécariah, République de Guinée<br/>
          📧 contact@clubenvironnementaldeguinee.org | 📞 (+224) 612 41 34 24
        </div>
      </div>
    `,
  });

  logger.info(`Email de contact reçu de: ${email}`);
  res.json({ success: true, message: "Message envoyé avec succès" });
});

module.exports = { sendContact };
