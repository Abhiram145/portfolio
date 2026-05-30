/**
 * Project Controller — Full CRUD with view/click tracking and caching
 */
const Project = require("../models/Project");
const Analytics = require("../models/Analytics");
const { successResponse, parsePagination, paginationMeta, createError } = require("../utils/helpers");
const { getCache, setCache, deleteCachePattern } = require("../config/redis");

const CACHE_KEY = "projects";
const CACHE_TTL = 300;

// ─── GET /api/projects ──────────────────────────────────────────────────────
const getAll = async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const isAdmin = req.user?.role === "admin";
  const { category, featured, status } = req.query;

  const cacheKey = `${CACHE_KEY}:${page}:${limit}:${isAdmin}:${category}:${featured}:${status}`;
  const cached = await getCache(cacheKey);
  if (cached) return successResponse(res, 200, "Projects fetched (cached)", cached.data, cached.meta);

  const filter = isAdmin ? {} : { status: "published" };
  if (category) filter.category = category;
  if (featured !== undefined) filter.featured = featured === "true";
  if (isAdmin && status) filter.status = status;

  const [projects, total] = await Promise.all([
    Project.find(filter).sort({ order: 1, featured: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    Project.countDocuments(filter),
  ]);

  const meta = paginationMeta(total, page, limit);
  await setCache(cacheKey, { data: projects, meta }, CACHE_TTL);
  return successResponse(res, 200, "Projects fetched", projects, meta);
};

// ─── GET /api/projects/:id ──────────────────────────────────────────────────
const getById = async (req, res, next) => {
  const { id } = req.params;
  const isSlug = !id.match(/^[0-9a-fA-F]{24}$/);

  const cacheKey = `${CACHE_KEY}:single:${id}`;
  const cached = await getCache(cacheKey);
  if (cached) return successResponse(res, 200, "Project fetched (cached)", cached);

  const query = isSlug ? { slug: id } : { _id: id };
  const project = await Project.findOne(query).lean();
  if (!project) return next(createError(404, "Project not found"));

  // Increment view count asynchronously
  Project.findByIdAndUpdate(project._id, { $inc: { views: 1 } }).exec();
  // Track analytics
  Analytics.create({
    event: "page_view",
    page: `/projects/${project.slug}`,
    referenceId: project._id,
    referenceModel: "Project",
    ip: req.ip,
    userAgent: req.get("user-agent"),
    referrer: req.get("referer") || null,
  }).catch(() => {});

  await setCache(cacheKey, project, CACHE_TTL);
  return successResponse(res, 200, "Project fetched", project);
};

// ─── POST /api/projects ─────────────────────────────────────────────────────
const create = async (req, res) => {
  const project = await Project.create(req.body);
  await deleteCachePattern(`${CACHE_KEY}:*`);
  return successResponse(res, 201, "Project created", project);
};

// ─── PUT /api/projects/:id ──────────────────────────────────────────────────
const update = async (req, res, next) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) return next(createError(404, "Project not found"));

  await deleteCachePattern(`${CACHE_KEY}:*`);
  return successResponse(res, 200, "Project updated", project);
};

// ─── DELETE /api/projects/:id ───────────────────────────────────────────────
const remove = async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return next(createError(404, "Project not found"));

  await deleteCachePattern(`${CACHE_KEY}:*`);
  return successResponse(res, 200, "Project deleted");
};

// ─── POST /api/projects/:id/click ───────────────────────────────────────────
const trackClick = async (req, res, next) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { $inc: { clicks: 1 } },
    { new: true }
  );
  if (!project) return next(createError(404, "Project not found"));

  Analytics.create({
    event: "project_click",
    page: `/projects/${project.slug}`,
    referenceId: project._id,
    referenceModel: "Project",
    ip: req.ip,
    userAgent: req.get("user-agent"),
  }).catch(() => {});

  await deleteCachePattern(`${CACHE_KEY}:single:${req.params.id}`);
  return successResponse(res, 200, "Click tracked");
};

module.exports = { getAll, getById, create, update, remove, trackClick };
