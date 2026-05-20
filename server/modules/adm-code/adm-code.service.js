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
  let connection;
  try {
    connection = await dbPool.getConnection();
    await connection.beginTransaction();


    await ensureCodeNameUnique(connection, payload.code_name, null);

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

    const [result] = await connection.execute(sql, params);

    await connection.commit();
    return result;
  } catch (err) {
    console.error(err);
    if (connection) await connection.rollback();
    throw err;
  } finally {
    if (connection) connection.release();
  }
};

const updateAdmCodeTx = async (dbPool, codeId, payload) => {
  let connection;
  try {
    connection = await dbPool.promise().getConnection();
    await connection.beginTransaction();

    await ensureCodeNameUnique(connection, payload.code_name, codeId);

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

    const [result] = await connection.execute(sql, params);

    await connection.commit();
    return result;
  } catch (err) {
    console.error(err);
    if (connection) await connection.rollback();
    throw err;
  } finally {
    if (connection) connection.release();
  }
};

const softDeleteAdmCodeCascadeTx = async (dbPool, codeId, updatedBy, admCodeModel, admCodeItemModel) => {
  let connection;
  try {
    connection = await dbPool.promise().getConnection();
    await connection.beginTransaction();

    // Mark code + items as deleted
    const [codeRes] = await connection.execute(
      `UPDATE ADM_CODE
       SET IS_DELETED = b'1', UPDATED_BY = ?, DATE_UPDATED = NOW()
       WHERE CODE_ID = ? AND IS_DELETED = b'0'`,
      [updatedBy ?? null, codeId]
    );

    const [itemsRes] = await connection.execute(
      `UPDATE ADM_CODE_ITEM
       SET IS_DELETED = b'1', UPDATED_BY = ?, DATE_UPDATED = NOW()
       WHERE CODE_ID = ? AND IS_DELETED = b'0'`,
      [updatedBy ?? null, codeId]
    );

    await connection.commit();
    return { codeAffectedRows: codeRes.affectedRows, itemsAffectedRows: itemsRes.affectedRows };
  } catch (err) {
    console.error(err);
    if (connection) await connection.rollback();
    throw err;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  ensureCodeNameUnique,
  createAdmCodeTx,
  updateAdmCodeTx,
  softDeleteAdmCodeCascadeTx,
};

