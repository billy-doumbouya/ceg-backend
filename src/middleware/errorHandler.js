// src/middleware/errorHandler.js
// Gestionnaire d'erreurs global Express — centralise toutes les erreurs

const logger = require("../utils/logger");

/**
 * Middleware d'erreur global (4 paramètres obligatoires pour Express)
 */
const errorHandler = (err, req, res, next) => {
  // Log de l'erreur
  logger.error(`${err.message} | Route: ${req.method} ${req.originalUrl}`);

  // Erreur de validation Mongoose
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Erreur de validation",
      errors: messages,
    });
  }

  // Erreur de cast Mongoose (mauvais ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "ID invalide",
    });
  }

  // Erreur de duplication MongoDB (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `La valeur '${err.keyValue[field]}' existe déjà pour le champ '${field}'`,
    });
  }

  // Erreur Multer (upload fichier)
  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: `Erreur d'upload : ${err.message}`,
    });
  }

  // Erreur personnalisée avec status
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Erreur serveur interne";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * Middleware 404 — route non trouvée
 */
const notFound = (req, res, next) => {
  const err = new Error(`Route non trouvée : ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

module.exports = { errorHandler, notFound };
