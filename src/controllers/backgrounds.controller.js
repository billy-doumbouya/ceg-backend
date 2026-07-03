const BackgroundPage = require("../models/PageBackground");
const asyncHandler = require("../middleware/asyncHandler");
const { deleteImage } = require("../config/cloudinary");

// GET /backgrounds — public, toutes les bg (une requête pour hydrater tout le frontend)
const getAll = asyncHandler(async (req, res) => {
  const data = await BackgroundPage.find();
  res.json({ success: true, data });
});

// GET /backgrounds/:pageKey — public
const getOne = asyncHandler(async (req, res) => {
  const item = await BackgroundPage.findOne({ pageKey: req.params.pageKey });
  res.json({ success: true, data: item || null });
});

// PUT /backgrounds/:pageKey — admin, upsert
const upsert = asyncHandler(async (req, res) => {
  let item = await BackgroundPage.findOne({ pageKey: req.params.pageKey });

  // Nouvelle image uploadée + ancienne existante → suppression Cloudinary de l'ancienne
  if (req.file && item?.image?.publicId) {
    await deleteImage(item.image.publicId);
  }

  const update = {
    pageKey: req.params.pageKey,
    label: req.body.label ?? item?.label,
  };

  if (req.file) {
    update.image = {
      url: req.file.path,
      publicId: req.file.cloudinary_id,
    };
  }

  item = await BackgroundPage.findOneAndUpdate(
    { pageKey: req.params.pageKey },
    { $set: update }, // ← correction : $set explicite au lieu d'un remplacement brut
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  res.json({ success: true, message: "Image de fond mise à jour", data: item });
});

// DELETE /backgrounds/:pageKey — admin, revient au fallback gradient
const remove = asyncHandler(async (req, res) => {
  const item = await BackgroundPage.findOne({ pageKey: req.params.pageKey });
  if (!item)
    return res.status(404).json({ success: false, message: "Introuvable" });

  if (item.image?.publicId) await deleteImage(item.image.publicId);

  item.image = { url: null, publicId: null };
  await item.save();

  res.json({
    success: true,
    message: "Image de fond réinitialisée",
    data: item,
  });
});

module.exports = { getAll, getOne, upsert, remove };
