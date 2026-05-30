const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/experience.controller");
const { authenticate, authorizeAdmin } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { experienceSchema, updateExperienceSchema } = require("../validators/experience.validator");

// Public — optionally attach user for admin check
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);

// Protected — admin only
router.post("/", authenticate, authorizeAdmin, validate(experienceSchema), ctrl.create);
router.put("/:id", authenticate, authorizeAdmin, validate(updateExperienceSchema), ctrl.update);
router.delete("/:id", authenticate, authorizeAdmin, ctrl.remove);

module.exports = router;
