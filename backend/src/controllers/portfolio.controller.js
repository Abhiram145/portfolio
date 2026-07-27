/**
 * Portfolio Controller — Aggregates all public data in one request
 */
const Experience = require("../models/Experience");
const Project = require("../models/Project");
const Skill = require("../models/Skill");
const Blog = require("../models/Blog");
const { successResponse } = require("../utils/helpers");

// ─── GET /api/portfolio ─────────────────────────────────────────────────────
const getPortfolio = async (req, res) => {
  const [experiences, projects, skills, blogs] = await Promise.all([
    Experience.find({ isPublished: true }).sort({ order: 1, startDate: -1 }).limit(10).lean(),
    Project.find({ status: "published" }).sort({ featured: -1, order: 1 }).limit(6).lean(),
    Skill.find({ isPublished: true }).sort({ category: 1, order: 1 }).lean(),
    Blog.find({ status: "published" })
      .select("-content")
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean(),
  ]);

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const data = { experiences, projects, skillsByCategory, blogs };
  return successResponse(res, 200, "Portfolio fetched", data);
};

module.exports = { getPortfolio };
