// src/seed/seed.js
// Lancer avec : node src/seed/seed.js
// Ajoute --reset pour vider les collections avant insertion : node src/seed/seed.js --reset

require("dotenv").config();
const mongoose = require("mongoose");

const Timeline = require("../models/Timeline");
const Testimonial = require("../models/Testimonial");
const Statistic = require("../models/Statistic");
const Partner = require("../models/Partner");
const News = require("../models/News");
const Domain = require("../models/Domain");

const { timeline, testimonials, statistics, partners, news, domains } = require("./seedData");

const RESET = process.argv.includes("--reset");

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI introuvable dans .env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("✅ Connecté à MongoDB");

  const collections = [
    { name: "Timeline", model: Timeline, data: timeline },
    { name: "Testimonial", model: Testimonial, data: testimonials },
    { name: "Statistic", model: Statistic, data: statistics },
    { name: "Partner", model: Partner, data: partners },
    { name: "News", model: News, data: news },
    { name: "Domain", model: Domain, data: domains },
  ];

  for (const { name, model, data } of collections) {
    if (RESET) {
      await model.deleteMany({});
      console.log(`🗑️  ${name} vidée`);
    }

    // insertMany ne déclenche pas les hooks pre("save"),
    // donc on utilise create() pour que les slugs auto-générés fonctionnent.
    const inserted = await model.create(data);
    console.log(`🌱 ${name} : ${inserted.length} documents insérés`);
  }

  console.log("🎉 Seed terminé avec succès");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erreur durant le seed :", err);
  process.exit(1);
});