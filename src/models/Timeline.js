// src/models/Timeline.js
const mongoose = require("mongoose");

const timelineSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: [true, "L'année est requise"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Le titre est requis"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La description est requise"],
      trim: true,
    },
    icon: { type: String, default: "flag" },
    color: { type: String, default: "#15803D" },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Tri par année puis ordre
timelineSchema.index({ year: 1, order: 1 });

module.exports = mongoose.model("Timeline", timelineSchema);
