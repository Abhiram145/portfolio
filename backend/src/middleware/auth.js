/**
 * JWT Authentication Middleware
 * Verifies access token and attaches user to request
 */
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createError } = require("../utils/helpers");

const authenticate = async (req, res, next) => {
  try {
    let token;

    // Support Bearer token in Authorization header
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(createError(401, "Access denied. No token provided."));
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id).select("-password -refreshTokens");

    if (!user) {
      return next(createError(401, "User no longer exists."));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Authorization middleware — checks for admin role
 */
const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(createError(403, "Access denied. Admin only."));
  }
  next();
};

module.exports = { authenticate, authorizeAdmin };
