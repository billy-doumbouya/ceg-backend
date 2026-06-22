// src/models/Statistic.js
const mongoose = require("mongoose");

const statisticSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, "Le label est requis"],
      trim: true,
    },
    value: {
      type: Number,
      required: [true, "La valeur est requise"],
    },
    suffix: { type: String, default: "" },
    icon: { type: String, default: "chart" },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Statistic", statisticSchema);
