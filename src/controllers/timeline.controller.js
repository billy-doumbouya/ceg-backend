// src/controllers/timeline.controller.js
const Timeline = require("../models/Timeline");
const asyncHandler = require("../middleware/asyncHandler");

const getAll = asyncHandler(async (req, res) => {
  const data = await Timeline.find({ isPublished: true }).sort({ year: 1, order: 1 });
  res.json({ success: true, data });
});
const getAllAdmin = asyncHandler(async (req, res) => {
  const data = await Timeline.find().sort({ year: 1, order: 1 });
  res.json({ success: true, data });
});
const create = asyncHandler(async (req, res) => {
  const item = await Timeline.create(req.body);
  res.status(201).json({ success: true, message: "Événement créé", data: item });
});
const update = asyncHandler(async (req, res) => {
  const item = await Timeline.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ success: false, message: "Événement non trouvé" });
  res.json({ success: true, message: "Événement mis à jour", data: item });
});
const remove = asyncHandler(async (req, res) => {
  const item = await Timeline.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Événement non trouvé" });
  await item.deleteOne();
  res.json({ success: true, message: "Événement supprimé" });
});
module.exports = { getAll, getAllAdmin, create, update, remove };
