// src/controllers/chatbotController.js
const News = require("../models/News");
const Project = require("../models/Project");
const Domain = require("../models/Domain");
const Partner = require("../models/Partner");
const Statistic = require("../models/Statistic");
const Testimony = require("../models/Testimonial"); // Added
const Timeline = require("../models/Timeline"); // Added

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
const CACHE_DURATION = 10 * 60 * 1000;

async function getCachedSystemPrompt() {
  const now = Date.now();
  if (!cachedPrompt || now - lastCacheTime > CACHE_DURATION) {
    cachedPrompt = await buildDynamicSystemPrompt();
    lastCacheTime = now;
  }
  return cachedPrompt;
}

async function buildDynamicSystemPrompt() {
  try {
    const [
      projects,
      news,
      domains,
      partners,
      statistics,
      testimonies,
      timelines,
    ] = await Promise.all([
      // CORRECTION 1: On retire { status: "active" } et on filtre sur isPublished: true
      Project.find({ isPublished: true })
        .select(
          "title description category location budget status date objectives results funder",
        )
        .sort({ order: 1, createdAt: -1 })
        .lean(),
      News.find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title excerpt content createdAt")
        .lean(),
      Domain.find({}).select("title description").lean(),
      Partner.find({}).select("name type").lean(),
      Statistic.find({}).select("label value").lean(),
      // CORRECTION 2: Ajout des Témoignages et de la Frise Chronologique
      Testimony.find({ isPublished: true }).select("name role content").lean(),
      Timeline.find({})
        .sort({ order: 1 })
        .select("year title description")
        .lean(),
    ]);

    // Formatage des statuts pour le prompt
    const statusMap = {
      ongoing: "En cours",
      completed: "Réalisé / Terminé",
      planned: "Planifié / En préparation",
    };

    const projectsContext =
      projects.length > 0
        ? projects
            .map((p) => {
              const statusLabel = statusMap[p.status] || p.status || "N/A";
              const funderStr = p.funder ? ` | Bailleurs: ${p.funder}` : "";
              const objStr = p.objectives?.length
                ? ` | Objectifs: ${p.objectives.join(", ")}`
                : "";
              const resStr = p.results?.length
                ? ` | Résultats: ${p.results.join(", ")}`
                : "";

              return `- **${p.title}** [Statut: ${statusLabel}] (${p.category || "Général"}) : ${p.description}. Lieu: ${p.location || "N/A"}${funderStr}${objStr}${resStr}`;
            })
            .join("\n")
        : "Aucun projet spécifique répertorié pour le moment.";

    const newsContext =
      news.length > 0
        ? news
            .map(
              (n) =>
                `- **${n.title}** (${new Date(n.createdAt).toLocaleDateString("fr-FR")}) : ${n.summary || n.content.substring(0, 150)}...`,
            )
            .join("\n")
        : "Aucune actualité récente.";

    const domainsContext =
      domains.length > 0
        ? domains.map((d) => `- **${d.title}** : ${d.description}`).join("\n")
        : "1. Environnement & Développement Durable\n2. Genre & Autonomisation\n3. Santé Communautaire\n4. Formation & Action";

    const partnersContext =
      partners.length > 0
        ? partners
            .map((p) => `- ${p.name} (${p.type || "Partenaire"})`)
            .join("\n")
        : "- GEF (Fonds pour l'Environnement Mondial)\n- PNUD-GUINEE\n- SGP/FEM";

    const statsContext =
      statistics.length > 0
        ? statistics.map((s) => `- **${s.label}** : ${s.value}`).join("\n")
        : "- 8+ ans d'expérience\n- 15+ projets réalisés\n- 12 000+ bénéficiaires";

    const testimoniesContext =
      testimonies.length > 0
        ? testimonies
            .map(
              (t) =>
                `- **${t.name}** (${t.role || "Bénéficiaire"}) : "${t.content}"`,
            )
            .join("\n")
        : "Aucun témoignage enregistré.";

    const timelineContext =
      timelines.length > 0
        ? timelines
            .map((tl) => `- **${tl.year}** - ${tl.title} : ${tl.description}`)
            .join("\n")
        : "Historique en cours de mise à jour.";

    return `
Tu es Doré, l'assistant virtuel officiel de l'ONG Club Environnemental de Guinée (C.E.G).
Tu n'es pas présenté comme une IA — tu es Doré.

════════════════════════════════════════
RÈGLE ABSOLUE — COMPORTEMENT GÉNÉRAL
════════════════════════════════════════
1. Tu réponds TOUJOURS directement à la question posée.
2. Ta réponse est la priorité. La présentation est secondaire.
3. Tu ne fais JAMAIS une présentation sans répondre à la question.
4. Tu ne demandes JAMAIS "comment puis-je vous aider ?" si une question est déjà posée.
5. Tu ne répètes JAMAIS ta présentation après le premier message.
6. Tu n'inventes JAMAIS une information. Si une info n'est pas dans le contexte ci-dessous, tu renvoies vers les canaux officials.

════════════════════════════════════════
INFORMATIONS INSTITUTIONNELLES
════════════════════════════════════════
Nom complet : ONG Club Environnemental de Guinée (C.E.G)
Date création : 06 Novembre 2016
Agrément : A/N°7838/MATD/CAB/SERPROMA/2018
Siège social : Km 66 / Maléah Centre I, Préfecture de Forécariah, Guinée
Contacts : (+224) 612 41 34 24 / (+224) 660 70 60 70
Email : contact@clubenvironnementaldeguinee.org
Directeur exécutif : M. Koly Doré



════════════════════════════════════════
📌 FAIRE UN DON / SOUTENIR L'ONG :
════════════════════════════════════════
Si un utilisateur demande comment faire un don ou soutenir financièrement l'ONG :
- Indique qu'il peut faire un don directement en ligne de manière sécurisée via le bouton "Faire un don" sur le site.
- Précise que les dons servent à financer nos projets d'environnement, de reboisement et d'autonomisation des communautés.
- Ne donne JAMAIS de détails ou de noms sur les donateurs existants pour des raisons de confidentialité.
════════════════════════════════════════
📌 GALERIE & PHOTOS :
════════════════════════════════════════

L'ONG dispose d'une galerie de photos montrant ses actions sur le terrain (sensibilisation, reboisement, événements).
Si l'utilisateur demande à voir des photos, des images ou des preuves visuelles de nos projets, invite-le chaleureusement à consulter la rubrique "Galerie" du site web officiel.
════════════════════════════════════════
DONNÉES EN TEMPS RÉEL (BASE DE DONNÉES MONGODB)
════════════════════════════════════════

📌 DOMAINES D'INTERVENTION :
${domainsContext}

📌 PROJETS (ACTUELS, RÉALISÉS ET PLANIFIÉS) :
${projectsContext}

📌 HISTORIQUE & TIMELINE DE L'ONG :
${timelineContext}

📌 TEMOIGNAGES & AVIS :
${testimoniesContext}

📌 ACTUALITÉS RÉCENTES :
${newsContext}

📌 CHIFFRES CLÉS :
${statsContext}

📌 PARTENAIRES OFFICIELS :
${partnersContext}

════════════════════════════════════════
SI TU NE SAIS PAS
════════════════════════════════════════
Si une donnée n'est ni dans le texte ci-dessus ni dans tes connaissances institutionnelles, réponds :
"Je n'ai pas cette information pour le moment. Pour une réponse officielle, contactez l'ONG directement :
📧 contact@clubenvironnementaldeguinee.org
📞 (+224) 612 41 34 24"
`.trim();
  } catch (error) {
    console.error("Erreur récupération MongoDB Chatbot:", error);
    throw error;
  }
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
