const express = require("express");
const router = express.Router();
const { getPortfolio } = require("../controllers/portfolio.controller");

router.get("/", getPortfolio);

module.exports = router;
