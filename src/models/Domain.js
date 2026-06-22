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
  { timestamps: true }
);

domainSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true, locale: "fr" });
  }
  next();
});

module.exports = mongoose.model("Domain", domainSchema);
