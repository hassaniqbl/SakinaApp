const { HttpError } = require("../../utils/httpError");

const buildUserSelect = (extra = "") => {
  return `SELECT USER_ID, IS_DELETED, ADDED_BY, UPDATED_BY, DATE_CREATED, DATE_UPDATED, 
    EMAIL, USER_ROLE, LOCATION_ID, FIRSTNAME, LASTNAME, CONTACT, ADDRESS, PROFILE_PICTURE_URL ${extra}`;
};

const insertUser = async (db, payload) => {
  const sql = `INSERT INTO SC_USER (
    IS_DELETED, ADDED_BY, UPDATED_BY,
    EMAIL, PASS, USER_ROLE, LOCATION_ID,
    FIRSTNAME, LASTNAME, CONTACT, ADDRESS, PROFILE_PICTURE_URL,
    DATE_CREATED, DATE_UPDATED
  ) VALUES (
    b'0', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , NOW(), NOW()
  )`;

  const params = [
    payload.ADDED_BY || null,
    payload.UPDATED_BY || null,
    payload.EMAIL,
    payload.PASS,
    payload.USER_ROLE || null,
    payload.LOCATION_ID || null,
    payload.FIRSTNAME || null,
    payload.LASTNAME || null,
    payload.CONTACT || null,
    payload.ADDRESS || null,
    payload.PROFILE_PICTURE_URL || null,
  ];

  const [result] = await db.promise().execute(sql, params);
  return result;
};

const getAllUsers = async (db, { page, limit, offset }, { searchClause, searchParams, filterClause, filterParams }, { sortBy, sortOrder }) => {
  const where = ["u.IS_DELETED = b'0'"]
    .concat(filterClause ? [filterClause] : [])
    .concat(searchClause ? [searchClause] : [])
    .filter(Boolean)
    .join(" AND ");

  const sql = `SELECT SQL_CALC_FOUND_ROWS ${buildUserSelect("FROM SC_USER u")} 
    ${filterClause || searchClause ? "" : ""}
  `;

  const base = `FROM SC_USER u`;
  const finalSelect = `SELECT u.USER_ID, u.IS_DELETED, u.ADDED_BY, u.UPDATED_BY, u.DATE_CREATED, u.DATE_UPDATED,
    u.EMAIL, u.USER_ROLE, u.LOCATION_ID, u.FIRSTNAME, u.LASTNAME, u.CONTACT, u.ADDRESS, u.PROFILE_PICTURE_URL
    ${base}
    WHERE ${where}
    ORDER BY u.${sortBy} ${sortOrder}
    LIMIT ? OFFSET ?`;

  const params = [...filterParams, ...searchParams, limit, offset];
  const [rows] = await db.promise().query(finalSelect, params);
  const [countRows] = await db
    .promise()
    .query(`SELECT COUNT(*) as total FROM SC_USER u WHERE ${where}`, [...filterParams, ...searchParams]);

  const total = countRows[0]?.total || 0;
  return { rows, total };
};

const getUserById = async (db, id) => {
  const [rows] = await db
    .promise()
    .query(`${buildUserSelect("FROM SC_USER")}
      WHERE USER_ID = ? AND IS_DELETED = b'0'`, [id]);
  return rows[0] || null;
};

const updateUser = async (db, id, payload) => {
  const sql = `UPDATE SC_USER SET
    UPDATED_BY = ?,
    EMAIL = ?,
    USER_ROLE = ?,
    LOCATION_ID = ?,
    FIRSTNAME = ?,
    LASTNAME = ?,
    CONTACT = ?,
    ADDRESS = ?,
    PROFILE_PICTURE_URL = ?
  WHERE USER_ID = ? AND IS_DELETED = b'0'`;

  const params = [
    payload.UPDATED_BY || null,
    payload.EMAIL,
    payload.USER_ROLE || null,
    payload.LOCATION_ID || null,
    payload.FIRSTNAME || null,
    payload.LASTNAME || null,
    payload.CONTACT || null,
    payload.ADDRESS || null,
    payload.PROFILE_PICTURE_URL || null,
    id,
  ];

  const [result] = await db.promise().execute(sql, params);
  return result;
};

const softDeleteUser = async (db, id, updatedBy) => {
  const [result] = await db
    .promise()
    .execute(
      `UPDATE SC_USER SET IS_DELETED = b'1', UPDATED_BY = ? WHERE USER_ID = ? AND IS_DELETED = b'0'`,
      [updatedBy || null, id]
    );
  return result;
};

module.exports = {
  insertUser,
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUser,
};

