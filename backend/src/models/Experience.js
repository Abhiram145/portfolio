/**
 * Experience Model - Work history and career timeline
 */
const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [150, "Company name cannot exceed 150 characters"],
    },
    companyWebsite: {
      type: String,
      default: null,
    },
    companyLogo: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Freelance", "Internship"],
      default: "Full-time",
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      default: null, // null = current job
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: "",
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    highlights: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: duration string
experienceSchema.virtual("duration").get(function () {
  const start = this.startDate;
  const end = this.isCurrent ? new Date() : this.endDate;
  if (!start || !end) return "";
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  let duration = "";
  if (years > 0) duration += `${years}y `;
  if (remainingMonths > 0) duration += `${remainingMonths}mo`;
  return duration.trim();
});

experienceSchema.index({ order: 1 });
experienceSchema.index({ isPublished: 1 });

const Experience = mongoose.model("Experience", experienceSchema);
module.exports = Experience;
