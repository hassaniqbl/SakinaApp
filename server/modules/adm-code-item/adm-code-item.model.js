const getAllAdmCodeItems = async (
  db,
  { page, limit, offset },
  { codeIdFilterClause, codeIdFilterParams },
  { searchClause, searchParams },
  { sortBy, sortOrder }
) => {
  const where = ["ci.IS_DELETED = b'0'"]
    .concat(codeIdFilterClause ? [codeIdFilterClause] : [])
    .concat(searchClause ? [searchClause] : [])
    .filter(Boolean)
    .join(" AND ");

  const sql = `
    SELECT
      ci.CODE_ITEM_ID,
      ci.CODE_ID,
      ci.ITEM_NAME,
      ci.ITEM_VALUE,
      ci.DISPLAY_ORDER,
      ci.IS_DELETED,
      ci.ADDED_BY,
      ci.UPDATED_BY,
      ci.DATE_CREATED,
      ci.DATE_UPDATED
    FROM ADM_CODE_ITEM ci
    WHERE ${where}
    ORDER BY ci.${sortBy} ${sortOrder}
    LIMIT ? OFFSET ?
  `;

  const params = [...(codeIdFilterParams || []), ...(searchParams || []), limit, offset];
  const [rows] = await db.promise().query(sql, params);

  const [countRows] = await db
    .promise()
    .query(
      `SELECT COUNT(*) as total FROM ADM_CODE_ITEM ci WHERE ${where}`,
      [...(codeIdFilterParams || []), ...(searchParams || [])]
    );

  return { rows, total: countRows?.[0]?.total || 0 };
};

const getAdmCodeItemById = async (db, codeItemId) => {
  const [rows] = await db
    .promise()
    .query(
      `SELECT
        ci.CODE_ITEM_ID,
        ci.CODE_ID,
        ci.ITEM_NAME,
        ci.ITEM_VALUE,
        ci.DISPLAY_ORDER,
        ci.IS_DELETED,
        ci.ADDED_BY,
        ci.UPDATED_BY,
        ci.DATE_CREATED,
        ci.DATE_UPDATED
       FROM ADM_CODE_ITEM ci
       WHERE ci.CODE_ITEM_ID = ? AND ci.IS_DELETED = b'0'`,
      [codeItemId]
    );
  return rows[0] || null;
};

const insertAdmCodeItem = async (db, payload) => {
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
  const [result] = await db.promise().execute(sql, params);
  return result;
};

const updateAdmCodeItem = async (db, codeItemId, payload) => {
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

  const [result] = await db.promise().execute(sql, params);
  return result;
};

const softDeleteAdmCodeItem = async (db, codeItemId, updatedBy) => {
  const [result] = await db
    .promise()
    .execute(
      `UPDATE ADM_CODE_ITEM
       SET IS_DELETED = b'1', UPDATED_BY = ?, DATE_UPDATED = NOW()
       WHERE CODE_ITEM_ID = ? AND IS_DELETED = b'0'`,
      [updatedBy ?? null, codeItemId]
    );
  return result;
};

const softDeleteAdmCodeItemsByCodeId = async (db, codeId, updatedBy) => {
  const [result] = await db
    .promise()
    .execute(
      `UPDATE ADM_CODE_ITEM
       SET IS_DELETED = b'1', UPDATED_BY = ?, DATE_UPDATED = NOW()
       WHERE CODE_ID = ? AND IS_DELETED = b'0'`,
      [updatedBy ?? null, codeId]
    );
  return result;
};

const codeExists = async (db, codeId) => {
  const [rows] = await db
    .promise()
    .query(`SELECT CODE_ID FROM ADM_CODE WHERE CODE_ID = ? AND IS_DELETED = b'0'`, [codeId]);
  return rows.length > 0;
};

const getDropdownItemsByCodeId = async (db, codeId) => {
  const sql = `
    SELECT ITEM_NAME, CODE_ITEM_ID
    FROM ADM_CODE_ITEM
    WHERE CODE_ID = ? AND IS_DELETED = b'0'
    ORDER BY DISPLAY_ORDER ASC, CODE_ITEM_ID ASC
  `;
  const [rows] = await db.promise().query(sql, [codeId]);
  return rows.map((r) => ({ label: r.ITEM_NAME, value: r.CODE_ITEM_ID }));
};

module.exports = {
  getAllAdmCodeItems,
  getAdmCodeItemById,
  insertAdmCodeItem,
  updateAdmCodeItem,
  softDeleteAdmCodeItem,
  codeExists,
  getDropdownItemsByCodeId,
  softDeleteAdmCodeItemsByCodeId,
};

