// src/controllers/domains.controller.js
const Domain = require("../models/Domain");
const asyncHandler = require("../middleware/asyncHandler");

const getAll = asyncHandler(async (req, res) => {
  const data = await Domain.find({ isPublished: true }).sort({ order: 1 });
  res.json({ success: true, data });
});
const getAllAdmin = asyncHandler(async (req, res) => {
  const data = await Domain.find().sort({ order: 1 });
  res.json({ success: true, data });
});
const create = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (body.activities) body.activities = Array.isArray(body.activities) ? body.activities : JSON.parse(body.activities);
  const item = await Domain.create(body);
  res.status(201).json({ success: true, message: "Domaine créé", data: item });
});
const update = asyncHandler(async (req, res) => {
  const item = await Domain.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Domaine non trouvé" });
  const fields = ["title", "shortTitle", "icon", "color", "bgColor", "description", "impact", "order", "isPublished"];
  fields.forEach((f) => { if (req.body[f] !== undefined) item[f] = req.body[f]; });
  if (req.body.activities !== undefined) item.activities = Array.isArray(req.body.activities) ? req.body.activities : JSON.parse(req.body.activities);
  await item.save();
  res.json({ success: true, message: "Domaine mis à jour", data: item });
});
const remove = asyncHandler(async (req, res) => {
  const item = await Domain.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Domaine non trouvé" });
  await item.deleteOne();
  res.json({ success: true, message: "Domaine supprimé" });
});
module.exports = { getAll, getAllAdmin, create, update, remove };
