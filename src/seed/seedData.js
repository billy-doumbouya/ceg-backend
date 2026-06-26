// src/seed/seedData.js
// Données à insérer dans la base — mappées sur les schemas Mongoose existants

const timeline = [
  {
    year: "2016",
    title: "Création de l'ONG C.E.G",
    description:
      "Créée à Conakry le 06 Novembre 2016 en assemblée générale constitutive par des jeunes guinéens ayant été bénévoles, volontaires pendant plusieurs années au sein des différentes ONG et associations de la place.",
    icon: "flag",
    color: "#15803D",
    order: 1,
  },
  {
    year: "2018",
    title: "Obtention de l'Agrément National",
    description:
      "L'ONG obtient son agrément officiel A/N°7838/MATD/CAB/SERPROMA/2018 du Ministère de l'Administration du Territoire et de la Décentralisation (MATD).",
    icon: "check",
    color: "#2563EB",
    order: 2,
  },
  {
    year: "2018",
    title: "Premiere signature de mémorandum  International",
    description:
      "Signature du premier accord de project avec le SGP/GEF/PNUD-GUINEE",
    icon: "handshake",
    color: "#F59E0B",
    order: 3,
  },
  {
    year: "2020",
    title: "Expansion des Activités",
    description:
      "Renforcement des interventions à haut impact pour réduire la transmission, la morbidité et la mortalité liées au VIH/SIDA et élimination de la transmission mère-enfant du VIH/SIDA en Guinée/Unicef",
    icon: "expand",
    color: "#DC2626",
    order: 4,
  },
  {
    year: "2021",
    title: "Lancement du projet",
    description:
      "Appui à la gestion des incendies de forêt, vulgarisation des activités génératrices de revenus pour une meilleure conservation de la biodiversité de l'APAC de Tinkisso-Kun Commune rurale de Dogomet/ Préfecture de Dabola. ",
    icon: "rocket",
    color: "#15803D",
    order: 5,
  },
  {
    year: "2022",
    title: "Attestation de bonne fin de traveaux",
    description:
      "Reconnaissance de l'impact de ONG C.E.G par M. le Coordinateur National du SGP/GEF/PNUD-GUINEE pour ses contributions exceptionnelles à la conservation des écosystèmes.",
    icon: "award",
    color: "#7C3AED",
    order: 6,
  },
];

const testimonials = [
  {
    name: "Bintou Sow",
    role: "Agricultrice, Préfecture de Bankoya/Dabola",
    content:
      "Grâce à l'ONG C.E.G, nous avons appris à prendre soin de notre forêt et à cultiver de manière durable. Nos rendements ont augmenté et nos enfants ont un avenir meilleur.",
    rating: 5,
    order: 1,
  },
  {
    name: "Kemo Keita",
    role: "Agriculteur, Djalibanden/Dabola",
    content:
      "L'ONG C.E.G a transformé notre communauté. Avant, nous ne savions pas l'importance de protéger notre environnement. Aujourd'hui, tout le village est mobilisé.",
    rating: 5,
    order: 2,
  },
  {
    name: "M'mah Bangoura",
    role: "Présidente Groupement Féminin kakossa/fodecariah",
    content:
      "La formation en leadership que l'ONG C.E.G nous a offerte a changé notre vie. Maintenant nous participons aux décisions de notre communauté et notre voix est entendue.",
    rating: 5,
    order: 3,
  },
  {
    name: "Gulbert Millimouno",
    role: "Consultant en apiculture Bankoya/Dabola",
    content: "Diminuer la pression sur les écosystèmes",
    rating: 5,
    order: 4,
  },
  {
    name: "Mariame Traore",
    role: "Presidente groupement feminin Bankoya/Dabola",
    content:
      "L'ONG C.E.G nous a permis de creer une caisse d'epargne locale sur la base de la vente de nos produits potagers. Laquelle nous permet de satisfaire les besoins primaire. ",
    rating: 5,
    order: 5,
  },
];

const statistics = [
  { value: 10, suffix: "+", label: "Années d'expérience", icon: "calendar", order: 1 },
  { value: 8, suffix: "+", label: "Projets réalisés", icon: "folder", order: 2 },
  { value: 12000, suffix: "+", label: "Bénéficiaires", icon: "users", order: 3 },
  { value: 7, suffix: "", label: "Préfectures couvertes", icon: "map", order: 4 },
  { value: 3, suffix: "", label: "Partenaires internationaux", icon: "globe", order: 5 },
  { value: 50, suffix: "+", label: "Communautés sensibilisées", icon: "heart", order: 6 },
];

const partners = [
  {
    name: "GEF",
    fullName: "Fonds pour l'Environnement Mondial",
    logo: { url: "/assets/images/partner-logo/gef.png", publicId: null },
    logoText: "GEF",
    logoColor: "#0066CC",
    category: "Financement International",
    description:
      "Organisation multilatérale de financement environnemental soutenant des projets liés à la biodiversité, aux changements climatiques, aux eaux internationales, à la dégradation des terres et au développement durable.",
    website: "https://www.thegef.org",
    partnership: "Partenaire financier principal",
    domains: ["Biodiversité", "Changements climatiques", "Développement durable"],
    since: "2019",
    order: 1,
  },
  {
    name: "PNUD-GUINEE",
    fullName: "Programme des Nations Unies pour le Développement",
    logo: { url: "/assets/images/partner-logo/penue.jpg", publicId: null },
    logoText: "PNUD-GUINEE",
    logoColor: "#009EDB",
    category: "Nations Unies",
    description:
      "Institution des Nations Unies coordonnant les réponses internationales aux problématiques environnementales, fournissant leadership et accompagnement dans la protection de l'environnement mondial.",
    website: "https://www.unep.org",
    partnership: "Partenaire technique et institutionnel",
    domains: ["Environnement mondial", "Politiques vertes", "Conservation"],
    since: "2020",
    order: 2,
  },
  {
    name: "SGP",
    fullName: "Programme de Microfinancements du FEM",
    logo: { url: "/assets/images/partner-logo/sgp.jpg", publicId: null },
    logoText: "SGP",
    logoColor: "#00A86B",
    category: "Microfinancement",
    description:
      "Initiative mise en œuvre par le PNUD finançant des projets environnementaux communautaires à fort impact local, permettant aux ONG et communautés d'accéder directement aux ressources du FEM.",
    website: "https://www.thegef.org/what-we-do/topics/small-grants-programme",
    partnership: "Partenaire de microfinancement",
    domains: ["Projets communautaires", "Conservation locale", "Renforcement capacités"],
    since: "2018",
    order: 3,
  },
];

const news = [
  {
    title: "C.E.G célèbre la Journée  d'Arbres Kakossa 2023",
    excerpt:
      "L'ONG Club Environnemental de Guinée a organisé une grande journée de sensibilisation et de reboisement à l'occasion de la Journée Mondiale de l'Environnement.",
    content:
      "Le 5 juin 2023, l'ONG C.E.G a mobilisé plus de 500 participants pour une journée de reboisement et de sensibilisation environnementale dans la préfecture de Forécariah...",
    date: "20 Juillet 2023 ",
    category: "Événement",
    image: { url: "/assets/images/newsImages/kakossa1.jpg", publicId: null },
    author: "Équipe Technique ONG C.E.G",
    tags: ["Environnement", "Reboisement", "Sensibilisation"],
    featured: true,
  },
  {
    title: "Formation de 50 paysans aux techniques agroécologiques",
    excerpt:
      "Dans le cadre du projet d'Agriculture Résiliente,ONG C.E.G a organisé une formation intensive de cinq jours destinée aux agriculteurs des deux préfectures ciblées.",
    content:
      "Du 12 au 16 mars 2024, l'équipe technique de ONG C.E.G a conduit une formation approfondie sur les techniques agroécologiques...",
    date: "18 Mars 2024",
    category: "Formation",
    image: { url: "/assets/images/newsImages/kakossa2.jpg", publicId: null },
    author: "Équipe Technique ONG C.E.G",
    tags: ["Agriculture", "Formation", "Agroécologie"],
    featured: false,
  },
  {
    title: "Renouvellement du partenariat avec le SGP/FEM/PNUD-GUINEE",
    excerpt:
      "L'ONG C.E.G et le Programme de Microfinancements du FEM ont officiellement renouvelé leur accord de partenariat pour la période 2024-2026.",
    content:
      "Une cérémonie officielle de signature a eu lieu à Conakry en présence des représentants du SGP/FEM et de l'équipe dirigeante de C.E.G...",
    date: "",
    category: "Partenariat",
    image: { url: "/assets/images/newsImages/kaback.jpg", publicId: null },
    author: "Équipe Technique ONG C.E.G",
    tags: ["Partenariat", "SGP", "FEM", "PNUD-GUINEE", "Financement"],
    featured: true,
  },
  {
    title: "Publication du Rapport Annuel 2023 de C.E.G",
    excerpt:
      "Le rapport annuel 2023 de l'ONG C.E.G est désormais disponible, illustrant les réalisations et l'impact de l'organisation sur l'année écoulée.",
    content:
      "L'ONG C.E.G publie son rapport annuel 2023 qui retrace les activités, les résultats et l'impact de ses interventions...",
    date: "15 Janvier 2024",
    category: "Publication",
    image: { url: "/assets/images/newsImages/repport.jpg", publicId: null },
    author: "Équipe Technique ONG C.E.G",
    tags: ["Rapport", "Impact", "Bilan"],
    featured: false,
  },
];

const domains = [
  {
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
    order: 1,
  },
  {
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
    order: 2,
  },
  {
    title: "Santé Communautaire Intégrée",
    shortTitle: "Santé Communautaire Integréé",
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
    order: 3,
  },
  {
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
    order: 4,
  },
];

module.exports = { timeline, testimonials, statistics, partners, news, domains };