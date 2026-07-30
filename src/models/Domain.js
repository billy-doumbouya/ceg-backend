// src/models/Domain.js
const mongoose = require("mongoose");
const slugify = require("slugify");

const domainSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre est requis"],
      trim: true,
    },
    shortTitle: { type: String, trim: true },
    slug: { type: String, unique: true },
    icon: { type: String, default: "leaf" },
    color: { type: String, default: "#15803D" },
    bgColor: { type: String, default: "#F0FDF4" },
    description: { type: String, trim: true },
    activities: { type: [String], default: [] },
    impact: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Génération automatique et vérification d'unicité du slug
domainSchema.pre("save", async function (next) {
  if (this.isModified("title") || !this.slug) {
    let baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
      locale: "fr",
    });

    let slug = baseSlug;
    let count = 1;
    while (
      await mongoose.model("Domain").findOne({ slug, _id: { $ne: this._id } })
    ) {
      slug = `${baseSlug}-${count}`;
      count++;
    }
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model("Domain", domainSchema);
