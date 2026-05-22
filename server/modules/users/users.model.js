const { HttpError } = require("../../utils/httpError");

const buildUserSelect = (extra = "") => {
  return `SELECT
    u.USER_ID,
    u.ACCOUNT_GUID,
    u.EMAIL_ADDRESS,
    u.PASS,
    u.ROLE_ID,
    r.ITEM_NAME AS ROLE_NAME,
    u.LOCATION_ID,
    l.ITEM_NAME AS LOCATION_NAME,
    u.FIRST_NAME,
    u.LAST_NAME,
    u.PHONE_NUMBER,
    u.ADDRESS_LINE1,
    u.ADDRESS_LINE2,
    u.PROFILE_PICTURE_URL,
    u.IS_ACTIVE,
    u.IS_DELETED,
    u.ADDED_BY,
    u.UPDATED_BY,
    u.DATE_CREATED,
    u.DATE_UPDATED
  ${extra}`;
};

const insertUser = async (db, payload) => {
  const sql = `
    INSERT INTO ADM_USER (
      ACCOUNT_GUID,
      EMAIL_ADDRESS,
      PASS,
      ROLE_ID,
      LOCATION_ID,
      FIRST_NAME,
      LAST_NAME,
      PHONE_NUMBER,
      ADDRESS_LINE1,
      ADDRESS_LINE2,
      PROFILE_PICTURE_URL,
      IS_ACTIVE,
      IS_DELETED,
      ADDED_BY,
      UPDATED_BY,
      DATE_CREATED,
      DATE_UPDATED
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, b'0', ?, ?, NOW(), NOW())
  `;

  const params = [
    payload.ACCOUNT_GUID ?? null,
    payload.EMAIL_ADDRESS,
    payload.PASS,
    payload.ROLE_ID ?? null,
    payload.LOCATION_ID ?? null,
    payload.FIRST_NAME ?? null,
    payload.LAST_NAME ?? null,
    payload.PHONE_NUMBER ?? null,
    payload.ADDRESS_LINE1 ?? null,
    payload.ADDRESS_LINE2 ?? null,
    payload.PROFILE_PICTURE_URL ?? null,
    payload.IS_ACTIVE === undefined || payload.IS_ACTIVE === null ? 1 : payload.IS_ACTIVE ? 1 : 0,
    payload.ADDED_BY ?? null,
    payload.UPDATED_BY ?? null,
  ];

  const [result] = await db.promise().execute(sql, params);
  return result;
};

const getAllUsers = async (
  db,
  { page, limit, offset },
  { searchClause, searchParams, filterClause, filterParams },
  { sortBy, sortOrder }
) => {
  const whereParts = ["u.IS_DELETED = b'0'"]
    .concat(filterClause ? [filterClause] : [])
    .concat(searchClause ? [searchClause] : []);

  const where = whereParts.filter(Boolean).join(" AND ");

  const orderByColumn = sortBy && sortBy !== "undefined" ? String(sortBy) : "DATE_CREATED";
  const orderByDir = sortOrder === "ASC" ? "ASC" : "DESC";

  const finalSelect = `
    SELECT
      u.USER_ID,
      u.ACCOUNT_GUID,
      u.EMAIL_ADDRESS,
      u.ROLE_ID,
      r.ITEM_NAME AS ROLE_NAME,
      u.LOCATION_ID,
      l.ITEM_NAME AS LOCATION_NAME,
      u.FIRST_NAME,
      u.LAST_NAME,
      u.PHONE_NUMBER,
      u.ADDRESS_LINE1,
      u.ADDRESS_LINE2,
      u.PROFILE_PICTURE_URL,
      u.IS_ACTIVE,
      u.IS_DELETED,
      u.ADDED_BY,
      u.UPDATED_BY,
      u.DATE_CREATED,
      u.DATE_UPDATED
    FROM ADM_USER u
    LEFT JOIN ADM_CODE_ITEM r ON r.CODE_ITEM_ID = u.ROLE_ID AND r.IS_DELETED = b'0'
    LEFT JOIN ADM_CODE_ITEM l ON l.CODE_ITEM_ID = u.LOCATION_ID AND l.IS_DELETED = b'0'
    WHERE ${where}
    ORDER BY u.${orderByColumn} ${orderByDir}
    LIMIT ? OFFSET ?
  `;

  const commonParams = [...(filterParams || []), ...(searchParams || [])];
  const rowsParams = [...commonParams, limit, offset];

  const [rows] = await db.promise().query(finalSelect, rowsParams);

  const [countRows] = await db
    .promise()
    .query(`SELECT COUNT(*) as total FROM ADM_USER u WHERE ${where}`, commonParams);

  const total = countRows?.[0]?.total || 0;
  return { rows, total };
};

const getUserById = async (db, id) => {
  const selectFrom = `
    FROM ADM_USER u
    LEFT JOIN ADM_CODE_ITEM r ON r.CODE_ITEM_ID = u.ROLE_ID AND r.IS_DELETED = b'0'
    LEFT JOIN ADM_CODE_ITEM l ON l.CODE_ITEM_ID = u.LOCATION_ID AND l.IS_DELETED = b'0'
  `;
  const [rows] = await db
    .promise()
    .query(`${buildUserSelect(selectFrom)} WHERE u.USER_ID = ? AND u.IS_DELETED = b'0'`, [id]);
  return rows[0] || null;
};

const updateUser = async (db, id, payload) => {
  const sql = `
    UPDATE ADM_USER
    SET
      EMAIL_ADDRESS = ?,
      PASS = ?,
      ROLE_ID = ?,
      LOCATION_ID = ?,
      FIRST_NAME = ?,
      LAST_NAME = ?,
      PHONE_NUMBER = ?,
      ADDRESS_LINE1 = ?,
      ADDRESS_LINE2 = ?,
      PROFILE_PICTURE_URL = ?,
      IS_ACTIVE = ?,
      UPDATED_BY = ?,
      DATE_UPDATED = NOW()
    WHERE USER_ID = ? AND IS_DELETED = b'0'
  `;

  const params = [
    payload.EMAIL_ADDRESS ?? null,
    payload.PASS ?? null,
    payload.ROLE_ID ?? null,
    payload.LOCATION_ID ?? null,
    payload.FIRST_NAME ?? null,
    payload.LAST_NAME ?? null,
    payload.PHONE_NUMBER ?? null,
    payload.ADDRESS_LINE1 ?? null,
    payload.ADDRESS_LINE2 ?? null,
    payload.PROFILE_PICTURE_URL ?? null,
    payload.IS_ACTIVE === undefined || payload.IS_ACTIVE === null ? 1 : payload.IS_ACTIVE ? 1 : 0,
    payload.UPDATED_BY ?? null,
    id,
  ];

  const [result] = await db.promise().execute(sql, params);
  return result;
};

const softDeleteUser = async (db, id, updatedBy) => {
  const [result] = await db
    .promise()
    .execute(
      `UPDATE ADM_USER SET IS_DELETED = b'1', UPDATED_BY = ?, DATE_UPDATED = NOW() WHERE USER_ID = ? AND IS_DELETED = b'0'`,
      [updatedBy ?? null, id]
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

