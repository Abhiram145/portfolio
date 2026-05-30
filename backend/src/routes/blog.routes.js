const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/blog.controller");
const { authenticate, authorizeAdmin } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { blogSchema, updateBlogSchema } = require("../validators/blog.validator");

// Public — slug-based read
router.get("/", ctrl.getAll);
router.get("/slug/:slug", ctrl.getBySlug);

// Admin reads by ID (for editing)
router.get("/:id", authenticate, authorizeAdmin, ctrl.getById);

// Protected writes
router.post("/", authenticate, authorizeAdmin, validate(blogSchema), ctrl.create);
router.put("/:id", authenticate, authorizeAdmin, validate(updateBlogSchema), ctrl.update);
router.delete("/:id", authenticate, authorizeAdmin, ctrl.remove);

module.exports = router;
