// src/app.js
// Point d'entrée principal du serveur Express ONG C.E.G
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");
const logger = require("./utils/logger");
const routes = require("./routes/index");
const { errorHandler, notFound } = require("./middleware/errorHandler");

// Créer le dossier logs si absent
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const app = express();

// ─── Connexion base de données ────────────────────────────────────────────────
connectDB();

// ─── Middlewares globaux ──────────────────────────────────────────────────────
// CORS — autoriser le frontend et le dashboard
// ─── CORS origins ─────────────────────────────────────────────────────────────
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((u) => u.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origin (Postman, mobile, SSR)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS bloqué : origin non autorisée → ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Après app.use(express.urlencoded...)
app.use((req, res, next) => {
  res.setTimeout(120000); // 2 minutes
  next();
});

// Logger HTTP
app.use(
  morgan("dev", {
    stream: { write: (msg) => logger.http(msg.trim()) },
  }),
);

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: "ong-ceg",
      collectionName: "sessions",
      ttl: Number(process.env.SESSION_MAX_AGE) / 1000, // en secondes
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS en prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: Number(process.env.SESSION_MAX_AGE), // 24h
    },
  }),
);

// ─── Routes API ───────────────────────────────────────────────────────────────
app.use("/api", routes);

// Route santé serveur
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// ─── Gestion des erreurs ──────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Démarrage serveur ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(
    `🚀 Serveur ONG C.E.G démarré sur le port ${PORT} [${process.env.NODE_ENV}]`,
  );
});

module.exports = app;
