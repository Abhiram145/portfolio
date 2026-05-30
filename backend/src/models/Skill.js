/**
 * Skill Model - Technical skills grouped by category
 */
const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
      maxlength: [100, "Skill name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Languages",
        "Frontend",
        "Backend",
        "Database",
        "DevOps",
        "Cloud",
        "Tools",
        "Other",
      ],
      default: "Other",
    },
    proficiency: {
      type: Number,
      min: [1, "Proficiency must be at least 1"],
      max: [100, "Proficiency cannot exceed 100"],
      default: 80,
    },
    icon: {
      type: String,
      default: null, // icon name (e.g. 'react', 'nodejs') or URL
    },
    color: {
      type: String,
      default: null, // hex color for the skill badge
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
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

skillSchema.index({ category: 1, order: 1 });
skillSchema.index({ isPublished: 1 });

const Skill = mongoose.model("Skill", skillSchema);
module.exports = Skill;
