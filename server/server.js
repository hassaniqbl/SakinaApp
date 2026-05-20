const app = require("./app");
require("dotenv").config();

const { createDbConnection } = require("./config/db");

const PORT = process.env.PORT || 5000;

const db = createDbConnection();

app.locals.db = db;

// Attempt a single connection check using async/await with the promise pool
// Check DB connectivity using callback-style getConnection on non-promise pool
db.getConnection((err, conn) => {
  if (err) {
    console.error("MySQL connection error:", err);
  } else {
    if (conn && typeof conn.release === "function") conn.release();
    console.log("MySQL Connected");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

