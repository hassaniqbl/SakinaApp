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
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      PatientProfile: {
        type: "object",
        required: ["patient_id", "first_name"],
        properties: {
          patient_id: { type: "string", example: "REG-TEST-001" },
          first_name: { type: "string", example: "Ali" },
          last_name: { type: "string", example: "Raza" },
          gender: { type: "string" },
          date_of_birth: { type: "string" },
          blood_group: { type: "string" },
          phone: { type: "string" },
          email: { type: "string" },
          address: { type: "string" },
          city: { type: "string" },
          emergency_contact_name: { type: "string" },
          emergency_contact_phone: { type: "string" },
          allergies: { type: "string" },
          medical_history: { type: "string" },
          profile_image: { type: "string" },
          status: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
          created_by_latitude: { type: "number" },
          created_by_longitude: { type: "number" },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

// Build a cross-platform glob that uses forward slashes so swagger-jsdoc can find files on Windows
const routesPath = path.resolve(__dirname, "routes").replace(/\\/g, "/");
const apiGlob = `${routesPath}/**/*.routes.js`;

const options = {
  definition: swaggerDefinition,
  apis: [apiGlob],
  failOnErrors: true,
};

module.exports = swaggerJsdoc(options);

