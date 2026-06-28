// src/models/Partner.js
const mongoose = require("mongoose");
const slugify = require("slugify");

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    fullName: { type: String, trim: true },
    logo: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    logoText: { type: String, trim: true },
    logoColor: { type: String, default: "#000000" },
    category: { type: String, trim: true },
    description: { type: String, trim: true },
    website: { type: String, trim: true },
    partnership: { type: String, trim: true },
    domains: { type: [String], default: [] },
    since: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

partnerSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true, locale: "fr" });
  }
  next();
});

module.exports = mongoose.model("Partner", partnerSchema);
