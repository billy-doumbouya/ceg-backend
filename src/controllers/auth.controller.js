// src/controllers/auth.controller.js
// Gestion de l'authentification admin avec session

const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const asyncHandler = require("../middleware/asyncHandler");
const logger = require("../utils/logger");

/**
 * POST /api/auth/login
 * Connexion admin — vérifie l'un des 3 mots de passe
 */
const login = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, message: "Mot de passe requis" });
  }

  const admin = await Admin.findOne({ identifier: "ceg_admin" });
  if (!admin) {
    return res.status(500).json({ success: false, message: "Admin non configuré" });
  }

  const isValid = await admin.comparePasswords(password);
  if (!isValid) {
    logger.warn(`Tentative de connexion échouée depuis IP: ${req.ip}`);
    return res.status(401).json({ success: false, message: "Mot de passe incorrect" });
  }

  // Création de la session
  req.session.isAdmin = true;
  req.session.loginAt = new Date();

  // Mise à jour dernière connexion
  admin.lastLogin = new Date();
  await admin.save();

  logger.info(`Admin connecté depuis IP: ${req.ip}`);

  res.json({
    success: true,
    message: "Connexion réussie",
    lastLogin: admin.lastLogin,
  });
});

/**
 * POST /api/auth/logout
 * Déconnexion — destruction de la session
 */
const logout = asyncHandler(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Erreur lors de la déconnexion" });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Déconnecté avec succès" });
  });
});

/**
 * GET /api/auth/me
 * Vérifie si l'admin est connecté
 */
const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    isAdmin: true,
    loginAt: req.session.loginAt,
  });
});

module.exports = { login, logout, me };
