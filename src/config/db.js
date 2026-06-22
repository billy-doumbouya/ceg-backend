// src/config/db.js
// Connexion à MongoDB Atlas avec gestion d'erreurs et logs

const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "ceg_db",
    });

    logger.info(`✅ MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    logger.error(`❌ Erreur MongoDB : ${error.message}`);
    process.exit(1);
  }
};

// Événements de connexion
mongoose.connection.on("disconnected", () => {
  logger.warn("⚠️  MongoDB déconnecté");
});

mongoose.connection.on("reconnected", () => {
  logger.info("🔄 MongoDB reconnecté");
});

module.exports = connectDB;
