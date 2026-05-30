/**
 * Joi validation schemas for Auth routes
 */
const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required",
  }),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "any.required": "Refresh token is required",
  }),
});

module.exports = { loginSchema, refreshSchema };
