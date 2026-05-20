const { body, param } = require("express-validator");

// Validation rules based on SC_ANNUAL_POSTNATAL_CHECKUP schema

const validateCreateAnnualCheckup = [
  body("DELIVERY_ID")
    .exists()
    .withMessage("DELIVERY_ID is required")
    .isInt({ min: 1 })
    .withMessage("DELIVERY_ID must be a positive integer"),

  body("IS_PATIENT_ALIVE")
    .exists()
    .withMessage("IS_PATIENT_ALIVE is required")
    .isBoolean()
    .withMessage("IS_PATIENT_ALIVE must be boolean"),

  body("PATIENT_DEATH_REASON")
    .exists()
    .withMessage("PATIENT_DEATH_REASON is required")
    .isString()
    .isLength({ max: 255 })
    .withMessage("PATIENT_DEATH_REASON max length is 255"),

  body("IS_PATIENT_HEALTHY")
    .exists()
    .withMessage("IS_PATIENT_HEALTHY is required")
    .isBoolean()
    .withMessage("IS_PATIENT_HEALTHY must be boolean"),

  body("PATIENT_HEALTH_MORE_DETAILS")
    .exists()
    .withMessage("PATIENT_HEALTH_MORE_DETAILS is required")
    .isString()
    .isLength({ max: 8000 })
    .withMessage("PATIENT_HEALTH_MORE_DETAILS max length is 8000"),

  body("IS_BABY_ALIVE")
    .exists()
    .withMessage("IS_BABY_ALIVE is required")
    .isBoolean()
    .withMessage("IS_BABY_ALIVE must be boolean"),

  body("BABY_DEATH_REASON")
    .exists()
    .withMessage("BABY_DEATH_REASON is required")
    .isString()
    .isLength({ max: 8000 })
    .withMessage("BABY_DEATH_REASON max length is 8000"),

  body("IS_BABY_HEALTHY")
    .exists()
    .withMessage("IS_BABY_HEALTHY is required")
    .isBoolean()
    .withMessage("IS_BABY_HEALTHY must be boolean"),

  body("BABY_HEALTH_MORE_DETAILS")
    .exists()
    .withMessage("BABY_HEALTH_MORE_DETAILS is required")
    .isString()
    .isLength({ max: 8000 })
    .withMessage("BABY_HEALTH_MORE_DETAILS max length is 8000"),

  body("IS_BREAST_FEEDING")
    .exists()
    .withMessage("IS_BREAST_FEEDING is required")
    .isBoolean()
    .withMessage("IS_BREAST_FEEDING must be boolean"),

  body("BREAST_FEEDING_DURATION")
    .exists()
    .withMessage("BREAST_FEEDING_DURATION is required")
    .isInt({ min: 0 })
    .withMessage("BREAST_FEEDING_DURATION must be a non-negative integer"),

  body("BIRTH_SPACING_PRACTICES")
    .exists()
    .withMessage("BIRTH_SPACING_PRACTICES is required")
    .isInt({ min: 0 })
    .withMessage("BIRTH_SPACING_PRACTICES must be a non-negative integer"),

  body("DATA_SOURCE")
    .exists()
    .withMessage("DATA_SOURCE is required")
    .isIn(["APP", "WEB"])
    .withMessage("DATA_SOURCE must be one of: APP, WEB"),

  body("CREATED_BY_LATITUDE")
    .optional()
    .isFloat()
    .withMessage("CREATED_BY_LATITUDE must be a number"),

  body("CREATED_BY_LONGITUDE")
    .optional()
    .isFloat()
    .withMessage("CREATED_BY_LONGITUDE must be a number"),

  // ADDED_BY / UPDATED_BY come from auth (req.user).
];

const validateUpdateAnnualCheckup = [
  param("id")
    .exists()
    .withMessage("id is required")
    .isInt({ min: 1 })
    .withMessage("id must be a positive integer"),

  ...validateCreateAnnualCheckup,
];

module.exports = { validateCreateAnnualCheckup, validateUpdateAnnualCheckup };

