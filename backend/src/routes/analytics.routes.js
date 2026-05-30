const express = require("express");
const router = express.Router();
const { trackEvent, getDashboard } = require("../controllers/analytics.controller");
const { authenticate, authorizeAdmin } = require("../middleware/auth");

// Public event tracking
router.post("/track", trackEvent);

// Admin dashboard metrics
router.get("/dashboard", authenticate, authorizeAdmin, getDashboard);

module.exports = router;
