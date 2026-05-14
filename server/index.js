const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const patientsRoutes = require("./routes/patients.routes");
const usersRoutes = require("./routes/users.routes");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL Connected");
  }
});

// Make db available to routes
app.locals.db = db;

app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use(patientsRoutes);
app.use(usersRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).json({ message: "Internal Server Error" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});


