// src/models/Project.js
// Modèle Mongoose pour les projets de l'ONG C.E.G

const mongoose = require("mongoose");
const slugify = require("slugify");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre est requis"],
      trim: true,
      maxlength: [500, "Le titre ne peut pas dépasser 500 caractères"],
    },

    slug: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
      required: [true, "La description est requise"],
      trim: true,
    },

    // Dates du projet (texte libre ex: "Du 15 Juin 2021 au 30 Novembre 2022")
    date: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["ongoing", "completed", "planned"],
      default: "ongoing",
    },

    funder: {
      type: String,
      trim: true,
      default: null,
    },

    budget: {
      type: String,
      trim: true,
      default: "",
    },

    // Image principale — URL Cloudinary
    image: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },

    objectives: {
      type: [String],
      default: [],
    },

    results: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    // Ordre d'affichage
    order: {
      type: Number,
      default: 0,
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
projectSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      locale: "fr",
    });
  }
  next();
});

// Index pour recherche
projectSchema.index({ title: "text", description: "text", tags: "text" });
projectSchema.index({ status: 1, order: 1 });

module.exports = mongoose.model("Project", projectSchema);
