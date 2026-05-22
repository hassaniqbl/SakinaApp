const app = require("./app");
require("dotenv").config();

const { createDbConnection } = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  const db = createDbConnection();
  app.locals.db = db;

  try {
    // With mysql2/promise pool, just ping using a lightweight query.
    await db.query("SELECT 1");
    console.log("MySQL Connected");
  } catch (err) {
    console.error("MySQL connection error:", err);
    // Fail fast so API doesn't start with an invalid DB configuration.
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}


startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
