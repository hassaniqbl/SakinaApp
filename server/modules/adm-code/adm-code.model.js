const mapBitToBool = (v) => (v === 1 || v === "1" || v === true);

const ADM_CODE_FIELDS = [
  "c.CODE_ID",
  "c.CODE_NAME",
  "c.CODE_DESCRIPTION",
  "c.IS_DELETED",
  "c.ADDED_BY",
  "c.UPDATED_BY",
  "c.DATE_CREATED",
  "c.DATE_UPDATED",
];

const getAllAdmCodes = async (
  db,
  { page, limit, offset },
  { searchClause, searchParams },
  { sortBy, sortOrder }
) => {
  const where = ["c.IS_DELETED = b'0'"]
    .concat(searchClause ? [searchClause] : [])
    .filter(Boolean)
    .join(" AND ");

  const sql = `
    SELECT ${ADM_CODE_FIELDS.join(", ")}
    FROM ADM_CODE c
    WHERE ${where}
    ORDER BY c.${sortBy} ${sortOrder}
    LIMIT ? OFFSET ?
  `;

  const params = [...(searchParams || []), limit, offset];
  const [rows] = await db.promise().query(sql, params);
  const [countRows] = await db
    .promise()
    .query(`SELECT COUNT(*) as total FROM ADM_CODE c WHERE ${where}`, searchParams || []);

  return { rows, total: countRows?.[0]?.total || 0 };
};

const getAdmCodeById = async (db, codeId) => {
  const [rows] = await db
    .promise()
    .query(
      `SELECT ${ADM_CODE_FIELDS.join(", ")}
       FROM ADM_CODE c
       WHERE c.CODE_ID = ? AND c.IS_DELETED = b'0'`,
      [codeId]
    );
  return rows[0] || null;
};

const insertAdmCode = async (db, payload) => {
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

  const params = [payload.code_name, payload.code_description ?? null, payload.added_by ?? null, payload.updated_by ?? null];
  const [result] = await db.promise().execute(sql, params);
  return result;
};

const updateAdmCode = async (db, codeId, payload) => {
  const sql = `
    UPDATE ADM_CODE
    SET
      CODE_NAME = ?,
      CODE_DESCRIPTION = ?,
      UPDATED_BY = ?,
      DATE_UPDATED = NOW()
    WHERE CODE_ID = ? AND IS_DELETED = b'0'
  `;

  const params = [payload.code_name, payload.code_description ?? null, payload.updated_by ?? null, codeId];
  const [result] = await db.promise().execute(sql, params);
  return result;
};

const softDeleteAdmCodeCascade = async (db, codeId, updatedBy) => {
  // Transaction should be handled by service.
  const [codeRes] = await db
    .promise()
    .execute(
      `UPDATE ADM_CODE
       SET IS_DELETED = b'1', UPDATED_BY = ?, DATE_UPDATED = NOW()
       WHERE CODE_ID = ? AND IS_DELETED = b'0'`,
      [updatedBy ?? null, codeId]
    );

  const [itemsRes] = await db
    .promise()
    .execute(
      `UPDATE ADM_CODE_ITEM
       SET IS_DELETED = b'1', UPDATED_BY = ?, DATE_UPDATED = NOW()
       WHERE CODE_ID = ? AND IS_DELETED = b'0'`,
      [updatedBy ?? null, codeId]
    );

  return { codeAffectedRows: codeRes.affectedRows, itemsAffectedRows: itemsRes.affectedRows };
};

const getAdmCodeByName = async (db, codeName) => {
  const [rows] = await db
    .promise()
    .query(
      `SELECT CODE_ID, CODE_NAME
       FROM ADM_CODE
       WHERE CODE_NAME = ? AND IS_DELETED = b'0'`,
      [codeName]
    );
  return rows[0] || null;
};

const getAllCodesWithItems = async (db) => {
  const sql = `
    SELECT
      c.CODE_ID,
      c.CODE_NAME,
      ci.CODE_ITEM_ID,
      ci.ITEM_NAME,
      ci.ITEM_VALUE
    FROM ADM_CODE c
    LEFT JOIN ADM_CODE_ITEM ci
      ON ci.CODE_ID = c.CODE_ID AND ci.IS_DELETED = b'0'
    WHERE c.IS_DELETED = b'0'
    ORDER BY c.DATE_CREATED DESC, ci.CODE_ITEM_ID ASC
  `;

  const [rows] = await db.promise().query(sql);

  const map = new Map();
  for (const r of rows) {
    if (!map.has(r.CODE_ID)) {
      map.set(r.CODE_ID, { code_id: r.CODE_ID, code_name: r.CODE_NAME, items: [] });
    }
    if (r.CODE_ITEM_ID) {
      map.get(r.CODE_ID).items.push({
        code_item_id: r.CODE_ITEM_ID,
        item_name: r.ITEM_NAME,
        item_value: r.ITEM_VALUE,
      });
    }
  }

  return Array.from(map.values());
};

const getCodeItemsByCodeName = async (db, codeName) => {
  const sql = `
    SELECT ci.CODE_ITEM_ID, ci.ITEM_NAME, ci.ITEM_VALUE
    FROM ADM_CODE c
    INNER JOIN ADM_CODE_ITEM ci
      ON ci.CODE_ID = c.CODE_ID
      AND ci.IS_DELETED = b'0'
    WHERE c.CODE_NAME = ?
      AND c.IS_DELETED = b'0'
    ORDER BY ci.CODE_ITEM_ID ASC
  `;


  const [rows] = await db.promise().query(sql, [codeName]);
  return rows.map((r) => ({
    code_item_id: r.CODE_ITEM_ID,
    item_name: r.ITEM_NAME,
    item_value: r.ITEM_VALUE,
  }));
};

const getCodeItemsByCodeId = async (db, codeId) => {
  const sql = `
    SELECT ci.CODE_ITEM_ID, ci.ITEM_NAME, ci.ITEM_VALUE
    FROM ADM_CODE_ITEM ci
    WHERE ci.CODE_ID = ?
      AND ci.IS_DELETED = b'0'
    ORDER BY ci.DISPLAY_ORDER ASC, ci.CODE_ITEM_ID ASC
  `;

  const [rows] = await db.promise().query(sql, [codeId]);
  return rows.map((r) => ({
    code_item_id: r.CODE_ITEM_ID,
    item_name: r.ITEM_NAME,
    item_value: r.ITEM_VALUE,
  }));
};

const getDropdownCodes = async (db) => {
  const sql = `
    SELECT CODE_ID, CODE_NAME
    FROM ADM_CODE
    WHERE IS_DELETED = b'0'
    ORDER BY DATE_CREATED DESC
  `;
  const [rows] = await db.promise().query(sql);
  return rows.map((r) => ({ label: r.CODE_NAME, value: r.CODE_ID }));
};

module.exports = {
  getAllAdmCodes,
  getAdmCodeById,
  insertAdmCode,
  updateAdmCode,
  softDeleteAdmCodeCascade,
  getAdmCodeByName,
  getAllCodesWithItems,
  getCodeItemsByCodeName,
  getCodeItemsByCodeId,
  getDropdownCodes,
};

