// src/routes/index.js
// Point d'entrée central de toutes les routes

const express = require("express");
const router = express.Router();

const { requireAuth, redirectIfAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { body } = require("express-validator");
const { uploaders } = require("../config/cloudinary");

// ─── Controllers ─────────────────────────────────────────────────────────────
const authCtrl        = require("../controllers/auth.controller");
const projectsCtrl    = require("../controllers/projects.controller");
const newsCtrl        = require("../controllers/news.controller");
const galleryCtrl     = require("../controllers/gallery.controller");
const partnersCtrl    = require("../controllers/partners.controller");
const testimonialsCtrl= require("../controllers/testimonials.controller");
const statisticsCtrl  = require("../controllers/statistics.controller");
const domainsCtrl     = require("../controllers/domains.controller");
const timelineCtrl    = require("../controllers/timeline.controller");
const contactCtrl     = require("../controllers/contact.controller");

// ─── AUTH ────────────────────────────────────────────────────────────────────
router.post("/auth/login",
  [body("password").notEmpty().withMessage("Mot de passe requis")],
  validate,
  redirectIfAuth,
  authCtrl.login
);
router.post("/auth/logout", requireAuth, authCtrl.logout);
router.get("/auth/me", requireAuth, authCtrl.me);

// ─── PROJECTS ────────────────────────────────────────────────────────────────
router.get("/projects", projectsCtrl.getAll);
router.get("/projects/admin", requireAuth, projectsCtrl.getAllAdmin);
router.get("/projects/:slug", projectsCtrl.getOne);
router.post("/projects", requireAuth, uploaders.projects.single("image"), projectsCtrl.create);
router.put("/projects/:id", requireAuth, uploaders.projects.single("image"), projectsCtrl.update);
router.delete("/projects/:id", requireAuth, projectsCtrl.remove);

// ─── NEWS ─────────────────────────────────────────────────────────────────────
router.get("/news", newsCtrl.getAll);
router.get("/news/admin", requireAuth, newsCtrl.getAllAdmin);
router.get("/news/:slug", newsCtrl.getOne);
router.post("/news", requireAuth, uploaders.news.single("image"), newsCtrl.create);
router.put("/news/:id", requireAuth, uploaders.news.single("image"), newsCtrl.update);
router.delete("/news/:id", requireAuth, newsCtrl.remove);

// ─── GALLERY ─────────────────────────────────────────────────────────────────
// Catégories
router.get("/gallery/categories", galleryCtrl.getCategories);
router.post("/gallery/categories", requireAuth, uploaders.gallery.single("cover"), galleryCtrl.createCategory);
router.put("/gallery/categories/:id", requireAuth, uploaders.gallery.single("cover"), galleryCtrl.updateCategory);
router.delete("/gallery/categories/:id", requireAuth, galleryCtrl.deleteCategory);

// Images
router.get("/gallery/images", galleryCtrl.getImages);
router.get("/gallery/images/admin", requireAuth, galleryCtrl.getImagesAdmin);
router.put("/gallery/images/:id", requireAuth, uploaders.gallery.single("image"), galleryCtrl.updateGalleryImage);
router.post("/gallery/images", requireAuth, uploaders.gallery.array("images", 50), galleryCtrl.uploadImages);
router.delete("/gallery/images/:id", requireAuth, galleryCtrl.deleteGalleryImage);

// ─── PARTNERS ────────────────────────────────────────────────────────────────
router.get("/partners", partnersCtrl.getAll);
router.get("/partners/admin", requireAuth, partnersCtrl.getAllAdmin);
router.post("/partners", requireAuth, uploaders.partners.single("logo"), partnersCtrl.create);
router.put("/partners/:id", requireAuth, uploaders.partners.single("logo"), partnersCtrl.update);
router.delete("/partners/:id", requireAuth, partnersCtrl.remove);

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
router.get("/testimonials", testimonialsCtrl.getAll);
router.get("/testimonials/admin", requireAuth, testimonialsCtrl.getAllAdmin);
router.post("/testimonials", requireAuth, uploaders.testimonials.single("avatar"), testimonialsCtrl.create);
router.put("/testimonials/:id", requireAuth, uploaders.testimonials.single("avatar"), testimonialsCtrl.update);
router.delete("/testimonials/:id", requireAuth, testimonialsCtrl.remove);

// ─── STATISTICS ──────────────────────────────────────────────────────────────
router.get("/statistics", statisticsCtrl.getAll);
router.get("/statistics/admin", requireAuth, statisticsCtrl.getAllAdmin);
router.post("/statistics", requireAuth, statisticsCtrl.create);
router.put("/statistics/:id", requireAuth, statisticsCtrl.update);
router.delete("/statistics/:id", requireAuth, statisticsCtrl.remove);

// ─── DOMAINS ─────────────────────────────────────────────────────────────────
router.get("/domains", domainsCtrl.getAll);
router.get("/domains/admin", requireAuth, domainsCtrl.getAllAdmin);
router.post("/domains", requireAuth, domainsCtrl.create);
router.put("/domains/:id", requireAuth, domainsCtrl.update);
router.delete("/domains/:id", requireAuth, domainsCtrl.remove);

// ─── TIMELINE ────────────────────────────────────────────────────────────────
router.get("/timeline", timelineCtrl.getAll);
router.get("/timeline/admin", requireAuth, timelineCtrl.getAllAdmin);
router.post("/timeline", requireAuth, timelineCtrl.create);
router.put("/timeline/:id", requireAuth, timelineCtrl.update);
router.delete("/timeline/:id", requireAuth, timelineCtrl.remove);

// ─── CONTACT ─────────────────────────────────────────────────────────────────
router.post("/contact",
  [
    body("name").notEmpty().withMessage("Le nom est requis"),
    body("email").isEmail().withMessage("Email invalide"),
    body("subject").notEmpty().withMessage("Le sujet est requis"),
    body("message").notEmpty().withMessage("Le message est requis"),
  ],
  validate,
  contactCtrl.sendContact
);

module.exports = router;
