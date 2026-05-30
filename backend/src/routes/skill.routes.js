const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/skill.controller");
const { authenticate, authorizeAdmin } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { skillSchema, updateSkillSchema } = require("../validators/skill.validator");

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);

router.post("/", authenticate, authorizeAdmin, validate(skillSchema), ctrl.create);
router.put("/:id", authenticate, authorizeAdmin, validate(updateSkillSchema), ctrl.update);
router.delete("/:id", authenticate, authorizeAdmin, ctrl.remove);

module.exports = router;
