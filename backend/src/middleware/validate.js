/**
 * Request validation middleware factory using Joi
 * Usage: validate(schema) — validates req.body
 */
const { createError } = require("../utils/helpers");

const validate = (schema, target = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      console.error("Validation Error Details:", JSON.stringify(error.details, null, 2));
      const errors = error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message.replace(/['"]/g, ""),
      }));
      return next(
        Object.assign(createError(400, "Validation failed"), { errors })
      );
    }

    req[target] = value; // replace with sanitized value
    next();
  };
};

module.exports = validate;
