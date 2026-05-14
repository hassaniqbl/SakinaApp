const insertDelivery = async (db, payload) => {
  const sql = `INSERT INTO SC_DELIVERY (
    IS_DELETED, ADDED_BY, UPDATED_BY,
    PATIENT_ID,
    DATE_CREATED, DATE_UPDATED
  ) VALUES (b'0', ?, ?, ?, NOW(), NOW())`;

  const params = [payload.ADDED_BY || null, payload.UPDATED_BY || null, payload.PATIENT_ID];
  const [result] = await db.promise().execute(sql, params);
  return result;
};

const getAllDeliveries = async (
  db,
  { page, limit, offset },
  { searchClause, searchParams },
  { filterClause, filterParams },
  { sortBy, sortOrder }
) => {
  const where = ["d.IS_DELETED = b'0'"]
    .concat(filterClause ? [filterClause] : [])
    .concat(searchClause ? [searchClause] : [])
    .filter(Boolean)
    .join(" AND ");

  const sql = `
    SELECT d.DELIVERY_ID, d.IS_DELETED, d.ADDED_BY, d.UPDATED_BY, d.DATE_CREATED, d.DATE_UPDATED,
           d.PATIENT_ID
    FROM SC_DELIVERY d
    WHERE ${where}
    ORDER BY d.${sortBy} ${sortOrder}
    LIMIT ? OFFSET ?
  `;

  const params = [...filterParams, ...searchParams, limit, offset];
  const [rows] = await db.promise().query(sql, params);

  const [countRows] = await db
    .promise()
    .query(`SELECT COUNT(*) as total FROM SC_DELIVERY d WHERE ${where}`, [...filterParams, ...searchParams]);

  return { rows, total: countRows[0]?.total || 0 };
};

const getDeliveryById = async (db, id) => {
  const [rows] = await db
    .promise()
    .query(`SELECT * FROM SC_DELIVERY WHERE DELIVERY_ID = ? AND IS_DELETED = b'0'`, [id]);
  return rows[0] || null;
};

const updateDelivery = async (db, id, payload) => {
  const sql = `UPDATE SC_DELIVERY SET
    UPDATED_BY = ?,
    PATIENT_ID = ?
  WHERE DELIVERY_ID = ? AND IS_DELETED = b'0'`;

  const params = [payload.UPDATED_BY || null, payload.PATIENT_ID, id];
  const [result] = await db.promise().execute(sql, params);
  return result;
};

const softDeleteDelivery = async (db, id, updatedBy) => {
  const [result] = await db
    .promise()
    .execute(
      `UPDATE SC_DELIVERY SET IS_DELETED = b'1', UPDATED_BY = ? WHERE DELIVERY_ID = ? AND IS_DELETED = b'0'`,
      [updatedBy || null, id]
    );
  return result;
};

module.exports = {
  insertDelivery,
  getAllDeliveries,
  getDeliveryById,
  updateDelivery,
  softDeleteDelivery,
};

