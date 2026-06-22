// src/middleware/auth.js
// Middleware de vérification de session admin

/**
 * Vérifie que l'admin est connecté via session
 * Protège toutes les routes privées du dashboard
 */
const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAdmin === true) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: "Non autorisé — Veuillez vous connecter",
  });
};

/**
 * Vérifie si déjà connecté (pour la page login)
 */
const redirectIfAuth = (req, res, next) => {
  if (req.session && req.session.isAdmin === true) {
    return res.status(200).json({
      success: true,
      message: "Déjà connecté",
      alreadyLoggedIn: true,
    });
  }
  next();
};

module.exports = { requireAuth, redirectIfAuth };
