const { body, param } = require("express-validator");

// Validation rules based on SC_SIX_WEEK_POSTNATAL_CHECKUP schema

const validateCreateSixWeekCheckup = [
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

  body("BREAST_FEEDING_DURATION")
    .exists()
    .withMessage("BREAST_FEEDING_DURATION is required")
    .isInt({ min: 0 })
    .withMessage("BREAST_FEEDING_DURATION must be a non-negative integer"),

  body("IS_BABY_CORD_HEALTHY")
    .exists()
    .withMessage("IS_BABY_CORD_HEALTHY is required")
    .isBoolean()
    .withMessage("IS_BABY_CORD_HEALTHY must be boolean"),

  body("BABY_CORD_CONDITION_MORE_DETAILS")
    .exists()
    .withMessage("BABY_CORD_CONDITION_MORE_DETAILS is required")
    .isString()
    .isLength({ max: 8000 })
    .withMessage("BABY_CORD_CONDITION_MORE_DETAILS max length is 8000"),

  body("FOLLOWUP_DATE")
    .exists()
    .withMessage("FOLLOWUP_DATE is required")
    .isISO8601()
    .withMessage("FOLLOWUP_DATE must be a valid ISO datetime"),

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

  // UPDATED_BY / ADDED_BY come from auth (req.user). We do not require them in body.
];

const validateUpdateSixWeekCheckup = [
  param("id")
    .exists()
    .withMessage("id is required")
    .isInt({ min: 1 })
    .withMessage("id must be a positive integer"),

  // All fields are required for this API (matches current controller behavior)
  ...validateCreateSixWeekCheckup,
];

module.exports = { validateCreateSixWeekCheckup, validateUpdateSixWeekCheckup };

