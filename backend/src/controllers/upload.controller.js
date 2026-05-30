/**
 * Upload Controller — Cloudinary image uploads
 */
const cloudinary = require("../config/cloudinary");
const { successResponse, createError } = require("../utils/helpers");
const multer = require("multer");

// Use memory storage — stream directly to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

// ─── POST /api/upload/image ─────────────────────────────────────────────────
const uploadImage = async (req, res, next) => {
  if (!req.file) return next(createError(400, "No file uploaded"));

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "portfolio",
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    return successResponse(res, 200, "Image uploaded", {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
    });
  } catch (error) {
    return next(createError(500, `Upload failed: ${error.message}`));
  }
};

// ─── DELETE /api/upload/image ───────────────────────────────────────────────
const deleteImage = async (req, res, next) => {
  const { publicId } = req.body;
  if (!publicId) return next(createError(400, "publicId is required"));

  try {
    await cloudinary.uploader.destroy(publicId);
    return successResponse(res, 200, "Image deleted");
  } catch (error) {
    return next(createError(500, `Delete failed: ${error.message}`));
  }
};

module.exports = { upload, uploadImage, deleteImage };
