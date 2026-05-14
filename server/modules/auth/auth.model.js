const getUserByEmail = async (db, email) => {
  const conn = db;
  const [rows] = await conn.promise().query(
    "SELECT * FROM SC_USER WHERE EMAIL = ? AND IS_DELETED = b'0' LIMIT 1",
    [email]
  );
  return rows[0] || null;
};

module.exports = { getUserByEmail };

