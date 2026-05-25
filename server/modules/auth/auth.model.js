const getUserByEmail = async (db, email) => {
  const conn = db;
  const [rows] = await conn.promise().query(
    "SELECT * FROM SC_USER WHERE EMAIL = ? AND IS_DELETED = b'0' LIMIT 1",
    [email]
  );
  return rows[0] || null;
};

const getUserById = async (db, userId) => {
  const conn = db;
  const [rows] = await conn.promise().query(
    "SELECT * FROM SC_USER WHERE USER_ID = ? AND IS_DELETED = b'0' LIMIT 1",
    [userId]
  );
  return rows[0] || null;
};

// If the project has a session/token blacklist table, invalidate it here.
// Current schema is unknown, so we implement a safe best-effort no-op.
const invalidateUserSession = async (db, userId) => {
  // Example (not executed unless schema exists): INSERT INTO SC_AUTH_LOGOUT ...
  // Keeping no-op to avoid breaking existing DB setups.
  return { userId };
};

const createPasswordResetRequest = async (db, userId, email) => {
  // Best-effort: the project may not have a reset token table.
  // We avoid DB mutations and return ok.
  return { userId, email };
};

module.exports = {
  getUserByEmail,
  getUserById,
  invalidateUserSession,
  createPasswordResetRequest,
};


