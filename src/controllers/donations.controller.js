const Donation = require("../models/Donation");
const asyncHandler = require("../middleware/asyncHandler");

// POST /donations — public, appelé juste avant la redirection GeniusPay
const create = asyncHandler(async (req, res) => {
  const { donorName, donorEmail, phone, amount, transactionId } = req.body;

  const donation = await Donation.create({
    donorName,
    donorEmail,
    phone,
    amount,
    transactionId,
  });

  res
    .status(201)
    .json({ success: true, message: "Don enregistré", data: donation });
});

// GET /donations/admin — admin
const getAllAdmin = asyncHandler(async (req, res) => {
  const data = await Donation.find().sort({ createdAt: -1 });
  res.json({ success: true, data });
});

// PATCH /donations/:id/read — admin
const markAsRead = asyncHandler(async (req, res) => {
  const item = await Donation.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true },
  );
  if (!item)
    return res.status(404).json({ success: false, message: "Don introuvable" });
  res.json({ success: true, data: item });
});

// DELETE /donations/:id — admin
const remove = asyncHandler(async (req, res) => {
  const item = await Donation.findByIdAndDelete(req.params.id);
  if (!item)
    return res.status(404).json({ success: false, message: "Don introuvable" });
  res.json({ success: true, message: "Don supprimé" });
});

module.exports = { create, getAllAdmin, markAsRead, remove };
