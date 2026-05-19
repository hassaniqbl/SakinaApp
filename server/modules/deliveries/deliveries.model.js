const normalizeDeliveryRow = (row) => {
  if (!row || typeof row !== "object") return row;

  // MySQL may return BIT/BINARY columns as Buffer.
  // Example observed: IS_DELETED: { type: 'Buffer', data: [0] }
  if (row.IS_DELETED && Buffer.isBuffer(row.IS_DELETED)) {
    row.IS_DELETED = row.IS_DELETED.length ? row.IS_DELETED[0] : 0;
  }

  return row;
};

const insertDelivery = async (db, payload) => {
  const sql = `INSERT INTO SC_DELIVERY (
    IS_DELETED,
    ADDED_BY,
    UPDATED_BY,
    PATIENT_ID,
    DELIVERY_DATE,
    DELIVERY_TYPE,
    DELIVERY_OUTCOME,
    BABY_WEIGHT,
    BABY_GENDER,
    COMPLICATIONS,
    DELIVERED_BY,
    DATE_CREATED,
    DATE_UPDATED
  ) VALUES (
    b'0', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()
  )`;

  const params = [
    payload.ADDED_BY || null,
    payload.UPDATED_BY || null,
    payload.PATIENT_ID,
    payload.DELIVERY_DATE || null,
    payload.DELIVERY_TYPE || null,
    payload.DELIVERY_OUTCOME || null,
    payload.BABY_WEIGHT || null,
    payload.BABY_GENDER || null,
    payload.COMPLICATIONS || null,
    payload.DELIVERED_BY || null,
  ];

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
    SELECT d.*
    FROM SC_DELIVERY d
    WHERE ${where}
    ORDER BY d.${sortBy} ${sortOrder}
    LIMIT ? OFFSET ?
  `;

  const params = [...filterParams, ...searchParams, limit, offset];
  const [rows] = await db.promise().query(sql, params);

  const normalizedRows = rows.map(normalizeDeliveryRow);

  const [countRows] = await db
    .promise()
    .query(`SELECT COUNT(*) as total FROM SC_DELIVERY d WHERE ${where}`, [...filterParams, ...searchParams]);

  return { rows: normalizedRows, total: countRows[0]?.total || 0 };
};

const getDeliveryById = async (db, id) => {
  const [rows] = await db
    .promise()
    .query(`SELECT * FROM SC_DELIVERY WHERE DELIVERY_ID = ? AND IS_DELETED = b'0'`, [id]);

  return normalizeDeliveryRow(rows[0] || null);
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


