// src/config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// 1. Vérification immédiate des variables d'environnement
console.log("[Cloudinary Config] Initialisation du SDK...", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "MANQUANT ❌",
  api_key: process.env.CLOUDINARY_API_KEY ? "PRÉSENT ✅" : "MANQUANT ❌",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "PRÉSENT ✅" : "MANQUANT ❌",
});

// Configuration du SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.api
  .ping()
  .then((res) => console.log("--- 🎉 CONNEXION CLOUDINARY VALIDE ! ---", res))
  .catch((err) =>
    console.error("--- ❌ CLÉS CLOUDINARY INVALIDES ! ---", err.message),
  );

// 2. Définition du stockage en mémoire pour Multer
const memoryStorage = multer.memoryStorage();
const uploadMiddleware = multer({
  storage: memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB
  fileFilter: (req, file, cb) => {
    console.log(
      `[Multer Filter] Analyse du fichier : ${file.originalname} (${file.mimetype})`,
    );
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      console.error(`[Multer Filter] Fichier refusé : ${file.mimetype}`);
      cb(new Error("Seules les images sont autorisées"), false);
    }
  },
});

// 3. Fonction d'upload via Stream vers Cloudinary
const uploadToCloudinaryStream = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const publicId = `${folder}_${Date.now()}`;
    console.log(`[Cloudinary Stream] Envoi vers le dossier : ceg/${folder}`);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `ceg/${folder}`,
        public_id: publicId,
      },
      (error, result) => {
        if (error) {
          console.error("[Cloudinary Stream] ❌ ERREUR CLOUDINARY:", {
            message: error.message,
            http_code: error.http_code,
          });
          return reject(error);
        }
        console.log(
          "[Cloudinary Stream] 🎉 UPLOAD RÉUSSI ! URL:",
          result.secure_url,
        );
        resolve(result);
      },
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Factory qui imite l'objet multer pour ne pas casser ton fichier routes
 */
const createSmartUploader = (folder) => {
  return {
    // On recrée la méthode .single() attendue par tes routes
    single: (fieldName) => {
      return [
        uploadMiddleware.single(fieldName),
        async (req, res, next) => {
          if (!req.file) {
            console.warn(
              `[Uploader] Aucun fichier reçu dans le champ '${fieldName}' pour '${folder}'`,
            );
            return next();
          }

          try {
            console.log(
              `[Uploader] Traitement de ${req.file.originalname}. Envoi Cloudinary...`,
            );
            const cloudinaryResult = await uploadToCloudinaryStream(
              req.file.buffer,
              folder,
            );

            // Injection des variables attendues par tes controleurs
            req.cloudinaryResult = cloudinaryResult;
            req.file.path = cloudinaryResult.secure_url;
            req.file.cloudinary_id = cloudinaryResult.public_id;

            next();
          } catch (error) {
            res.status(error.http_code || 500).json({
              error: "Erreur lors de l'upload vers Cloudinary",
              details: error.message,
            });
          }
        },
      ];
    },

    // Fallback rapide pour la route gallery .array() si tu en as besoin
    array: (fieldName, maxCount) => {
      return [
        uploadMiddleware.array(fieldName, maxCount),
        async (req, res, next) => {
          if (!req.files || req.files.length === 0) return next();
          try {
            console.log(
              `[Uploader] Traitement de ${req.files.length} fichiers pour '${folder}'`,
            );
            // On mappe les promesses pour uploader en parallèle
            const uploadPromises = req.files.map(async (file) => {
              const result = await uploadToCloudinaryStream(
                file.buffer,
                folder,
              );
              file.path = result.secure_url;
              file.cloudinary_id = result.public_id;
              return result;
            });
            req.cloudinaryResults = await Promise.all(uploadPromises);
            next();
          } catch (error) {
            res.status(error.http_code || 500).json({ error: error.message });
          }
        },
      ];
    },
  };
};

// 4. Maintien de l'API originale pour tes routes
const uploaders = {
  news: createSmartUploader("news"),
  projects: createSmartUploader("projects"),
  gallery: createSmartUploader("gallery"),
  partners: createSmartUploader("partners"),
  testimonials: createSmartUploader("testimonials"),
  domains: createSmartUploader("domains"),
};

const deleteImage = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("[Cloudinary Delete] Erreur:", error);
  }
};

const extractPublicId = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");
  if (uploadIndex === -1) return null;
  return parts
    .slice(uploadIndex + 2)
    .join("/")
    .replace(/\.[^/.]+$/, "");
};

module.exports = { cloudinary, uploaders, deleteImage, extractPublicId };
