/**
 * Joi validation schemas for Blog routes
 */
const Joi = require("joi");

const blogSchema = Joi.object({
  title: Joi.string().max(300).required(),
  excerpt: Joi.string().max(500).required(),
  content: Joi.string().required(),
  coverImage: Joi.string().allow("", null).optional(),
  tags: Joi.array().items(Joi.string()).default([]),
  category: Joi.string().max(100).default("General"),
  status: Joi.string().valid("draft", "published", "archived").default("draft"),
  featured: Joi.boolean().default(false),
  seo: Joi.object({
    metaTitle: Joi.string().max(70).allow("", null).optional(),
    metaDescription: Joi.string().max(160).allow("", null).optional(),
    keywords: Joi.array().items(Joi.string()).default([]),
  }).optional(),
});

const updateBlogSchema = blogSchema.fork(
  ["title", "excerpt", "content"],
  (f) => f.optional()
);

module.exports = { blogSchema, updateBlogSchema };
