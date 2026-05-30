/**
 * Blog Controller — Full CRUD with view tracking and caching
 */
const Blog = require("../models/Blog");
const Analytics = require("../models/Analytics");
const { successResponse, parsePagination, paginationMeta, createError } = require("../utils/helpers");
const { getCache, setCache, deleteCachePattern } = require("../config/redis");

const CACHE_KEY = "blogs";
const CACHE_TTL = 300;

// ─── GET /api/blogs ─────────────────────────────────────────────────────────
const getAll = async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const isAdmin = req.user?.role === "admin";
  const { tag, category, featured, status } = req.query;

  const cacheKey = `${CACHE_KEY}:${page}:${limit}:${isAdmin}:${tag}:${category}:${featured}:${status}`;
  const cached = await getCache(cacheKey);
  if (cached) return successResponse(res, 200, "Blogs fetched (cached)", cached.data, cached.meta);

  const filter = isAdmin ? {} : { status: "published" };
  if (tag) filter.tags = tag;
  if (category) filter.category = category;
  if (featured !== undefined) filter.featured = featured === "true";
  if (isAdmin && status) filter.status = status;

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .select("-content") // Omit content from list view for performance
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments(filter),
  ]);

  const meta = paginationMeta(total, page, limit);
  await setCache(cacheKey, { data: blogs, meta }, CACHE_TTL);
  return successResponse(res, 200, "Blogs fetched", blogs, meta);
};

// ─── GET /api/blogs/:slug ───────────────────────────────────────────────────
const getBySlug = async (req, res, next) => {
  const { slug } = req.params;
  const cacheKey = `${CACHE_KEY}:single:${slug}`;
  const cached = await getCache(cacheKey);
  if (cached) return successResponse(res, 200, "Blog fetched (cached)", cached);

  const blog = await Blog.findOne({ slug }).lean();
  if (!blog) return next(createError(404, "Blog post not found"));

  // Increment view count async
  Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).exec();
  Analytics.create({
    event: "blog_view",
    page: `/blog/${blog.slug}`,
    referenceId: blog._id,
    referenceModel: "Blog",
    ip: req.ip,
    userAgent: req.get("user-agent"),
    referrer: req.get("referer") || null,
  }).catch(() => {});

  await setCache(cacheKey, blog, CACHE_TTL);
  return successResponse(res, 200, "Blog fetched", blog);
};

// ─── GET /api/blogs/:id (by ID for admin) ───────────────────────────────────
const getById = async (req, res, next) => {
  const blog = await Blog.findById(req.params.id).lean();
  if (!blog) return next(createError(404, "Blog post not found"));
  return successResponse(res, 200, "Blog fetched", blog);
};

// ─── POST /api/blogs ────────────────────────────────────────────────────────
const create = async (req, res) => {
  const blog = await Blog.create(req.body);
  await deleteCachePattern(`${CACHE_KEY}:*`);
  return successResponse(res, 201, "Blog created", blog);
};

// ─── PUT /api/blogs/:id ─────────────────────────────────────────────────────
const update = async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!blog) return next(createError(404, "Blog post not found"));

  await deleteCachePattern(`${CACHE_KEY}:*`);
  return successResponse(res, 200, "Blog updated", blog);
};

// ─── DELETE /api/blogs/:id ──────────────────────────────────────────────────
const remove = async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return next(createError(404, "Blog post not found"));

  await deleteCachePattern(`${CACHE_KEY}:*`);
  return successResponse(res, 200, "Blog deleted");
};

module.exports = { getAll, getBySlug, getById, create, update, remove };
