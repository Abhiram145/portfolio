/**
 * Joi validation schemas for Skill routes
 */
const Joi = require("joi");

const skillSchema = Joi.object({
  name: Joi.string().max(100).required(),
  category: Joi.string()
    .valid("Languages", "Frontend", "Backend", "Database", "DevOps", "Cloud", "Tools", "Other")
    .required(),
  proficiency: Joi.number().integer().min(1).max(100).default(80),
  icon: Joi.string().allow("", null).optional(),
  color: Joi.string().allow("", null).optional(),
  yearsOfExperience: Joi.number().min(0).default(0),
  order: Joi.number().integer().min(0).default(0),
  isPublished: Joi.boolean().default(true),
});

const updateSkillSchema = skillSchema.fork(["name", "category"], (f) => f.optional());

module.exports = { skillSchema, updateSkillSchema };
