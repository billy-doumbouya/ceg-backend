// src/models/PageBackground.js
const mongoose = require("mongoose");

const pageBackgroundSchema = new mongoose.Schema(
  {
    pageKey: {
      type: String,
      required: [true, "La clé de page est requise"],
      unique: true,
      trim: true,
    },
    label: { type: String, trim: true },
    image: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.PageBackground ||
  mongoose.model("PageBackground", pageBackgroundSchema);
