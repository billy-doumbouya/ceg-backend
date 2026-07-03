const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, required: true, trim: true },
    donorEmail: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Donation", donationSchema);