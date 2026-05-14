const mysql = require("mysql2");

function createDbConnection() {
  // Use pool for concurrency + stable performance
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}

module.exports = { createDbConnection };


