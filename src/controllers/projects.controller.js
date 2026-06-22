// src/controllers/projects.controller.js
// CRUD complet pour les projets

const Project = require("../models/Project");
const asyncHandler = require("../middleware/asyncHandler");
const { deleteImage, extractPublicId } = require("../config/cloudinary");

/**
 * GET /api/projects
 * Liste tous les projets (public — filtrés isPublished)
 */
const getAll = asyncHandler(async (req, res) => {
  const { status, category, page = 1, limit = 20 } = req.query;

  const filter = { isPublished: true };
  if (status) filter.status = status;
  if (category) filter.category = category;

  const skip = (Number(page) - 1) * Number(limit);

  const [projects, total] = await Promise.all([
    Project.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(Number(limit)),
    Project.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: projects,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
  });
});

/**
 * GET /api/projects/admin
 * Liste tous les projets pour le dashboard (avec non publiés)
 */
const getAllAdmin = asyncHandler(async (req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  res.json({ success: true, data: projects, total: projects.length });
});

/**
 * GET /api/projects/:slug
 * Détail d'un projet par slug
 */
const getOne = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project) {
    return res.status(404).json({ success: false, message: "Projet non trouvé" });
  }
  res.json({ success: true, data: project });
});

/**
 * POST /api/projects
 * Créer un projet (admin)
 */
const create = asyncHandler(async (req, res) => {
  const {
    title, description, date, location, category,
    status, funder, budget, objectives, results, tags, order, isPublished,
  } = req.body;

  const projectData = {
    title, description, date, location, category,
    status, funder, budget, order, isPublished,
    objectives: parseArray(objectives),
    results: parseArray(results),
    tags: parseArray(tags),
  };

  // Image uploadée via Cloudinary
  if (req.file) {
    projectData.image = {
      url: req.file.path,
      publicId: req.file.filename,
    };
  }

  const project = await Project.create(projectData);
  res.status(201).json({ success: true, message: "Projet créé avec succès", data: project });
});

/**
 * PUT /api/projects/:id
 * Mettre à jour un projet (admin)
 */
const update = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: "Projet non trouvé" });
  }

  const {
    title, description, date, location, category,
    status, funder, budget, objectives, results, tags, order, isPublished,
  } = req.body;

  // Si nouvelle image — supprimer l'ancienne de Cloudinary
  if (req.file) {
    if (project.image?.publicId) {
      await deleteImage(project.image.publicId);
    }
    project.image = { url: req.file.path, publicId: req.file.filename };
  }

  // Mise à jour des champs
  if (title !== undefined) project.title = title;
  if (description !== undefined) project.description = description;
  if (date !== undefined) project.date = date;
  if (location !== undefined) project.location = location;
  if (category !== undefined) project.category = category;
  if (status !== undefined) project.status = status;
  if (funder !== undefined) project.funder = funder;
  if (budget !== undefined) project.budget = budget;
  if (objectives !== undefined) project.objectives = parseArray(objectives);
  if (results !== undefined) project.results = parseArray(results);
  if (tags !== undefined) project.tags = parseArray(tags);
  if (order !== undefined) project.order = order;
  if (isPublished !== undefined) project.isPublished = isPublished;

  await project.save();
  res.json({ success: true, message: "Projet mis à jour", data: project });
});

/**
 * DELETE /api/projects/:id
 * Supprimer un projet (admin)
 */
const remove = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: "Projet non trouvé" });
  }

  // Supprimer l'image Cloudinary
  if (project.image?.publicId) {
    await deleteImage(project.image.publicId);
  }

  await project.deleteOne();
  res.json({ success: true, message: "Projet supprimé avec succès" });
});

// Helper — parse tableau depuis JSON string ou tableau
const parseArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try { return JSON.parse(value); } catch { return [value]; }
};

module.exports = { getAll, getAllAdmin, getOne, create, update, remove };
