const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/project.controller");
const { authenticate, authorizeAdmin } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { projectSchema, updateProjectSchema } = require("../validators/project.validator");

// Public
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);         // supports both ObjectId and slug
router.post("/:id/click", ctrl.trackClick);

// Protected
router.post("/", authenticate, authorizeAdmin, validate(projectSchema), ctrl.create);
router.put("/:id", authenticate, authorizeAdmin, validate(updateProjectSchema), ctrl.update);
router.delete("/:id", authenticate, authorizeAdmin, ctrl.remove);

module.exports = router;
