const { HttpError } = require("../../utils/httpError");

const ensureCodeIdExists = async (db, codeId) => {
  const [rows] = await db
    .promise()
    .query(`SELECT CODE_ID FROM ADM_CODE WHERE CODE_ID = ? AND IS_DELETED = b'0'`, [codeId]);
  if (rows.length === 0) throw new HttpError(400, "Invalid code_id");
};

const createAdmCodeItemTx = async (dbPool, payload) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();
    await ensureCodeIdExists(conn, payload.code_id);

    const sql = `
      INSERT INTO ADM_CODE_ITEM (
        CODE_ID,
        ITEM_NAME,
        ITEM_VALUE,
        DISPLAY_ORDER,
        IS_DELETED,
        ADDED_BY,
        UPDATED_BY,
        DATE_CREATED,
        DATE_UPDATED
      ) VALUES (?, ?, ?, ?, b'0', ?, ?, NOW(), NOW())
    `;

    const params = [
      payload.code_id,
      payload.item_name,
      payload.item_value,
      payload.display_order ?? null,
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

const updateAdmCodeItemTx = async (dbPool, codeItemId, payload) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();

    await ensureCodeIdExists(conn, payload.code_id);

    const sql = `
      UPDATE ADM_CODE_ITEM
      SET
        CODE_ID = ?,
        ITEM_NAME = ?,
        ITEM_VALUE = ?,
        DISPLAY_ORDER = ?,
        UPDATED_BY = ?,
        DATE_UPDATED = NOW()
      WHERE CODE_ITEM_ID = ? AND IS_DELETED = b'0'
    `;

    const params = [
      payload.code_id,
      payload.item_name,
      payload.item_value,
      payload.display_order ?? null,
      payload.updated_by ?? null,
      codeItemId,
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

const softDeleteAdmCodeItemTx = async (dbPool, codeItemId, updatedBy, admCodeItemModel) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn
      .promise()
      .execute(
        `UPDATE ADM_CODE_ITEM
         SET IS_DELETED = b'1', UPDATED_BY = ?, DATE_UPDATED = NOW()
         WHERE CODE_ITEM_ID = ? AND IS_DELETED = b'0'`,
        [updatedBy ?? null, codeItemId]
      );

    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

module.exports = {
  createAdmCodeItemTx,
  updateAdmCodeItemTx,
  softDeleteAdmCodeItemTx,
  ensureCodeIdExists,
};

