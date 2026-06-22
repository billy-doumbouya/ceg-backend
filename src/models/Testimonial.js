// src/models/Testimonial.js
const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
    },
    role: { type: String, trim: true },
    content: {
      type: String,
      required: [true, "Le témoignage est requis"],
      trim: true,
      maxlength: [1000, "Le témoignage ne peut pas dépasser 1000 caractères"],
    },
    avatar: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
