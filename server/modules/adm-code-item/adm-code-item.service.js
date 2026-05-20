const { HttpError } = require("../../utils/httpError");

const ensureCodeIdExists = async (db, codeId) => {
  const [rows] = await db
    .promise()
    .query(`SELECT CODE_ID FROM ADM_CODE WHERE CODE_ID = ? AND IS_DELETED = b'0'`, [codeId]);
  if (rows.length === 0) throw new HttpError(400, "Invalid code_id");
};

const createAdmCodeItemTx = async (db, payload) => {
  // `db` is the mysql2 Connection from app.locals.db
  await ensureCodeIdExists(db, payload.code_id);

  const sql = `
    INSERT INTO ADM_CODE_ITEM (
      CODE_ID,
      ITEM_NAME,
      ITEM_VALUE,
      IS_DELETED,
      ADDED_BY,
      UPDATED_BY,
      DATE_CREATED,
      DATE_UPDATED
    ) VALUES (?, ?, ?, b'0', ?, ?, NOW(), NOW())
  `;

  const params = [
    payload.code_id,
    payload.item_name,
    payload.item_value,
    payload.added_by ?? null,
    payload.updated_by ?? null,
  ];

  const [result] = await db.promise().execute(sql, params);
  return result;
};

const updateAdmCodeItemTx = async (db, codeItemId, payload) => {
  await ensureCodeIdExists(db, payload.code_id);

  const sql = `
    UPDATE ADM_CODE_ITEM
    SET
      CODE_ID = ?,
      ITEM_NAME = ?,
      ITEM_VALUE = ?,
      UPDATED_BY = ?,
      DATE_UPDATED = NOW()
    WHERE CODE_ITEM_ID = ? AND IS_DELETED = b'0'
  `;

  const params = [
    payload.code_id,
    payload.item_name,
    payload.item_value,
    payload.updated_by ?? null,
    codeItemId,
  ];

  const [result] = await db.promise().execute(sql, params);
  return result;
};

const softDeleteAdmCodeItemTx = async (db, codeItemId, updatedBy) => {
  const [result] = await db.promise().execute(
    `UPDATE ADM_CODE_ITEM
     SET IS_DELETED = b'1', UPDATED_BY = ?, DATE_UPDATED = NOW()
     WHERE CODE_ITEM_ID = ? AND IS_DELETED = b'0'`,
    [updatedBy ?? null, codeItemId]
  );

  return result;
};

module.exports = {
  createAdmCodeItemTx,
  updateAdmCodeItemTx,
  softDeleteAdmCodeItemTx,
  ensureCodeIdExists,
};

