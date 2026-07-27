/**
 * Experience Controller — Full CRUD with caching
 */
const Experience = require("../models/Experience");
const { successResponse, parsePagination, paginationMeta, createError } = require("../utils/helpers");

// ─── GET /api/experience ────────────────────────────────────────────────────
const getAll = async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const isAdmin = req.user?.role === "admin";

  const filter = isAdmin ? {} : { isPublished: true };
  const [experiences, total] = await Promise.all([
    Experience.find(filter).sort({ order: 1, startDate: -1 }).skip(skip).limit(limit).lean(),
    Experience.countDocuments(filter),
  ]);

  const meta = paginationMeta(total, page, limit);
  return successResponse(res, 200, "Experience fetched", experiences, meta);
};

// ─── GET /api/experience/:id ────────────────────────────────────────────────
const getById = async (req, res, next) => {
  const experience = await Experience.findById(req.params.id).lean();
  if (!experience) return next(createError(404, "Experience not found"));

  return successResponse(res, 200, "Experience fetched", experience);
};

// ─── POST /api/experience ───────────────────────────────────────────────────
const create = async (req, res) => {
  const experience = await Experience.create(req.body);
  return successResponse(res, 201, "Experience created", experience);
};

// ─── PUT /api/experience/:id ────────────────────────────────────────────────
const update = async (req, res, next) => {
  const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!experience) return next(createError(404, "Experience not found"));

  return successResponse(res, 200, "Experience updated", experience);
};

// ─── DELETE /api/experience/:id ─────────────────────────────────────────────
const remove = async (req, res, next) => {
  const experience = await Experience.findByIdAndDelete(req.params.id);
  if (!experience) return next(createError(404, "Experience not found"));

  return successResponse(res, 200, "Experience deleted");
};

module.exports = { getAll, getById, create, update, remove };
