const express = require("express");
const router = express.Router();
const { getResume } = require("../controllers/resume.controller");

router.get("/", getResume);

module.exports = router;
