/**
 * Express App Configuration
 * Middleware, routes, and error handling are all wired here
 */
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

// Route imports
const authRoutes = require("./routes/auth.routes");
const experienceRoutes = require("./routes/experience.routes");
const projectRoutes = require("./routes/project.routes");
const skillRoutes = require("./routes/skill.routes");
const blogRoutes = require("./routes/blog.routes");
const portfolioRoutes = require("./routes/portfolio.routes");
const uploadRoutes = require("./routes/upload.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const resumeRoutes = require("./routes/resume.routes");

const app = express();

// ─── Security Headers ──────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Rate Limiting ─────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Increased for dev testing
  message: { success: false, message: "Too many auth attempts, please try again later." },
});

// ─── Body Parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ─── Logging ──────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// ─── Health Check ─────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString(), version: "1.0.0" });
});

// ─── API Routes ────────────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/portfolio", apiLimiter, portfolioRoutes);
app.use("/api/experience", apiLimiter, experienceRoutes);
app.use("/api/projects", apiLimiter, projectRoutes);
app.use("/api/skills", apiLimiter, skillRoutes);
app.use("/api/blogs", apiLimiter, blogRoutes);
app.use("/api/upload", apiLimiter, uploadRoutes);
app.use("/api/analytics", apiLimiter, analyticsRoutes);
app.use("/api/resume", apiLimiter, resumeRoutes);

// ─── 404 & Error Handling ──────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
