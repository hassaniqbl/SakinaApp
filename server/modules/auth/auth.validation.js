const { body } = require("express-validator");

const validateLogout = [
  body("USER_ID")
    .exists()
    .withMessage("USER_ID is required")
    .isInt()
    .withMessage("USER_ID must be an integer"),
];

const validateForgotPassword = [
  body("EMAIL_ADDRESS")
    .exists()
    .withMessage("EMAIL_ADDRESS is required")
    .isString()
    .withMessage("EMAIL_ADDRESS must be a string")
    .bail()
    .isEmail()
    .withMessage("EMAIL_ADDRESS must be a valid email address"),
];

module.exports = {
  validateLogout,
  validateForgotPassword,
};

