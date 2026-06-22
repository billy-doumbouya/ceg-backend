// src/utils/logger.js
// Logger centralisé avec Winston — logs console + fichiers

const winston = require("winston");
const path = require("path");

const { combine, timestamp, colorize, printf, json } = winston.format;

// Format personnalisé pour la console
const consoleFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "warn" : "debug",
  transports: [
    // Console — développement
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "HH:mm:ss" }),
        consoleFormat
      ),
    }),
    // Fichier erreurs
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/error.log"),
      level: "error",
      format: combine(timestamp(), json()),
    }),
    // Fichier combiné
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/combined.log"),
      format: combine(timestamp(), json()),
    }),
  ],
});

module.exports = logger;
