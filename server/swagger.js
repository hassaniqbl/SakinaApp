const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "SakinaCare API",
    version: "1.0.0",
    description: "API documentation for SakinaCare backend",
  },
  servers: [{ url: "http://localhost:5000" }],
  components: {
    // Removed bearerAuth scheme for testing (prevents Swagger UI “Authorize” button)
    // securitySchemes: {
    //   bearerAuth: {
    //     type: "http",
    //     scheme: "bearer",
    //     bearerFormat: "JWT",
    //   },
    // },
    schemas: {
      PatientProfile: {
        type: "object",
        // Required fields for POST /patients (per controller validation)
        required: ["PATIENT_NAME", "CNIC_NUMBER", "PHONE_NUMBER", "AGE", "DATA_SOURCE"],
        properties: {
          PATIENT_ID: { type: "integer", example: 1 },
          PATIENT_NAME: { type: "string", example: "Ali" },
          CNIC_NUMBER: { type: "string", example: "35202-1234567-1" },
          PHONE_NUMBER: { type: "string", example: "03111222333" },
          AGE: { type: "string", example: "45" },
          DATA_SOURCE: { type: "string", example: "WEB" },
          LOCATION_ID: { type: "integer", example: 1 },
          IS_DELETED: { type: "boolean", example: false },
          ADDED_BY: { type: "integer", example: 1 },
          UPDATED_BY: { type: "integer", example: 1 },
          DATE_CREATED: { type: "string", format: "date-time" },
          DATE_UPDATED: { type: "string", format: "date-time" },
        },
      },
    },
  },
  // security: [{ bearerAuth: [] }],
};


// Build a cross-platform glob that uses forward slashes so swagger-jsdoc can find files on Windows
const routesPath = path.resolve(__dirname, "routes").replace(/\\/g, "/");
const apiGlob = `${routesPath}/**/*.routes.js`;

// Also scan module-level routes (where some @swagger JSDoc blocks live)
const modulesRoutesGlob = `${path.resolve(__dirname, "modules")}/**/*.routes.js`.replace(/\\/g, "/");

const options = {
  definition: swaggerDefinition,
  apis: [apiGlob, modulesRoutesGlob],
  failOnErrors: true,
};

module.exports = swaggerJsdoc(options);


