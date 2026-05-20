const { HttpError } = require("../../utils/httpError");

const {
  getAllAdmCodesSql,
  getAdmCodeByIdSql,
  createAdmCodeSql,
  updateAdmCodeSql,
  softDeleteAdmCodeSql,
} = require("./adm-code.query");

const normalizeBit = (val) => {
  if (val === null || val === undefined) return false;
  if (Buffer.isBuffer(val)) return val[0] === 1;
  return val === 1 || val === "1" || val === true;
};

const mapAdmCodeRow = (r) => ({
  code_id: r.CODE_ID,
  code_name: r.CODE_NAME,
  code_description: r.CODE_DESCRIPTION,
  is_deleted: normalizeBit(r.IS_DELETED),
  added_by: r.ADDED_BY,
  updated_by: r.UPDATED_BY,
  date_created: r.DATE_CREATED,
  date_updated: r.DATE_UPDATED,
});

const createAdmCodeTx = async (dbPool, payload) => {
  // For mysql2/promise pool.
  if (typeof dbPool?.getConnection !== "function") {
    throw new Error("dbPool.getConnection is not available. Expected mysql2/promise pool for transactional operations.");
  }

  let connection;
  try {
    connection = await dbPool.getConnection();

    await connection.beginTransaction();

    const insertParams = [
      payload.CODE_NAME,
      payload.CODE_DESCRIPTION ?? null,
      payload.ADDED_BY ?? null,
      payload.UPDATED_BY ?? null,
    ];

    const [result] = await connection.execute(createAdmCodeSql, insertParams);

    const [rows] = await connection.execute(getAdmCodeByIdSql, [result.insertId]);
    await connection.commit();

    if (!rows[0]) throw new HttpError(500, "Failed to fetch created ADM_CODE");

    return { insertedId: result.insertId, row: rows[0] };
  } catch (err) {
    if (connection) await connection.rollback();
    console.error(err);
    throw err;
  } finally {
    if (connection) connection.release();
  }
};

const getAdmCodes = async (db) => {
  // Prefer promise pool/connection API; fall back to callback connection.
  if (typeof db?.query === "function") {
    // mysql2/promise pool: query returns [rows]
    // mysql2 callback connection: query returns results directly (or [rows] depending on wrapper)
    const result = await db.query(getAllAdmCodesSql);
    const rows = Array.isArray(result) ? result[0] : result;
    return (rows || []).map(mapAdmCodeRow);
  }

  throw new Error("Invalid db instance: missing query() method");
};

const getAdmCodeById = async (db, codeId) => {
  if (typeof db?.query === "function") {
    const result = await db.query(getAdmCodeByIdSql, [codeId]);
    const rows = Array.isArray(result) ? result[0] : result;
    return rows?.[0] ? mapAdmCodeRow(rows[0]) : null;
  }

  throw new Error("Invalid db instance: missing query() method");
};



const updateAdmCodeTx = async (dbPool, codeId, payload) => {
  let connection;
  try {
    connection = await dbPool.getConnection();
    await connection.beginTransaction();

    const updateParams = [
      payload.CODE_NAME,
      payload.CODE_DESCRIPTION ?? null,
      payload.UPDATED_BY ?? null,
      codeId,
    ];

    const [result] = await connection.execute(updateAdmCodeSql, updateParams);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return { affectedRows: 0, row: null };
    }

    const [rows] = await connection.execute(getAdmCodeByIdSql, [codeId]);

    await connection.commit();

    return { affectedRows: result.affectedRows, row: rows[0] ? mapAdmCodeRow(rows[0]) : null };
  } catch (err) {
    if (connection) await connection.rollback();
    console.error(err);
    throw err;
  } finally {
    if (connection) connection.release();
  }
};

const softDeleteAdmCodeTx = async (dbPool, codeId, updatedBy) => {
  let connection;
  try {
    connection = await dbPool.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.execute(softDeleteAdmCodeSql, [updatedBy ?? null, codeId]);

    await connection.commit();

    return { affectedRows: result.affectedRows };
  } catch (err) {
    if (connection) await connection.rollback();
    console.error(err);
    throw err;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createAdmCodeTx,
  getAdmCodes,
  getAdmCodeById,
  updateAdmCodeTx,
  softDeleteAdmCodeTx,
};

