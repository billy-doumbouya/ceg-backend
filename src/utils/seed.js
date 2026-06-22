// src/utils/seed.js
// Usage : node src/utils/seed.js

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const Admin          = require("../models/Admin");
const Statistic      = require("../models/Statistic");
const Domain         = require("../models/Domain");
const Timeline       = require("../models/Timeline");
const { GalleryCategory } = require("../models/Gallery");

// ─── UTILITAIRE SLUG ────────────────────────────────────────────────────────
const slugify = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // retire les accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// ─── DONNÉES ─────────────────────────────────────────────────────────────────

const STATISTICS = [
  { label: "Années d'expérience",        value: 10,    suffix: "+", icon: "calendar", order: 1 },
  { label: "Projets réalisés",           value: 8,     suffix: "+", icon: "folder",   order: 2 },
  { label: "Bénéficiaires",              value: 12000, suffix: "+", icon: "users",    order: 3 },
  { label: "Préfectures couvertes",      value: 7,     suffix: "",  icon: "map",      order: 4 },
  { label: "Partenaires internationaux", value: 3,     suffix: "",  icon: "globe",    order: 5 },
  { label: "Communautés sensibilisées",  value: 50,    suffix: "+", icon: "heart",    order: 6 },
];

const GALLERY_CATEGORIES = [
  { name: "Projet-Kakossa",          description: "Photos du projet Kakossa",             order: 1 },
  { name: "Projet-Dogomet",          description: "Photos du projet Dogomet",             order: 2 },
  { name: "Projet-Balato",           description: "Photos du projet Balato",              order: 3 },
  { name: "Projet-Boké",             description: "Photos du projet Boké",               order: 4 },
  { name: "Projet-Koba",             description: "Photos du projet Koba",               order: 5 },
  { name: "Projet-Conservation H.H", description: "Photos conservation habitats humides", order: 6 },
  { name: "Projet-Dakhamui",         description: "Photos du projet Dakhamui",           order: 7 },
].map((c) => ({ ...c, slug: slugify(c.name) })); // slug généré ici, pas dans le hook

const TIMELINE = [
  {
    year: "2016", order: 1, icon: "flag", color: "#15803D",
    title: "Création de l'ONG C.E.G",
    description: "Créée à Conakry le 06 Novembre 2016 en assemblée générale constitutive.",
  },
  {
    year: "2018", order: 2, icon: "check", color: "#2563EB",
    title: "Obtention de l'Agrément National",
    description: "Agrément officiel A/N°7838/MATD/CAB/SERPROMA/2018.",
  },
  {
    year: "2018", order: 3, icon: "handshake", color: "#F59E0B",
    title: "Première signature de mémorandum International",
    description: "Signature du premier accord de projet avec le SGP/GEF/PNUD-GUINEE.",
  },
  {
    year: "2020", order: 4, icon: "expand", color: "#DC2626",
    title: "Expansion des Activités",
    description: "Renforcement des interventions à haut impact.",
  },
  {
    year: "2021", order: 5, icon: "rocket", color: "#15803D",
    title: "Lancement du projet APAC Tinkisso-Kun",
    description: "Appui à la gestion des incendies de forêt à Dabola.",
  },
  {
    year: "2022", order: 6, icon: "award", color: "#7C3AED",
    title: "Attestation de bonne fin de travaux",
    description: "Reconnaissance par le Coordinateur National du SGP/GEF/PNUD-GUINEE.",
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const seed = async (label, Model, data) => {
  const count = await Model.countDocuments();
  if (count > 0) {
    console.log(`⚠️  ${label} — déjà présent (${count} docs), ignoré`);
    return;
  }
  await Model.insertMany(data);
  console.log(`✅ ${label} créé (${data.length} docs)`);
};

// ─── MAIN ────────────────────────────────────────────────────────────────────

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: "ceg_db" });
  console.log("✅ MongoDB connecté\n");

  // Admin — logique séparée car bcrypt async
  const existingAdmin = await Admin.findOne({ identifier: "ceg_admin" });
  if (existingAdmin) {
    console.log("⚠️  Admin — déjà existant, ignoré");
  } else {
    const hashed = await Promise.all([
      bcrypt.hash(process.env.ADMIN_PASSWORD_1, 12),
      bcrypt.hash(process.env.ADMIN_PASSWORD_2, 12),
      bcrypt.hash(process.env.ADMIN_PASSWORD_3, 12),
    ]);
    await Admin.create({ identifier: "ceg_admin", passwords: hashed });
    console.log("✅ Admin créé avec 3 mots de passe");
  }

  // Collections
  await seed("Statistiques",        Statistic,       STATISTICS);
  await seed("Catégories galerie",  GalleryCategory, GALLERY_CATEGORIES);
  await seed("Timeline",            Timeline,        TIMELINE);

  console.log("\n🎉 Seed terminé !");
  process.exit(0);
};

run().catch((err) => {
  console.error("\n❌ Erreur seed:", err.message);
  process.exit(1);
});