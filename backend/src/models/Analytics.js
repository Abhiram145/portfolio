/**
 * Analytics Model - Page visits, project clicks, and general traffic data
 */
const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    event: {
      type: String,
      required: true,
      enum: ["page_view", "project_click", "blog_view", "contact_submit", "resume_download"],
    },
    page: {
      type: String,
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null, // optional: links to a project or blog doc
    },
    referenceModel: {
      type: String,
      enum: ["Project", "Blog", null],
      default: null,
    },
    ip: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    referrer: {
      type: String,
      default: null,
    },
    sessionId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

analyticsSchema.index({ event: 1, createdAt: -1 });
analyticsSchema.index({ page: 1, createdAt: -1 });
analyticsSchema.index({ referenceId: 1 });

const Analytics = mongoose.model("Analytics", analyticsSchema);
module.exports = Analytics;
