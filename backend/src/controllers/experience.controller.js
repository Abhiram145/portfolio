/**
 * Experience Controller — Full CRUD with caching
 */
const Experience = require("../models/Experience");
const { successResponse, parsePagination, paginationMeta, createError } = require("../utils/helpers");
const { getCache, setCache, deleteCachePattern } = require("../config/redis");

const CACHE_KEY = "experience";
const CACHE_TTL = 300; // 5 minutes

// ─── GET /api/experience ────────────────────────────────────────────────────
const getAll = async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const isAdmin = req.user?.role === "admin";

  const cacheKey = `${CACHE_KEY}:list:${page}:${limit}:${isAdmin}`;
  const cached = await getCache(cacheKey);
  if (cached) return successResponse(res, 200, "Experience fetched (cached)", cached.data, cached.meta);

  const filter = isAdmin ? {} : { isPublished: true };
  const [experiences, total] = await Promise.all([
    Experience.find(filter).sort({ order: 1, startDate: -1 }).skip(skip).limit(limit).lean(),
    Experience.countDocuments(filter),
  ]);

  const meta = paginationMeta(total, page, limit);
  await setCache(cacheKey, { data: experiences, meta }, CACHE_TTL);
  return successResponse(res, 200, "Experience fetched", experiences, meta);
};

// ─── GET /api/experience/:id ────────────────────────────────────────────────
const getById = async (req, res, next) => {
  const cacheKey = `${CACHE_KEY}:${req.params.id}`;
  const cached = await getCache(cacheKey);
  if (cached) return successResponse(res, 200, "Experience fetched (cached)", cached);

  const experience = await Experience.findById(req.params.id).lean();
  if (!experience) return next(createError(404, "Experience not found"));

  await setCache(cacheKey, experience, CACHE_TTL);
  return successResponse(res, 200, "Experience fetched", experience);
};

// ─── POST /api/experience ───────────────────────────────────────────────────
const create = async (req, res) => {
  const experience = await Experience.create(req.body);
  await deleteCachePattern(`${CACHE_KEY}:*`);
  return successResponse(res, 201, "Experience created", experience);
};

// ─── PUT /api/experience/:id ────────────────────────────────────────────────
const update = async (req, res, next) => {
  const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!experience) return next(createError(404, "Experience not found"));

  await deleteCachePattern(`${CACHE_KEY}:*`);
  return successResponse(res, 200, "Experience updated", experience);
};

// ─── DELETE /api/experience/:id ─────────────────────────────────────────────
const remove = async (req, res, next) => {
  const experience = await Experience.findByIdAndDelete(req.params.id);
  if (!experience) return next(createError(404, "Experience not found"));

  await deleteCachePattern(`${CACHE_KEY}:*`);
  return successResponse(res, 200, "Experience deleted");
};

module.exports = { getAll, getById, create, update, remove };
