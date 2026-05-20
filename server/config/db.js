const mysql = require("mysql2/promise");

function createDbConnection() {
  // Use promise pool so all service code can use async/await cleanly.
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Your models call db.promise().query/execute.
  // mysql2/promise already returns a pool with query/execute,
  // so we shim a promise() method for compatibility.
  pool.promise = () => pool;

  return pool;
}

module.exports = { createDbConnection };


