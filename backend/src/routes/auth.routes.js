const express = require("express");
const router = express.Router();
const { login, refresh, logout, getMe, updateMe } = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { loginSchema, refreshSchema } = require("../validators/auth.validator");

router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refresh);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);
router.put("/me", authenticate, updateMe);

module.exports = router;
