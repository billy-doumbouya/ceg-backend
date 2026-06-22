// src/config/cloudinary.js
// Configuration Cloudinary pour upload et optimisation des images

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configuration du SDK Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Crée un storage Cloudinary multer pour un dossier donné
 * @param {string} folder - Nom du dossier dans Cloudinary
 * @returns multer middleware
 */
const createUploader = (folder) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder: `ceg/${folder}`,
      // Optimisation automatique : format webp, qualité auto
      transformation: [
        { quality: "auto:good", fetch_format: "webp" },
        { width: 1200, crop: "limit" }, // Max 1200px de large
      ],
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
      // Nom unique basé sur timestamp
      public_id: `${folder}_${Date.now()}`,
    }),
  });

  return multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Seules les images sont autorisées"), false);
      }
    },
  });
};

/**
 * Supprime une image de Cloudinary par son public_id
 * @param {string} publicId - Public ID Cloudinary
 */
const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Erreur suppression Cloudinary:", error);
  }
};

/**
 * Extrait le public_id depuis une URL Cloudinary
 * @param {string} url - URL Cloudinary complète
 * @returns {string} public_id
 */
const extractPublicId = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");
  if (uploadIndex === -1) return null;
  // Ignorer la version (v1234567890)
  const relevantParts = parts.slice(uploadIndex + 2);
  const filename = relevantParts.join("/");
  return filename.replace(/\.[^/.]+$/, ""); // Supprimer l'extension
};

// Uploaders spécifiques par section
const uploaders = {
  news: createUploader("news"),
  projects: createUploader("projects"),
  gallery: createUploader("gallery"),
  partners: createUploader("partners"),
  testimonials: createUploader("testimonials"),
  domains: createUploader("domains"),
};

module.exports = { cloudinary, uploaders, deleteImage, extractPublicId };
