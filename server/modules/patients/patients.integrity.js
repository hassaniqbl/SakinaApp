const { HttpError } = require('../../utils/httpError');

// Verifies that the given user id exists in SC_USER (per db_setup.sql)
// so that foreign keys from SC_PATIENT.UPDATED_BY / ADDED_BY won't fail.
const assertUserExists = async (db, userId, fieldName) => {
  if (userId === undefined || userId === null || userId === "") {
    throw new HttpError(400, `${fieldName} is required`);
  }

  const n = Number(userId);
  if (!Number.isFinite(n)) {
    throw new HttpError(400, `${fieldName} must be a number`);
  }

  // SC_PATIENT.ADDED_BY / UPDATED_BY should reference an active SC_USER.
  const [rows] = await db
    .promise()
    .query(
      `SELECT USER_ID
       FROM ADM_USER
       WHERE USER_ID = ?
         AND (IS_DELETED = 0 OR IS_DELETED = b'0')`,
      [n]
    );

  if (!rows || rows.length === 0) {
    // Clean validation message (no SQL/constraint leaks)
    throw new HttpError(400, `Invalid ${fieldName} user`);
  }

  return n;
};


module.exports = {
  assertUserExists,
};

