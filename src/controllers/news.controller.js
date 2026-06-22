// src/controllers/news.controller.js
const News = require("../models/News");
const asyncHandler = require("../middleware/asyncHandler");
const { deleteImage } = require("../config/cloudinary");

const parseArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try { return JSON.parse(value); } catch { return [value]; }
};

/** GET /api/news — Public */
const getAll = asyncHandler(async (req, res) => {
  const { category, featured, page = 1, limit = 10 } = req.query;
  const filter = { isPublished: true };
  if (category) filter.category = category;
  if (featured !== undefined) filter.featured = featured === "true";

  const skip = (Number(page) - 1) * Number(limit);
  const [news, total] = await Promise.all([
    News.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    News.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: news,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
  });
});

/** GET /api/news/admin — Dashboard */
const getAllAdmin = asyncHandler(async (req, res) => {
  const news = await News.find().sort({ createdAt: -1 });
  res.json({ success: true, data: news, total: news.length });
});

/** GET /api/news/:slug */
const getOne = asyncHandler(async (req, res) => {
  const article = await News.findOne({ slug: req.params.slug });
  if (!article) return res.status(404).json({ success: false, message: "Article non trouvé" });
  res.json({ success: true, data: article });
});

/** POST /api/news — Admin */
const create = asyncHandler(async (req, res) => {
  const { title, excerpt, content, date, category, author, tags, featured, isPublished } = req.body;

  const articleData = {
    title, excerpt, content, date, category, author,
    tags: parseArray(tags),
    featured: featured === "true" || featured === true,
    isPublished: isPublished !== "false" && isPublished !== false,
  };

  if (req.file) {
    articleData.image = { url: req.file.path, publicId: req.file.filename };
  }

  const article = await News.create(articleData);
  res.status(201).json({ success: true, message: "Article créé avec succès", data: article });
});

/** PUT /api/news/:id — Admin */
const update = asyncHandler(async (req, res) => {
  const article = await News.findById(req.params.id);
  if (!article) return res.status(404).json({ success: false, message: "Article non trouvé" });

  const { title, excerpt, content, date, category, author, tags, featured, isPublished } = req.body;

  if (req.file) {
    if (article.image?.publicId) await deleteImage(article.image.publicId);
    article.image = { url: req.file.path, publicId: req.file.filename };
  }

  if (title !== undefined) article.title = title;
  if (excerpt !== undefined) article.excerpt = excerpt;
  if (content !== undefined) article.content = content;
  if (date !== undefined) article.date = date;
  if (category !== undefined) article.category = category;
  if (author !== undefined) article.author = author;
  if (tags !== undefined) article.tags = parseArray(tags);
  if (featured !== undefined) article.featured = featured === "true" || featured === true;
  if (isPublished !== undefined) article.isPublished = isPublished !== "false" && isPublished !== false;

  await article.save();
  res.json({ success: true, message: "Article mis à jour", data: article });
});

/** DELETE /api/news/:id — Admin */
const remove = asyncHandler(async (req, res) => {
  const article = await News.findById(req.params.id);
  if (!article) return res.status(404).json({ success: false, message: "Article non trouvé" });
  if (article.image?.publicId) await deleteImage(article.image.publicId);
  await article.deleteOne();
  res.json({ success: true, message: "Article supprimé avec succès" });
});

module.exports = { getAll, getAllAdmin, getOne, create, update, remove };
