const app = require("./app");
require("dotenv").config();

const { createDbConnection } = require("./config/db");

const PORT = process.env.PORT || 5000;

const db = createDbConnection();

app.locals.db = db;

// keep original connection behavior for compatibility


db.getConnection((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
  } else {
    console.log("MySQL Connected");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

