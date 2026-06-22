// src/middleware/asyncHandler.js
// Wrapper try-catch pour éviter les try-catch répétitifs dans les controllers

/**
 * Enveloppe une fonction async et capture automatiquement les erreurs
 * Usage : router.get("/", asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
