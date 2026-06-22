// src/controllers/testimonials.controller.js
const Testimonial = require("../models/Testimonial");
const asyncHandler = require("../middleware/asyncHandler");
const { deleteImage } = require("../config/cloudinary");

const getAll = asyncHandler(async (req, res) => {
  const data = await Testimonial.find({ isPublished: true }).sort({ order: 1 });
  res.json({ success: true, data });
});
const getAllAdmin = asyncHandler(async (req, res) => {
  const data = await Testimonial.find().sort({ order: 1 });
  res.json({ success: true, data });
});
const create = asyncHandler(async (req, res) => {
  const tData = { ...req.body };
  if (req.file) tData.avatar = { url: req.file.path, publicId: req.file.filename };
  const item = await Testimonial.create(tData);
  res.status(201).json({ success: true, message: "Témoignage créé", data: item });
});
const update = asyncHandler(async (req, res) => {
  const item = await Testimonial.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Témoignage non trouvé" });
  if (req.file) {
    if (item.avatar?.publicId) await deleteImage(item.avatar.publicId);
    item.avatar = { url: req.file.path, publicId: req.file.filename };
  }
  ["name", "role", "content", "rating", "order", "isPublished"].forEach((f) => {
    if (req.body[f] !== undefined) item[f] = req.body[f];
  });
  await item.save();
  res.json({ success: true, message: "Témoignage mis à jour", data: item });
});
const remove = asyncHandler(async (req, res) => {
  const item = await Testimonial.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Témoignage non trouvé" });
  if (item.avatar?.publicId) await deleteImage(item.avatar.publicId);
  await item.deleteOne();
  res.json({ success: true, message: "Témoignage supprimé" });
});
module.exports = { getAll, getAllAdmin, create, update, remove };
