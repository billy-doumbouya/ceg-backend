// src/models/Admin.js
// Modèle Admin — 1 document unique avec 3 mots de passe hashés

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    // Identifiant unique fixe — jamais modifié
    identifier: {
      type: String,
      default: "ceg_admin",
      unique: true,
    },

    // 3 mots de passe hashés — l'un des 3 permet la connexion
    passwords: {
      type: [String],
      validate: {
        validator: (arr) => arr.length === 3,
        message: "Exactement 3 mots de passe sont requis",
      },
    },

    // Dernière connexion
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

/**
 * Compare un mot de passe en clair avec les 3 mots de passe hashés
 * @param {string} password - Mot de passe en clair à vérifier
 * @returns {boolean} true si l'un des 3 correspond
 */
adminSchema.methods.comparePasswords = async function (password) {
  for (const hash of this.passwords) {
    const match = await bcrypt.compare(password, hash);
    if (match) return true;
  }
  return false;
};

module.exports = mongoose.model("Admin", adminSchema);
