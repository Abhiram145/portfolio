/**
 * Project Model - Portfolio projects with rich metadata
 */
const mongoose = require("mongoose");
const slugify = require("slugify");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      maxlength: [300, "Short description cannot exceed 300 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [10000, "Description cannot exceed 10000 characters"],
    },
    coverImage: {
      type: String,
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
      required: [true, "Technologies are required"],
    },
    category: {
      type: String,
      enum: ["Web", "Mobile", "AI/ML", "DevOps", "API", "Open Source", "Other"],
      default: "Web",
    },
    githubUrl: {
      type: String,
      default: null,
    },
    liveUrl: {
      type: String,
      default: null,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Auto-generate slug before save ────────────────────────────────────────
projectSchema.pre("save", async function (next) {
  if (this.isModified("title") || this.isNew) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Ensure uniqueness
    while (await mongoose.model("Project").findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter++}`;
    }
    this.slug = slug;
  }
  next();
});

projectSchema.index({ status: 1, featured: 1, order: 1 });
projectSchema.index({ category: 1 });

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
