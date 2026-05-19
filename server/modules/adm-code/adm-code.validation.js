const { body, param, query } = require("express-validator");

const validateCreateAdmCode = [
  body("code_name").exists().withMessage("code_name is required").isString().isLength({ max: 255 }),
  body("code_description").optional().isString().isLength({ max: 500 }),
  body("added_by").optional().isInt().withMessage("added_by must be an integer"),
];

const validateUpdateAdmCode = [
  param("id").exists().isInt().withMessage("id must be an integer"),
  body("code_name").exists().withMessage("code_name is required").isString().isLength({ max: 255 }),
  body("code_description").optional().isString().isLength({ max: 500 }),
  body("updated_by").optional().isInt().withMessage("updated_by must be an integer"),
];

const validateIdParam = [param("id").exists().isInt().withMessage("id must be an integer")];

const validateListQuery = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("search").optional().isString(),
  query("sortBy").optional().isString(),
  query("sortOrder").optional().isIn(["ASC", "DESC", "asc", "desc"]).withMessage("sortOrder must be ASC or DESC"),
];

const validateByName = [param("codeName").exists().isString().withMessage("codeName is required")];

module.exports = {
  validateCreateAdmCode,
  validateUpdateAdmCode,
  validateIdParam,
  validateListQuery,
  validateByName,
};

