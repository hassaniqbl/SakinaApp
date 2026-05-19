const { HttpError } = require("../../utils/httpError");

const ensureCodeNameUnique = async (db, codeName, excludeCodeId = null) => {
  const [rows] = await db
    .promise()
    .query(
      `SELECT CODE_ID FROM ADM_CODE WHERE CODE_NAME = ? AND IS_DELETED = b'0' ${
        excludeCodeId ? "AND CODE_ID <> ?" : ""
      }`,
      excludeCodeId ? [codeName, excludeCodeId] : [codeName]
    );
  if (rows.length > 0) {
    throw new HttpError(409, "code_name must be unique");
  }
};

const createAdmCode = async (db, payload) => {
  await ensureCodeNameUnique(db, payload.code_name, null);
  return db; // placeholder
};

const createAdmCodeTx = async (dbPool, payload) => {
  // Model insert does not require transaction, but we keep for consistency.
  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();

    await ensureCodeNameUnique(conn, payload.code_name, null);

    const sql = `
      INSERT INTO ADM_CODE (
        CODE_NAME,
        CODE_DESCRIPTION,
        IS_DELETED,
        ADDED_BY,
        UPDATED_BY,
        DATE_CREATED,
        DATE_UPDATED
      ) VALUES (?, ?, b'0', ?, ?, NOW(), NOW())
    `;

    const params = [
      payload.code_name,
      payload.code_description ?? null,
      payload.added_by ?? null,
      payload.updated_by ?? null,
    ];

    const [result] = await conn.promise().execute(sql, params);

    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

const updateAdmCodeTx = async (dbPool, codeId, payload) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();

    await ensureCodeNameUnique(conn, payload.code_name, codeId);

    const sql = `
      UPDATE ADM_CODE
      SET
        CODE_NAME = ?,
        CODE_DESCRIPTION = ?,
        UPDATED_BY = ?,
        DATE_UPDATED = NOW()
      WHERE CODE_ID = ? AND IS_DELETED = b'0'
    `;

    const params = [
      payload.code_name,
      payload.code_description ?? null,
      payload.updated_by ?? null,
      codeId,
    ];

    const [result] = await conn.promise().execute(sql, params);

    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

const softDeleteAdmCodeCascadeTx = async (dbPool, codeId, updatedBy, admCodeModel, admCodeItemModel) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();

    // Mark code + items as deleted
    const [codeRes] = await conn
      .promise()
      .execute(
        `UPDATE ADM_CODE
         SET IS_DELETED = b'1', UPDATED_BY = ?, DATE_UPDATED = NOW()
         WHERE CODE_ID = ? AND IS_DELETED = b'0'`,
        [updatedBy ?? null, codeId]
      );

    const [itemsRes] = await conn
      .promise()
      .execute(
        `UPDATE ADM_CODE_ITEM
         SET IS_DELETED = b'1', UPDATED_BY = ?, DATE_UPDATED = NOW()
         WHERE CODE_ID = ? AND IS_DELETED = b'0'`,
        [updatedBy ?? null, codeId]
      );

    await conn.commit();
    return { codeAffectedRows: codeRes.affectedRows, itemsAffectedRows: itemsRes.affectedRows };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

module.exports = {
  ensureCodeNameUnique,
  createAdmCodeTx,
  updateAdmCodeTx,
  softDeleteAdmCodeCascadeTx,
};

