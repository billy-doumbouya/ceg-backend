// src/config/db.js
// Connexion à MongoDB Atlas avec gestion d'erreurs et logs
const dns = require("dns");
const mongoose = require("mongoose");
const logger = require("../utils/logger");

dns.setDefaultResultOrder("ipv4first"); // Prioriser IPv4 pour éviter certains problèmes de connexion

// Fix Windows : le résolveur DNS par défaut de Node refuse parfois les
// requêtes SRV (utilisées par mongodb+srv://) même quand nslookup système
// fonctionne. On force un DNS public fiable pour la résolution SRV.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

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