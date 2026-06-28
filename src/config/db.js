// src/config/db.js
const dns = require("dns");
const mongoose = require("mongoose");
const logger = require("../utils/logger");

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(
      `✅ MongoDB connecté : ${conn.connection.host} (base: ${conn.connection.name})`,
    );
  } catch (error) {
    logger.error(`❌ Erreur MongoDB : ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  logger.warn("⚠️  MongoDB déconnecté");
});
mongoose.connection.on("reconnected", () => {
  logger.info("🔄 MongoDB reconnecté");
});

module.exports = connectDB;
