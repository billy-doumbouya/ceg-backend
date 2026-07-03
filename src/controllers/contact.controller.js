// src/controllers/contact.controller.js
const nodemailer = require("nodemailer");
const ContactSubmission = require("../models/ContactSubmission");
const asyncHandler = require("../middleware/asyncHandler");
const logger = require("../utils/logger");

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

const sendEmails = async ({ name, email, phone, subject, message }) => {
  const transporter = createTransporter();

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
};

// POST /contact — public
const sendContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const [dbResult, emailResult] = await Promise.allSettled([
    ContactSubmission.create({ name, email, phone, subject, message }),
    sendEmails({ name, email, phone, subject, message }),
  ]);

  if (dbResult.status === "rejected") {
    logger.error(`Échec sauvegarde contact DB: ${dbResult.reason?.message}`);
  }
  if (emailResult.status === "rejected") {
    logger.error(`Échec envoi email contact: ${emailResult.reason?.message}`);
  } else {
    logger.info(`Email de contact envoyé à: ${email}`);
  }

  // Échec seulement si LES DEUX ont échoué — sinon le message est quelque part
  if (dbResult.status === "rejected" && emailResult.status === "rejected") {
    return res.status(500).json({
      success: false,
      message: "Le message n'a pas pu être traité. Veuillez réessayer.",
    });
  }

  res.status(201).json({
    success: true,
    message: "Message envoyé avec succès",
    data: dbResult.status === "fulfilled" ? dbResult.value : null,
  });
});

// GET /contact/admin — admin
const getAllAdmin = asyncHandler(async (req, res) => {
  const data = await ContactSubmission.find().sort({ createdAt: -1 });
  res.json({ success: true, data });
});

// PATCH /contact/:id/read — admin
const markAsRead = asyncHandler(async (req, res) => {
  const item = await ContactSubmission.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true },
  );
  if (!item)
    return res
      .status(404)
      .json({ success: false, message: "Message introuvable" });
  res.json({ success: true, data: item });
});

// DELETE /contact/:id — admin
const remove = asyncHandler(async (req, res) => {
  const item = await ContactSubmission.findByIdAndDelete(req.params.id);
  if (!item)
    return res
      .status(404)
      .json({ success: false, message: "Message introuvable" });
  res.json({ success: true, message: "Message supprimé" });
});

module.exports = { sendContact, getAllAdmin, markAsRead, remove };
