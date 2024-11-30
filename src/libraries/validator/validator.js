const { validationResult } = require("express-validator");
const { BadRequestError } = require("../../core/ErrorResponse");

// can be reused by many routes
const validate = (validations) => {
  return async (req, _res, next) => {
    // sequential processing, stops running validations chain if one fails.
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        throw new BadRequestError({ message: "Validation failed", error: result.array() });
      }
    }

    next();
  };
};

const handleValidationErrors = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BadRequestError({ message: "Validation failed", error: errors.array() });
  }
  next();
};

module.exports = { validate, handleValidationErrors };
