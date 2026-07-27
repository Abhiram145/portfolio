/**
 * Skill Controller — Full CRUD with caching and category grouping
 */
const Skill = require("../models/Skill");
const { successResponse, createError } = require("../utils/helpers");

// ─── GET /api/skills ────────────────────────────────────────────────────────
const getAll = async (req, res) => {
  const isAdmin = req.user?.role === "admin";
  const { grouped } = req.query;

  const filter = isAdmin ? {} : { isPublished: true };
  const skills = await Skill.find(filter).sort({ category: 1, order: 1 }).lean();

  let result = skills;
  // Group by category if requested
  if (grouped === "true") {
    result = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});
  }

  return successResponse(res, 200, "Skills fetched", result);
};

// ─── GET /api/skills/:id ────────────────────────────────────────────────────
const getById = async (req, res, next) => {
  const skill = await Skill.findById(req.params.id).lean();
  if (!skill) return next(createError(404, "Skill not found"));
  return successResponse(res, 200, "Skill fetched", skill);
};

// ─── POST /api/skills ───────────────────────────────────────────────────────
const create = async (req, res) => {
  const skill = await Skill.create(req.body);
  return successResponse(res, 201, "Skill created", skill);
};

// ─── PUT /api/skills/:id ────────────────────────────────────────────────────
const update = async (req, res, next) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!skill) return next(createError(404, "Skill not found"));

  return successResponse(res, 200, "Skill updated", skill);
};

// ─── DELETE /api/skills/:id ─────────────────────────────────────────────────
const remove = async (req, res, next) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) return next(createError(404, "Skill not found"));

  return successResponse(res, 200, "Skill deleted");
};

module.exports = { getAll, getById, create, update, remove };
