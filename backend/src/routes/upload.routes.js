const express = require("express");
const router = express.Router();
const { upload, uploadImage, deleteImage } = require("../controllers/upload.controller");
const { authenticate, authorizeAdmin } = require("../middleware/auth");

router.post("/image", authenticate, authorizeAdmin, upload.single("image"), uploadImage);
router.delete("/image", authenticate, authorizeAdmin, deleteImage);

module.exports = router;
