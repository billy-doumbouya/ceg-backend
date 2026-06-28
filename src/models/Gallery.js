// src/models/Gallery.js
// Modèles pour la galerie photo — catégories et images

const mongoose = require("mongoose");
const slugify = require("slugify");

// ─── Catégorie de galerie ───────────────────────────────────────────────────
const galleryCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom de la catégorie est requis"],
      trim: true,
      unique: true,
      maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"],
    },

    slug: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    // Image de couverture de la catégorie
    cover: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },

    // Nombre d'images (mis à jour dynamiquement)
    imageCount: {
      type: Number,
      default: 0,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

galleryCategorySchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true, locale: "fr" });
  }
  next();
});

// ─── Image de galerie ───────────────────────────────────────────────────────
const galleryImageSchema = new mongoose.Schema(
  {
    // Référence à la catégorie
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GalleryCategory",
      required: [true, "La catégorie est requise"],
    },

    // Image — URL Cloudinary
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      // Dimensions pour le lazy loading
      width: { type: Number, default: null },
      height: { type: Number, default: null },
    },

    caption: {
      type: String,
      trim: true,
      default: "",
    },

    // Date de la photo (ex: lors d'un événement)
    takenAt: {
      type: String,
      trim: true,
      default: "",
    },

    order: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Mise à jour du compteur de la catégorie après ajout/suppression
galleryImageSchema.post("save", async function () {
  const count = await mongoose
    .model("GalleryImage")
    .countDocuments({ category: this.category });
  await mongoose
    .model("GalleryCategory")
    .findByIdAndUpdate(this.category, { imageCount: count });
});

galleryImageSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const count = await mongoose
      .model("GalleryImage")
      .countDocuments({ category: doc.category });
    await mongoose
      .model("GalleryCategory")
      .findByIdAndUpdate(doc.category, { imageCount: count });
  }
});

galleryImageSchema.index({ category: 1, order: 1 });

const GalleryCategory = mongoose.model(
  "GalleryCategory",
  galleryCategorySchema,
);
const GalleryImage = mongoose.model("GalleryImage", galleryImageSchema);

module.exports = { GalleryCategory, GalleryImage };
