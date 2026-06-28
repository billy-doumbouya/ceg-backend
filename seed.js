// seed.js — À placer à la racine de ton backend
// Usage : node seed.js
// ⚠️  Lance ce script UNE SEULE FOIS — il vide les collections avant d'insérer

require("dotenv").config();
const mongoose = require("mongoose");

// ─── MODELS ───────────────────────────────────────────────────────────────────
// Adapte les chemins selon ton arborescence backend
const Domain      = require("./src/models/Domain");
const Project     = require("./src/models/Project");
const Partner     = require("./src/models/Partner");
const Testimonial = require("./src/models/Testimonial");
const Statistic   = require("./src/models/Statistic");
const Timeline    = require("./src/models/Timeline");
const News        = require("./src/models/News");

// ─── DATA ─────────────────────────────────────────────────────────────────────

const domains = [
  {
    slug: "environnement-developpement-durable",
    title: "Environnement et Développement Durable",
    shortTitle: "Environnement & Développement Durable",
    icon: "leaf",
    color: "#15803D",
    bgColor: "#F0FDF4",
    description:
      "Promotion de la conservation des écosystèmes, gestion durable des ressources naturelles, lutte contre la déforestation et sensibilisation aux enjeux climatiques en Guinée.",
    activities: [
      "Reboisement et restauration des forêts",
      "Gestion durable des terres agricoles",
      "Protection des zones humides",
      "Sensibilisation aux changements climatiques",
      "Promotion des énergies renouvelables",
    ],
    impact: "Des milliers d'hectares de forêts protégées et restaurées",
    isPublished: true,
  },
  {
    slug: "genre-inclusion-gouvernance",
    title: "Genre, Inclusion et Gouvernance Locale",
    shortTitle: "Genre Inclusion & Gouvernance Locale",
    icon: "users",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    description:
      "Renforcement de la participation des femmes et des jeunes dans les instances décisionnelles locales, promotion de l'équité et de la bonne gouvernance communautaire.",
    activities: [
      "Formation des femmes en leadership",
      "Plaidoyer pour la participation politique",
      "Renforcement des capacités des élus locaux",
      "Promotion des droits des minorités",
      "Dialogue intercommunautaire",
    ],
    impact: "Plus de 500 femmes formées en leadership communautaire",
    isPublished: true,
  },
  {
    slug: "sante-communautaire",
    title: "Santé Communautaire Intégrée",
    shortTitle: "Santé Communautaire Intégrée",
    icon: "heart",
    color: "#DC2626",
    bgColor: "#FEF2F2",
    description:
      "Amélioration de l'accès aux soins de santé de base, promotion de l'hygiène environnementale et lutte contre les maladies liées à la dégradation environnementale.",
    activities: [
      "Campagnes de sensibilisation sanitaire",
      "Promotion de l'hygiène et assainissement",
      "Lutte contre le paludisme",
      "Accès à l'eau potable",
      "Nutrition et sécurité alimentaire",
    ],
    impact: "Plus de 12 000 personnes sensibilisées sur la santé environnementale",
    isPublished: true,
  },
  {
    slug: "recherche-action-formation",
    title: "Recherche, Action et Formation",
    shortTitle: "Recherche Action & Formation",
    icon: "book",
    color: "#F59E0B",
    bgColor: "#FFFBEB",
    description:
      "Développement des capacités locales par la recherche-action participative, la formation technique et le renforcement institutionnel des acteurs communautaires.",
    activities: [
      "Études et diagnostics environnementaux",
      "Formation des acteurs communautaires",
      "Recherche-action participative",
      "Capitalisation des bonnes pratiques",
      "Production de matériels pédagogiques",
    ],
    impact: "Plus de 200 acteurs locaux formés et certifiés",
    isPublished: true,
  },
];

const projects = [
  {
    slug: "activites-generatrices-de-revenus-agr",
    title: "Appui à la gestion des incendies de forêt, vulgarisation des activités génératrices de revenus pour une meilleure conservation de la biodiversité de l'APAC de Tinkisso-Kun commune rurale de Dogomet/ Préfecture de Dabola.",
    date: "Du 15 Juin 2021 au 30 Novembre 2022",
    location: "Préfecture de Dabola, Guinée",
    category: "Environnement",
    status: "completed",
    funder: "SGP/FEM/PNUD-Guinée",
    budget: "30 000 USD",
    description: "Favoriser la resilience des communautes face à l'adaptation aux changements climatiques et la conservation de la biodiversite a travers la promotion des activites generatrices de revenus (AGR) dans les zones protegees de l'APAC de Tinkisso-Kun.",
    objectives: [
      "Reboiser 10 hectares de forêts dégradées",
      "Former 200 pépiniéristes locaux",
      "Créer des comités de gestion forestière",
      "Développer des moyens de subsistance alternatifs",
    ],
    results: [
      "60% des apiculteurs ont été dotés des equipements et formés sur les nouvelles techniques d'apiculture améliorée",
      "80% des groupements feminins ont été dotés d'equipements et connaissent l'importance des techniques culturales maraichères",
      "98% des riverains de l'APAC ont été outillés aux différents techniques de lutte contre les feux tardifs",
      "1 500 ménages bénéficiaires directs",
    ],
    tags: ["Reboisement", "Forêt", "Communauté", "Biodiversité"],
    isPublished: true,
  },
  {
    slug: "promotion-saliculture-solaire-kakossa",
    title: "Promotion de la saliculture solaire auprès de huit (8) groupements féminins de l'ile Kakossa/Préfecture de Forécariah",
    date: "1er Septembre 2019 - 30 Aout 2020",
    location: "Préfectures de Forécariah, Guinée",
    category: "Mangrove & Genre",
    status: "completed",
    funder: "SGP/GEF/PNUD-Guinée",
    budget: "25 000 USD",
    description: "Programme de renforcement des capacités des femmes rurales en leadership environnemental, visant à accroître leur participation dans les instances décisionnelles locales.",
    objectives: [
      "Former 300 femmes leaders en gestion environnementale",
      "Créer huit (8) groupements féminins pour la promotion de la saliculture solaire",
      "Intégrer les femmes dans les comités locaux",
    ],
    results: [
      "324 femmes formées",
      "8 groupements féminins opérationnels",
      "85% des comités locaux incluent désormais des femmes",
      "3 000 personnes sensibilisées sur l'importance du sel solaire",
    ],
    tags: ["Genre", "Leadership", "Femmes", "Gouvernance"],
    isPublished: true,
  },
  {
    slug: "entreprenariat-social-energie-solaire-balato",
    title: "Appui à la promotion de l'entreprenariat social à travers la production locale d'équipements solaires dans la commune rurale de Balato/ Préfecture de Kouroussa.",
    date: "13 Février 2018 - 31 Janvier 2019",
    location: "Préfecture de Kouroussa",
    category: "Énergie Solaire & Entreprenariat",
    status: "completed",
    funder: "SGP/FEM/PNUD-Guinée",
    budget: "23 000 USD",
    description: "Améliorer le niveau de connaissance et de la comprehension sur l'importance de l'energie solaire pour l'environnement et l'économie familiale.",
    objectives: [
      "Améliorer l'accès à l'énergie solaire pour 500 ménages",
      "Construire des infrastructures solaires communautaires",
      "Sensibiliser les communautés locales sur l'importance de l'energie solaire",
      "Réduire l'exode rural en créant des opportunités économiques locales",
    ],
    results: [
      "200 personnes sont sensibilisées, informées et adhèrent à l'idée de l'emploi de l'énergie solaire",
      "40 personnes sont formées à la fabrication des lampadaires et cuisinières solaires",
      "4 groupements d'entrepreneurs reçoivent un appui",
      "75 ménages voient leur situation économique et sociale améliorées",
    ],
    tags: ["Entreprenariat", "Social", "Energie solaire", "Communauté"],
    isPublished: true,
  },
  {
    slug: "conservation-habitats-humides-kakossa",
    title: "Membre du consortium ONG au compte du projet : Appui à la conservation des habitats humides par le développement de la saliculture solaire auprès de groupements féminins de l'île de Kakossa.",
    date: "Du 1 Novembre 2021 au 27 Mars 2024",
    location: "Préfectures de Forécariah et Kindia, Guinée",
    category: "Conservation des Écosystèmes",
    status: "completed",
    funder: null,
    budget: "",
    description: "Amélioration de la production et promouvoir une gestion durable des ressources naturelles à travers la promotion de la saliculture solaire auprès de groupements féminins de l'île de Kakossa.",
    objectives: [
      "Accroissement du revenu des femmes rurales",
      "Liberation du temps de travail en faveur des femmes",
      "Reduction des inégalités entre les sexes",
      "Réduction des émissions de Gaz à effet de serre",
    ],
    results: [
      "300 femmes formées sur les nouvelles techniques d'extraction du sel solaire",
      "Réduction de la pauvrété de 50% parmi les bénéficiaires",
      "Prise de conscience collective des communautés locales par rapport aux rôles écologiques des forêts de mangroves",
    ],
    tags: ["Conservation", "Climat", "Résilience", "Accroissement des revenus"],
    isPublished: true,
  },
  {
    slug: "projet-dakhamui-littoral-kindia",
    title: "Membre du consortium ONG au compte du projet : DAKHAMUI",
    date: "Du 01 Avril 2024 au 31 Mars 2026",
    location: "Préfectures de Forécariah et Kindia, Guinée",
    category: "Autonomisation des femmes",
    status: "completed",
    funder: null,
    budget: "104 660 EUR",
    description: "Accroître la résilience des populations, particulièrement des femmes face aux impacts des changements climatiques sur les ressources naturelles.",
    objectives: [
      "Accroître l'efficacité des AGRs agroécologiques pratiquées par les communautés",
      "Réduction des inégalités entre les sexes",
      "Réduction des émissions de Gaz à effet de serre",
    ],
    results: [
      "Adaptation des AGRs en diminuant leur impact sur l'environnement par le biais de la réduction de la déforestation",
      "Atténuation des changements climatiques à travers le reboisement, la restauration de la mangrove et de mise en défens de territoire.",
    ],
    tags: ["Autonomisation", "Femmes", "Littoral", "Ressources naturelles"],
    isPublished: true,
  },
  {
    slug: "restauration-tetes-de-sources-koba",
    title: "Activités de restauration des têtes de sources des cours d'eaux de Kassane et de la carrière de Magnango dans la commune rurale de Koba",
    date: "Du 12/07/2021 au 30/10/2021",
    location: "Préfectures de Boffa, Boke, Guinée",
    category: "Restauration des écosystèmes",
    status: "completed",
    funder: "ANAFIC",
    budget: "",
    description: "Promouvoir la restauration du couvert végétal des têtes de sources des cours d'eaux des villages de Kassane et Mayango fortement dégradées.",
    objectives: [
      "Réhabiliter les zones fragiles du couvert végétal par le reboisement",
      "Renforcer les capacités managériales et opérationnelles des riverains",
    ],
    results: [
      "10 ha de têtes de sources et d'arrières mangroves ont été reboisés",
      "15.000 plants collectés et mis en place",
    ],
    tags: ["Restauration", "Écosystèmes", "Cours d'eau", "Zones à risque"],
    isPublished: true,
  },
  {
    slug: "sfice-sensibilisation-kouroussa-mandiana",
    title: "Sensibilisation, Formation, Information et Communication Environnementale (SFICE) dans les Communes Rurales de Douako, Banfèlè, Cissela, Sanguiana, Dialakörö et Kantoumanina",
    date: "Du 10/06/2019 au 10/09/2019",
    location: "Préfectures de Kouroussa et Mandiana, Kankan, Guinée",
    category: "Sensibilisation des communautés locales",
    status: "completed",
    funder: "GEF/PNUD-GUINEE AbE",
    budget: "",
    description: "Réduire la vulnérabilité des communautés locales du Haut Bassin du Niger aux risques supplémentaires posés par le changement climatique.",
    objectives: [
      "Former 102 relais communautaires sur les causes du changement climatique et les mesures d'adaptation",
      "Sensibiliser 273 personnes sur les causes du changement climatique",
    ],
    results: [
      "102 relais communautaires ont été formés sur les causes du changement climatique",
      "273 personnes ont été sensibilisées sur les causes du changement climatique",
    ],
    tags: ["Sensibilisation", "Communautés locales", "Écosystèmes", "Adaptation climatique"],
    isPublished: true,
  },
  {
    slug: "protection-berges-mangrove-boke",
    title: "Appui à la protection des berges de la mangrove à travers le reboisement de 30 ha et 10 ha sur terre ferme dans le cadre de l'inter collectivité des CR de Dabiss, Kanfarandé et Sansalé, Préfecture de Boké.",
    date: "Du 26/07/2018 au 10/10/2018",
    location: "Préfectures de Boke, Guinée",
    category: "Protection des berges de la mangrove",
    status: "completed",
    funder: "PACV",
    budget: "",
    description: "Restaurer les sites dégradés sur terre ferme dans le cadre de l'inter collectivité des CR de Dabiss, Kanfaradé et Sansalé préfecture de Boké.",
    objectives: [
      "Renforcer les capacités des bénéficiaires sur les techniques de reboisement",
      "Reboiser les zones fragiles des berges de la mangrove",
    ],
    results: [
      "40 ha des berges de la mangrove ont été reboisés par des essences à croissance rapide",
      "40.000 plants achetés et mis en place",
    ],
    tags: ["Protection", "Berges de la mangrove", "Reboisement", "Résilience climatique"],
    isPublished: true,
  },
];

const partners = [
  {
    slug: "gef",
    name: "GEF",
    fullName: "Fonds pour l'Environnement Mondial",
    logoColor: "#0066CC",
    category: "Financement International",
    description: "Organisation multilatérale de financement environnemental soutenant des projets liés à la biodiversité, aux changements climatiques, aux eaux internationales, à la dégradation des terres et au développement durable.",
    website: "https://www.thegef.org",
    partnership: "Partenaire financier principal",
    domains: ["Biodiversité", "Changements climatiques", "Développement durable"],
    since: "2019",
    isPublished: true,
  },
  {
    slug: "pnud",
    name: "PNUD-GUINEE",
    fullName: "Programme des Nations Unies pour le Développement",
    logoColor: "#009EDB",
    category: "Nations Unies",
    description: "Institution des Nations Unies coordonnant les réponses internationales aux problématiques environnementales, fournissant leadership et accompagnement dans la protection de l'environnement mondial.",
    website: "https://www.unep.org",
    partnership: "Partenaire technique et institutionnel",
    domains: ["Environnement mondial", "Politiques vertes", "Conservation"],
    since: "2020",
    isPublished: true,
  },
  {
    slug: "sgp",
    name: "SGP",
    fullName: "Programme de Microfinancements du FEM",
    logoColor: "#00A86B",
    category: "Microfinancement",
    description: "Initiative mise en œuvre par le PNUD finançant des projets environnementaux communautaires à fort impact local, permettant aux ONG et communautés d'accéder directement aux ressources du FEM.",
    website: "https://www.thegef.org/what-we-do/topics/small-grants-programme",
    partnership: "Partenaire de microfinancement",
    domains: ["Projets communautaires", "Conservation locale", "Renforcement capacités"],
    since: "2018",
    isPublished: true,
  },
];

const testimonials = [
  {
    name: "Bintou Sow",
    role: "Agricultrice, Préfecture de Bankoya/Dabola",
    content: "Grâce à l'ONG C.E.G, nous avons appris à prendre soin de notre forêt et à cultiver de manière durable. Nos rendements ont augmenté et nos enfants ont un avenir meilleur.",
    rating: 5,
    isPublished: true,
  },
  {
    name: "Kemo Keita",
    role: "Agriculteur, Djalibanden/Dabola",
    content: "L'ONG C.E.G a transformé notre communauté. Avant, nous ne savions pas l'importance de protéger notre environnement. Aujourd'hui, tout le village est mobilisé.",
    rating: 5,
    isPublished: true,
  },
  {
    name: "M'mah Bangoura",
    role: "Présidente Groupement Féminin kakossa/Forécariah",
    content: "La formation en leadership que l'ONG C.E.G nous a offerte a changé notre vie. Maintenant nous participons aux décisions de notre communauté et notre voix est entendue.",
    rating: 5,
    isPublished: true,
  },
  {
    name: "Gulbert Millimouno",
    role: "Consultant en apiculture Bankoya/Dabola",
    content: "Diminuer la pression sur les écosystèmes",
    rating: 5,
    isPublished: true,
  },
  {
    name: "Mariame Traore",
    role: "Presidente groupement feminin Bankoya/Dabola",
    content: "L'ONG C.E.G nous a permis de creer une caisse d'epargne locale sur la base de la vente de nos produits potagers. Laquelle nous permet de satisfaire les besoins primaire.",
    rating: 5,
    isPublished: true,
  },
];

const statistics = [
  { value: 10, suffix: "+", label: "Années d'expérience", icon: "calendar", order: 1, isPublished: true },
  { value: 8,  suffix: "+", label: "Projets réalisés",    icon: "folder",   order: 2, isPublished: true },
  { value: 12000, suffix: "+", label: "Bénéficiaires",   icon: "users",    order: 3, isPublished: true },
  { value: 7,  suffix: "",  label: "Préfectures couvertes",      icon: "map",    order: 4, isPublished: true },
  { value: 3,  suffix: "",  label: "Partenaires internationaux", icon: "globe",  order: 5, isPublished: true },
  { value: 50, suffix: "+", label: "Communautés sensibilisées",  icon: "heart",  order: 6, isPublished: true },
];

const timeline = [
  {
    year: "2016",
    title: "Création de l'ONG C.E.G",
    description: "Créée à Conakry le 06 Novembre 2016 en assemblée générale constitutive par des jeunes guinéens ayant été bénévoles, volontaires pendant plusieurs années au sein des différentes ONG et associations de la place.",
    icon: "flag",
    color: "#15803D",
    order: 1,
    isPublished: true,
  },
  {
    year: "2018",
    title: "Obtention de l'Agrément National",
    description: "L'ONG obtient son agrément officiel A/N°7838/MATD/CAB/SERPROMA/2018 du Ministère de l'Administration du Territoire et de la Décentralisation (MATD).",
    icon: "check",
    color: "#2563EB",
    order: 2,
    isPublished: true,
  },
  {
    year: "2018",
    title: "Première signature de mémorandum International",
    description: "Signature du premier accord de project avec le SGP/GEF/PNUD-GUINEE",
    icon: "handshake",
    color: "#F59E0B",
    order: 3,
    isPublished: true,
  },
  {
    year: "2020",
    title: "Expansion des Activités",
    description: "Renforcement des interventions à haut impact pour réduire la transmission, la morbidité et la mortalité liées au VIH/SIDA et élimination de la transmission mère-enfant du VIH/SIDA en Guinée/Unicef",
    icon: "expand",
    color: "#DC2626",
    order: 4,
    isPublished: true,
  },
  {
    year: "2021",
    title: "Lancement du projet APAC Tinkisso-Kun",
    description: "Appui à la gestion des incendies de forêt, vulgarisation des activités génératrices de revenus pour une meilleure conservation de la biodiversité de l'APAC de Tinkisso-Kun Commune rurale de Dogomet/ Préfecture de Dabola.",
    icon: "rocket",
    color: "#15803D",
    order: 5,
    isPublished: true,
  },
  {
    year: "2022",
    title: "Attestation de bonne fin de travaux",
    description: "Reconnaissance de l'impact de ONG C.E.G par M. le Coordinateur National du SGP/GEF/PNUD-GUINEE pour ses contributions exceptionnelles à la conservation des écosystèmes.",
    icon: "award",
    color: "#7C3AED",
    order: 6,
    isPublished: true,
  },
];

const news = [
  {
    slug: "journee-mondiale-environnement-2023",
    title: "C.E.G célèbre la Journée d'Arbres Kakossa 2023",
    excerpt: "L'ONG Club Environnemental de Guinée a organisé une grande journée de sensibilisation et de reboisement à l'occasion de la Journée Mondiale de l'Environnement.",
    content: "Le 5 juin 2023, l'ONG C.E.G a mobilisé plus de 500 participants pour une journée de reboisement et de sensibilisation environnementale dans la préfecture de Forécariah...",
    date: "20 Juillet 2023",
    category: "Événement",
    author: "Équipe Technique ONG C.E.G",
    tags: ["Environnement", "Reboisement", "Sensibilisation"],
    featured: true,
    isPublished: true,
  },
  {
    slug: "formation-paysans-agroecologie",
    title: "Formation de 50 paysans aux techniques agroécologiques",
    excerpt: "Dans le cadre du projet d'Agriculture Résiliente, ONG C.E.G a organisé une formation intensive de cinq jours destinée aux agriculteurs des deux préfectures ciblées.",
    content: "Du 12 au 16 mars 2024, l'équipe technique de ONG C.E.G a conduit une formation approfondie sur les techniques agroécologiques...",
    date: "18 Mars 2024",
    category: "Formation",
    author: "Équipe Technique ONG C.E.G",
    tags: ["Agriculture", "Formation", "Agroécologie"],
    featured: false,
    isPublished: true,
  },
  {
    slug: "partenariat-sgp-renouvele",
    title: "Renouvellement du partenariat avec le SGP/FEM/PNUD-GUINEE",
    excerpt: "L'ONG C.E.G et le Programme de Microfinancements du FEM ont officiellement renouvelé leur accord de partenariat pour la période 2024-2026.",
    content: "Une cérémonie officielle de signature a eu lieu à Conakry en présence des représentants du SGP/FEM et de l'équipe dirigeante de C.E.G...",
    date: "",
    category: "Partenariat",
    author: "Équipe Technique ONG C.E.G",
    tags: ["Partenariat", "SGP", "FEM", "PNUD-GUINEE", "Financement"],
    featured: true,
    isPublished: true,
  },
  {
    slug: "rapport-annuel-2023",
    title: "Publication du Rapport Annuel 2023 de C.E.G",
    excerpt: "Le rapport annuel 2023 de l'ONG C.E.G est désormais disponible, illustrant les réalisations et l'impact de l'organisation sur l'année écoulée.",
    content: "L'ONG C.E.G publie son rapport annuel 2023 qui retrace les activités, les résultats et l'impact de ses interventions...",
    date: "15 Janvier 2024",
    category: "Publication",
    author: "Équipe Technique ONG C.E.G",
    tags: ["Rapport", "Impact", "Bilan"],
    featured: false,
    isPublished: true,
  },
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────
// ─── SEED FUNCTION ────────────────────────────────────────────────────────────
async function seedOne(label, model, data) {
  try {
    await model.deleteMany({});
    const res = await model.insertMany(data);
    console.log(`✅ ${label.padEnd(12)} : ${res.length} insérés`);
    return res;
  } catch (err) {
    console.error(`❌ ${label.padEnd(12)} : ÉCHEC →`, err.message);
    return [];
  }
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connecté à MongoDB\n");

    await seedOne("Domains", Domain, domains);
    await seedOne("Projects", Project, projects);
    await seedOne("Partners", Partner, partners);
    await seedOne("Testimonials", Testimonial, testimonials);
    await seedOne("Statistics", Statistic, statistics);
    await seedOne("Timeline", Timeline, timeline);
    await seedOne("News", News, news);

    console.log("\n🎉 Seed terminé");
    console.log("⚠️  Les images (logos partenaires, images projets/news) doivent être uploadées manuellement depuis le dashboard admin.");
  } catch (err) {
    console.error("❌ Erreur seed :", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Déconnecté de MongoDB");
  }
}

seed();

