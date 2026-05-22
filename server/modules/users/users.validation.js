const { validateBody } = require("../../middleware/validate");

const createSchema = {
  ACCOUNT_GUID: { type: "string" },
  EMAIL_ADDRESS: { type: "string", required: true },
  PASS: { type: "string", required: true },
  ROLE_ID: { type: "integer" },
  LOCATION_ID: { type: "integer" },
  FIRST_NAME: { type: "string" },
  LAST_NAME: { type: "string" },
  PHONE_NUMBER: { type: "string" },
  ADDRESS_LINE1: { type: "string" },
  ADDRESS_LINE2: { type: "string" },
  PROFILE_PICTURE_URL: { type: "string" },
  IS_ACTIVE: { type: "integer" },
  ADDED_BY: { type: "integer" },
};

const updateSchema = Object.fromEntries(Object.entries(createSchema).map(([k, v]) => [k, Object.assign({}, v, { required: false })]));

module.exports = {
  validateCreateUser: validateBody(createSchema),
  validateUpdateUser: validateBody(updateSchema, { skipMissing: true }),
};
