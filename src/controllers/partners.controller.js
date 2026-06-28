// src/controllers/partners.controller.js
const Partner = require("../models/Partner");
const asyncHandler = require("../middleware/asyncHandler");
const { deleteImage, extractPublicId } = require("../config/cloudinary");

const getAll = asyncHandler(async (req, res) => {
  const partners = await Partner.find({ isPublished: true }).sort({ order: 1 });
  res.json({ success: true, data: partners });
});

const getAllAdmin = asyncHandler(async (req, res) => {
  const partners = await Partner.find().sort({ order: 1 });
  res.json({ success: true, data: partners });
});

const create = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.body.domains) {
    data.domains = Array.isArray(req.body.domains)
      ? req.body.domains
      : JSON.parse(req.body.domains);
  }
  if (req.file) {
    data.logo = {
      url: req.file.path,
      publicId: req.file.filename || extractPublicId(req.file.path),
    };
  }
  const partner = await Partner.create(data);
  res
    .status(201)
    .json({ success: true, message: "Partenaire créé", data: partner });
});

const update = asyncHandler(async (req, res) => {
  const partner = await Partner.findById(req.params.id);
  if (!partner)
    return res
      .status(404)
      .json({ success: false, message: "Partenaire non trouvé" });

  if (req.file) {
    if (partner.logo?.publicId) await deleteImage(partner.logo.publicId);
    partner.logo = {
      url: req.file.path,
      publicId: req.file.filename || extractPublicId(req.file.path),
    };
  }

  const fields = [
    "name",
    "fullName",
    "logoText",
    "logoColor",
    "category",
    "description",
    "website",
    "partnership",
    "since",
    "order",
    "isPublished",
  ];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) partner[f] = req.body[f];
  });

  if (req.body.domains)
    partner.domains = Array.isArray(req.body.domains)
      ? req.body.domains
      : JSON.parse(req.body.domains);

  await partner.save();
  // Le hook pre("save") du modèle régénère le slug automatiquement
  // si "name" a changé — aucune logique supplémentaire requise ici.

  res.json({ success: true, message: "Partenaire mis à jour", data: partner });
});

const remove = asyncHandler(async (req, res) => {
  const partner = await Partner.findById(req.params.id);
  if (!partner)
    return res
      .status(404)
      .json({ success: false, message: "Partenaire non trouvé" });
  if (partner.logo?.publicId) await deleteImage(partner.logo.publicId);
  await partner.deleteOne();
  res.json({ success: true, message: "Partenaire supprimé" });
});

module.exports = { getAll, getAllAdmin, create, update, remove };
