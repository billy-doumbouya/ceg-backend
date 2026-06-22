// src/controllers/gallery.controller.js
const { GalleryCategory, GalleryImage } = require("../models/Gallery");
const asyncHandler = require("../middleware/asyncHandler");
const { deleteImage } = require("../config/cloudinary");

// ─── CATÉGORIES ─────────────────────────────────────────────────────────────

/** GET /api/gallery/categories */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await GalleryCategory.find().sort({ order: 1, name: 1 });
  res.json({ success: true, data: categories });
});

/** POST /api/gallery/categories — Admin */
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, order } = req.body;
  const catData = { name, description, order };

  if (req.file) {
    catData.cover = { url: req.file.path, publicId: req.file.filename };
  }

  const category = await GalleryCategory.create(catData);
  res.status(201).json({ success: true, message: "Catégorie créée", data: category });
});

/** PUT /api/gallery/categories/:id — Admin */
const updateCategory = asyncHandler(async (req, res) => {
  const category = await GalleryCategory.findById(req.params.id);
  if (!category) return res.status(404).json({ success: false, message: "Catégorie non trouvée" });

  const { name, description, order } = req.body;

  if (req.file) {
    if (category.cover?.publicId) await deleteImage(category.cover.publicId);
    category.cover = { url: req.file.path, publicId: req.file.filename };
  }

  if (name !== undefined) category.name = name;
  if (description !== undefined) category.description = description;
  if (order !== undefined) category.order = order;

  await category.save();
  res.json({ success: true, message: "Catégorie mise à jour", data: category });
});

/** DELETE /api/gallery/categories/:id — Admin */
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await GalleryCategory.findById(req.params.id);
  if (!category) return res.status(404).json({ success: false, message: "Catégorie non trouvée" });

  // Supprimer toutes les images de la catégorie
  const images = await GalleryImage.find({ category: req.params.id });
  for (const img of images) {
    if (img.image?.publicId) await deleteImage(img.image.publicId);
    await img.deleteOne();
  }

  if (category.cover?.publicId) await deleteImage(category.cover.publicId);
  await category.deleteOne();

  res.json({ success: true, message: "Catégorie et ses images supprimées" });
});

// ─── IMAGES ─────────────────────────────────────────────────────────────────

/** GET /api/gallery/images?category=:id */
const getImages = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 30 } = req.query;
  const filter = { isPublished: true };
  if (category) filter.category = category;

  const skip = (Number(page) - 1) * Number(limit);
  const [images, total] = await Promise.all([
    GalleryImage.find(filter)
      .populate("category", "name slug")
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    GalleryImage.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: images,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
  });
});

/** GET /api/gallery/images/admin */
const getImagesAdmin = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = {};
  if (category) filter.category = category;

  const images = await GalleryImage.find(filter)
    .populate("category", "name slug")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: images, total: images.length });
});

/** POST /api/gallery/images — Admin (upload multiple) */
const uploadImages = asyncHandler(async (req, res) => {
  const { category, caption, takenAt, order } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: "Aucune image fournie" });
  }

  const cat = await GalleryCategory.findById(category);
  if (!cat) return res.status(404).json({ success: false, message: "Catégorie non trouvée" });

  // Créer une entrée par image uploadée
  const images = await Promise.all(
    req.files.map((file, index) =>
      GalleryImage.create({
        category,
        image: { url: file.path, publicId: file.filename },
        caption: caption || "",
        takenAt: takenAt || "",
        order: (Number(order) || 0) + index,
      })
    )
  );

  res.status(201).json({
    success: true,
    message: `${images.length} image(s) uploadée(s) avec succès`,
    data: images,
  });
});

/** DELETE /api/gallery/images/:id — Admin */
const deleteGalleryImage = asyncHandler(async (req, res) => {
  const image = await GalleryImage.findById(req.params.id);
  if (!image) return res.status(404).json({ success: false, message: "Image non trouvée" });

  if (image.image?.publicId) await deleteImage(image.image.publicId);
  await image.deleteOne();

  res.json({ success: true, message: "Image supprimée avec succès" });
});

module.exports = {
  getCategories, createCategory, updateCategory, deleteCategory,
  getImages, getImagesAdmin, uploadImages, deleteGalleryImage,
};
