// src/models/News.js
// Modèle Mongoose pour les actualités de l'ONG C.E.G

const mongoose = require("mongoose");
const slugify = require("slugify");

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre est requis"],
      trim: true,
      maxlength: [300, "Le titre ne peut pas dépasser 300 caractères"],
    },

    slug: {
      type: String,
      unique: true,
    },

    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, "L'extrait ne peut pas dépasser 500 caractères"],
    },

    content: {
      type: String,
      required: [true, "Le contenu est requis"],
      trim: true,
    },

    // Date manuelle — si vide, on utilise createdAt
    date: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      enum: ["Événement", "Formation", "Partenariat", "Publication", "Autre"],
      default: "Autre",
    },

    // Image principale — URL Cloudinary
    image: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },

    author: {
      type: String,
      trim: true,
      default: "Équipe Technique ONG C.E.G",
    },

    tags: {
      type: [String],
      default: [],
    },

    // Mise en avant sur la page d'accueil
    featured: {
      type: Boolean,
      default: false,
    },

    // Visible sur le site public ?
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Génération automatique du slug avant sauvegarde
newsSchema.pre("save", async function (next) {
  if (this.isModified("title") || !this.slug) {
    let baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
      locale: "fr",
    });

    // Vérifier unicité du slug
    let slug = baseSlug;
    let count = 1;
    while (await mongoose.model("News").findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }
    this.slug = slug;
  }
  next();
});

// Virtual : date d'affichage (date manuelle ou date de création)
newsSchema.virtual("displayDate").get(function () {
  if (this.date && this.date.trim()) return this.date;
  return this.createdAt
    ? new Date(this.createdAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
});

// Index
newsSchema.index({ title: "text", content: "text", tags: "text" });
newsSchema.index({ featured: 1, isPublished: 1, createdAt: -1 });

module.exports = mongoose.model("News", newsSchema);
