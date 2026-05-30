/**
 * Skill Controller — Full CRUD with caching and category grouping
 */
const Skill = require("../models/Skill");
const { successResponse, createError } = require("../utils/helpers");
const { getCache, setCache, deleteCachePattern } = require("../config/redis");

const CACHE_KEY = "skills";
const CACHE_TTL = 600; // 10 minutes (skills change rarely)

// ─── GET /api/skills ────────────────────────────────────────────────────────
const getAll = async (req, res) => {
  const isAdmin = req.user?.role === "admin";
  const { grouped } = req.query;

  const cacheKey = `${CACHE_KEY}:${isAdmin}:${grouped}`;
  const cached = await getCache(cacheKey);
  if (cached) return successResponse(res, 200, "Skills fetched (cached)", cached);

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

  await setCache(cacheKey, result, CACHE_TTL);
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
  await deleteCachePattern(`${CACHE_KEY}:*`);
  return successResponse(res, 201, "Skill created", skill);
};

// ─── PUT /api/skills/:id ────────────────────────────────────────────────────
const update = async (req, res, next) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!skill) return next(createError(404, "Skill not found"));

  await deleteCachePattern(`${CACHE_KEY}:*`);
  return successResponse(res, 200, "Skill updated", skill);
};

// ─── DELETE /api/skills/:id ─────────────────────────────────────────────────
const remove = async (req, res, next) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) return next(createError(404, "Skill not found"));

  await deleteCachePattern(`${CACHE_KEY}:*`);
  return successResponse(res, 200, "Skill deleted");
};

module.exports = { getAll, getById, create, update, remove };
