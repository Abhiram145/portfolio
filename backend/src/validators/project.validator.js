/**
 * Joi validation schemas for Project routes
 */
const Joi = require("joi");

const projectSchema = Joi.object({
  title: Joi.string().max(200).required(),
  shortDescription: Joi.string().max(300).required(),
  description: Joi.string().required(),
  coverImage: Joi.string().allow("", null).optional(),
  images: Joi.array().items(Joi.string()).default([]),
  technologies: Joi.array().items(Joi.string()).min(1).required(),
  category: Joi.string()
    .valid("Web", "Mobile", "AI/ML", "DevOps", "API", "Open Source", "Other")
    .default("Web"),
  githubUrl: Joi.string().uri().allow("", null).optional(),
  liveUrl: Joi.string().uri().allow("", null).optional(),
  featured: Joi.boolean().default(false),
  status: Joi.string().valid("draft", "published", "archived").default("published"),
  startDate: Joi.date().allow(null).optional(),
  endDate: Joi.date().allow(null).optional(),
  order: Joi.number().integer().min(0).default(0),
});

const updateProjectSchema = projectSchema.fork(
  ["title", "shortDescription", "description", "technologies"],
  (f) => f.optional()
);

module.exports = { projectSchema, updateProjectSchema };
