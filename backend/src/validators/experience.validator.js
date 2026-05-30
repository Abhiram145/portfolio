/**
 * Joi validation schemas for Experience routes
 */
const Joi = require("joi");

const experienceSchema = Joi.object({
  title: Joi.string().max(150).required(),
  company: Joi.string().max(150).required(),
  companyWebsite: Joi.string().uri().allow("", null).optional(),
  companyLogo: Joi.string().allow("", null).optional(),
  location: Joi.string().max(200).allow("", null).optional(),
  employmentType: Joi.string()
    .valid("Full-time", "Part-time", "Contract", "Freelance", "Internship")
    .default("Full-time"),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref("startDate")).allow(null).optional(),
  isCurrent: Joi.boolean().default(false),
  description: Joi.string().max(5000).allow("", null).optional(),
  highlights: Joi.array().items(Joi.string()).default([]),
  technologies: Joi.array().items(Joi.string()).default([]),
  order: Joi.number().integer().min(0).default(0),
  isPublished: Joi.boolean().default(true),
});

const updateExperienceSchema = experienceSchema.fork(
  ["title", "company", "startDate", "description"],
  (f) => f.optional()
);

module.exports = { experienceSchema, updateExperienceSchema };
