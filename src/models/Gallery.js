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
    cover: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
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

/**
 * Recalcule et persiste imageCount pour une catégorie donnée.
 * Source de vérité unique — appelée explicitement après chaque mutation
 * d'images plutôt que de dépendre de hooks Mongoose qui ne se déclenchent
 * pas dans tous les cas (ex: doc.deleteOne() vs Model.findOneAndDelete()).
 */
galleryCategorySchema.statics.recountImages = async function (categoryId) {
  if (!categoryId) return;
  const count = await mongoose
    .model("GalleryImage")
    .countDocuments({ category: categoryId });
  await this.findByIdAndUpdate(categoryId, { imageCount: count });
  return count;
};

// ─── Image de galerie ───────────────────────────────────────────────────────
const galleryImageSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GalleryCategory",
      required: [true, "La catégorie est requise"],
    },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      width: { type: Number, default: null },
      height: { type: Number, default: null },
    },
    caption: {
      type: String,
      trim: true,
      default: "",
    },
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

galleryImageSchema.index({ category: 1, order: 1 });

const GalleryCategory = mongoose.model(
  "GalleryCategory",
  galleryCategorySchema,
);
const GalleryImage = mongoose.model("GalleryImage", galleryImageSchema);

module.exports = { GalleryCategory, GalleryImage };