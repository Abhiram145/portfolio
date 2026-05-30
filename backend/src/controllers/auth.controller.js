/**
 * Auth Controller
 * Handles login, token refresh, logout, and profile
 */
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  createError,
  generateAccessToken,
  generateRefreshToken,
  successResponse,
} = require("../utils/helpers");

// ─── POST /api/auth/login ───────────────────────────────────────────────────
const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password +refreshTokens");
  if (!user || !(await user.comparePassword(password))) {
    return next(createError(401, "Invalid email or password"));
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Store refresh token (limit to 5 active sessions)
  user.refreshTokens = [...(user.refreshTokens || []).slice(-4), refreshToken];
  user.lastLogin = new Date();
  await user.save();

  // Set refresh token in httpOnly cookie for extra security
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return successResponse(res, 200, "Login successful", {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};

// ─── POST /api/auth/refresh ─────────────────────────────────────────────────
const refresh = async (req, res, next) => {
  const token = req.body.refreshToken || req.cookies?.refreshToken;
  if (!token) return next(createError(401, "No refresh token provided"));

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    return next(createError(401, "Invalid or expired refresh token"));
  }

  const user = await User.findById(decoded.id).select("+refreshTokens");
  if (!user || !user.refreshTokens.includes(token)) {
    return next(createError(401, "Refresh token revoked or invalid"));
  }

  // Rotate refresh token
  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
  user.refreshTokens.push(newRefreshToken);
  await user.save();

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return successResponse(res, 200, "Token refreshed", {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
};

// ─── POST /api/auth/logout ──────────────────────────────────────────────────
const logout = async (req, res, next) => {
  const token = req.body.refreshToken || req.cookies?.refreshToken;

  if (token && req.user) {
    const user = await User.findById(req.user._id).select("+refreshTokens");
    if (user) {
      user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
      await user.save();
    }
  }

  res.clearCookie("refreshToken");
  return successResponse(res, 200, "Logged out successfully");
};

// ─── GET /api/auth/me ───────────────────────────────────────────────────────
const getMe = async (req, res) => {
  return successResponse(res, 200, "Profile fetched", req.user);
};

// ─── PUT /api/auth/me ───────────────────────────────────────────────────────
const updateMe = async (req, res, next) => {
  const allowedFields = ["name", "avatar"];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  return successResponse(res, 200, "Profile updated", user);
};

module.exports = { login, refresh, logout, getMe, updateMe };
