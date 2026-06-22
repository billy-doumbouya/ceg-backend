// src/controllers/statistics.controller.js
const Statistic = require("../models/Statistic");
const asyncHandler = require("../middleware/asyncHandler");

const getAll = asyncHandler(async (req, res) => {
  const data = await Statistic.find({ isPublished: true }).sort({ order: 1 });
  res.json({ success: true, data });
});
const getAllAdmin = asyncHandler(async (req, res) => {
  const data = await Statistic.find().sort({ order: 1 });
  res.json({ success: true, data });
});
const create = asyncHandler(async (req, res) => {
  const item = await Statistic.create(req.body);
  res.status(201).json({ success: true, message: "Statistique créée", data: item });
});
const update = asyncHandler(async (req, res) => {
  const item = await Statistic.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ success: false, message: "Statistique non trouvée" });
  res.json({ success: true, message: "Statistique mise à jour", data: item });
});
const remove = asyncHandler(async (req, res) => {
  const item = await Statistic.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Statistique non trouvée" });
  await item.deleteOne();
  res.json({ success: true, message: "Statistique supprimée" });
});
module.exports = { getAll, getAllAdmin, create, update, remove };
