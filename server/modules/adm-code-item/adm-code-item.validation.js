const { body, param, query } = require("express-validator");

const validateCreateAdmCodeItem = [
  body("code_id").exists().isInt().withMessage("code_id is required and must be integer"),
  body("item_name").exists().isString().withMessage("item_name is required"),
  body("item_value").exists().isString().withMessage("item_value is required"),
  body("display_order").optional().isInt().withMessage("display_order must be integer"),
  body("added_by").optional().isInt().withMessage("added_by must be integer"),
];

const validateUpdateAdmCodeItem = [
  param("id").exists().isInt().withMessage("id must be integer"),
  body("code_id").optional().isInt().withMessage("code_id must be integer"),
  body("item_name").exists().isString().withMessage("item_name is required"),
  body("item_value").exists().isString().withMessage("item_value is required"),
  body("display_order").optional().isInt().withMessage("display_order must be integer"),
  body("updated_by").optional().isInt().withMessage("updated_by must be integer"),
];

const validateIdParam = [param("id").exists().isInt().withMessage("id must be integer")];

const validateListQuery = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("code_id").optional().isInt(),
  query("search").optional().isString(),
  query("sortBy").optional().isString(),
  query("sortOrder").optional().isIn(["ASC", "DESC", "asc", "desc"]).withMessage("sortOrder must be ASC or DESC"),
];

const validateDropdownCodeId = [param("codeId").exists().isInt().withMessage("codeId must be integer")];

module.exports = {
  validateCreateAdmCodeItem,
  validateUpdateAdmCodeItem,
  validateIdParam,
  validateListQuery,
  validateDropdownCodeId,
};

