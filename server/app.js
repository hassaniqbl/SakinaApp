const express = require("express");
const cors = require("cors");
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const loggerMiddleware = require("./middleware/logger.middleware");
const errorHandler = require("./middleware/error.middleware");

const apiRoutes = require("./routes");

const app = express();

app.use(cors());
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

app.use(errorHandler);

module.exports = app;

