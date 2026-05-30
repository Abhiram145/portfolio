/**
 * Analytics Controller — Dashboard metrics and event tracking
 */
const Analytics = require("../models/Analytics");
const Project = require("../models/Project");
const Blog = require("../models/Blog");
const { successResponse } = require("../utils/helpers");

// ─── POST /api/analytics/track ──────────────────────────────────────────────
const trackEvent = async (req, res) => {
  const { event, page, referenceId, referenceModel, sessionId } = req.body;

  await Analytics.create({
    event,
    page,
    referenceId: referenceId || null,
    referenceModel: referenceModel || null,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    referrer: req.get("referer") || null,
    sessionId: sessionId || null,
  });

  return successResponse(res, 201, "Event tracked");
};

// ─── GET /api/analytics/dashboard ───────────────────────────────────────────
const getDashboard = async (req, res) => {
  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalViews,
    viewsLast30Days,
    topProjects,
    topBlogs,
    eventBreakdown,
    dailyViews,
  ] = await Promise.all([
    Analytics.countDocuments({ event: "page_view" }),
    Analytics.countDocuments({ event: "page_view", createdAt: { $gte: last30Days } }),
    Project.find().sort({ views: -1 }).limit(5).select("title slug views clicks").lean(),
    Blog.find().sort({ views: -1 }).limit(5).select("title slug views").lean(),
    Analytics.aggregate([
      { $group: { _id: "$event", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Analytics.aggregate([
      { $match: { event: "page_view", createdAt: { $gte: last30Days } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return successResponse(res, 200, "Dashboard analytics", {
    totalViews,
    viewsLast30Days,
    topProjects,
    topBlogs,
    eventBreakdown,
    dailyViews,
  });
};

module.exports = { trackEvent, getDashboard };
