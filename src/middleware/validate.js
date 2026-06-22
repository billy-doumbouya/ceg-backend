// src/middleware/validate.js
// Middleware pour vérifier les résultats de express-validator

const { validationResult } = require("express-validator");

/**
 * Vérifie les erreurs de validation et renvoie une réponse 400 si erreurs
 * À placer après les règles de validation dans les routes
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Données invalides",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }

  next();
};

module.exports = validate;
