const express = require("express");
const cors = require("cors");
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const loggerMiddleware = require("./middleware/logger.middleware");
const errorHandler = require("./middleware/error.middleware");

const apiRoutes = require("./routes");

const app = express();

// CORS: use explicit options to make preflight (OPTIONS) work reliably
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., curl/postman)
    if (!origin) return callback(null, true);

    // Allow localhost dev + allow the app to be served from any port during development
    const allowed = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "http://localhost:8080",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
    ];

    if (allowed.includes(origin)) return callback(null, true);

    // If you want to lock down origins, replace the above allow-list with an env var.
    // For now, fall back to allowing the origin in dev.
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(loggerMiddleware);

app.get("/", (req, res) => res.send("Backend Running"));

// Serve the generated swagger JSON explicitly so the UI always fetches the
// up-to-date spec (prevents static asset fallback returning HTML).
app.get('/api-docs/swagger.json', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.json(swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", apiRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;

