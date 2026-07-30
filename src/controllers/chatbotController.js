// src/controllers/chatbotController.js
const News = require("../models/News");
const Project = require("../models/Project");
const Domain = require("../models/Domain");
const Partner = require("../models/Partner");
const Statistic = require("../models/Statistic");
const Testimony = require("../models/Testimonial");
const Timeline = require("../models/Timeline");

const { buildSystemPrompt } = require("../config/systemPrompt");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const FREE_MODELS_POOL = [
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
];

const getApiUrl = (modelName) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

let cachedPrompt = null;
let lastCacheTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // Cache de 10 minutes

async function getCachedSystemPrompt() {
  const now = Date.now();
  if (!cachedPrompt || now - lastCacheTime > CACHE_DURATION) {
    // Récupération parallèle des données Mongoose
    const [
      projects,
      news,
      domains,
      partners,
      statistics,
      testimonies,
      timelines,
    ] = await Promise.all([
      Project.find({ isPublished: true })
        .select(
          "title description category location budget status date objectives results funder",
        )
        .sort({ order: 1, createdAt: -1 })
        .lean(),
      News.find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title excerpt content createdAt") // Utilisation de excerpt corrigée
        .lean(),
      Domain.find({}).select("title description").lean(),
      Partner.find({}).select("name type").lean(),
      Statistic.find({}).select("label value").lean(),
      Testimony.find({ isPublished: true }).select("name role content").lean(),
      Timeline.find({})
        .sort({ order: 1 })
        .select("year title description")
        .lean(),
    ]);

    cachedPrompt = await buildSystemPrompt({
      projects,
      news,
      domains,
      partners,
      statistics,
      testimonies,
      timelines,
    });
    lastCacheTime = now;
  }
  return cachedPrompt;
}

const handleChatbotMessage = async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res
        .status(500)
        .json({ error: "Clé d'API Gemini manquante côté serveur." });
    }

    const { history } = req.body;
    const systemPrompt = await getCachedSystemPrompt();

    const contents = history
      .filter((msg) => msg?.role && (msg?.content || msg?.text))
      .map((msg) => ({
        role:
          msg.role === "assistant" || msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.content || msg.text }],
      }));

    const payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    };

    let responseText = null;
    let lastError = null;

    for (const modelName of FREE_MODELS_POOL) {
      try {
        const response = await fetch(getApiUrl(modelName), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMsg = data?.error?.message || "Erreur API Gemini";
          console.warn(
            `[Chatbot Backend] ${modelName} a échoué (${response.status}) : ${errorMsg}`,
          );
          lastError = new Error(errorMsg);
          continue;
        }

        responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) break;
      } catch (err) {
        console.warn(
          `[Chatbot Backend] Erreur réseau sur ${modelName}:`,
          err.message,
        );
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error("Tous les modèles d'IA sont indisponibles.");
    }

    return res.status(200).json({ reply: responseText });
  } catch (error) {
    console.error("Erreur contrôleur chatbot :", error);
    return res.status(500).json({
      error: "Une erreur interne est survenue lors du traitement du message.",
      details: error.message,
    });
  }
};

module.exports = {
  handleChatbotMessage,
};
