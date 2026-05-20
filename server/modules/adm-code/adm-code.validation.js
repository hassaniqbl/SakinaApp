const { body, param } = require("express-validator");

const validateCreateAdmCode = [
  body("CODE_NAME")
    .exists()
    .withMessage("CODE_NAME is required")
    .isString()
    .isLength({ max: 255 })
    .withMessage("CODE_NAME max length is 255"),

  body("CODE_DESCRIPTION")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("CODE_DESCRIPTION max length is 500"),

  body("ADDED_BY")
    .exists()
    .withMessage("ADDED_BY is required")
    .isInt()
    .withMessage("ADDED_BY must be an integer"),
];

const validateUpdateAdmCode = [
  param("id")
    .exists()
    .withMessage("id is required")
    .isInt()
    .withMessage("id must be an integer"),

  body("CODE_NAME")
    .exists()
    .withMessage("CODE_NAME is required")
    .isString()
    .isLength({ max: 255 })
    .withMessage("CODE_NAME max length is 255"),

  body("CODE_DESCRIPTION")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("CODE_DESCRIPTION max length is 500"),

  body("UPDATED_BY")
    .exists()
    .withMessage("UPDATED_BY is required")
    .isInt()
    .withMessage("UPDATED_BY must be an integer"),
];

const validateIdParam = [
  param("id")
    .exists()
    .withMessage("id is required")
    .isInt()
    .withMessage("id must be an integer"),
];

module.exports = {
  validateCreateAdmCode,
  validateUpdateAdmCode,
  validateIdParam,
};

