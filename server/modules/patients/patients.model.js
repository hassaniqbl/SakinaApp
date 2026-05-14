const getAllPatients = async (db, { page, limit, offset }, { searchClause, searchParams }, { filterClause, filterParams }, { sortBy, sortOrder }) => {
  const where = ["p.IS_DELETED = b'0'"]
    .concat(filterClause ? [filterClause] : [])
    .concat(searchClause ? [searchClause] : [])
    .filter(Boolean)
    .join(" AND ");

  const sql = `
    SELECT 
      p.PATIENT_ID, p.IS_DELETED, p.ADDED_BY, p.UPDATED_BY, p.DATE_CREATED, p.DATE_UPDATED,
      p.PATIENT_NAME, p.CNIC_NUMBER, p.PHONE_NUMBER, p.LOCATION_ID
    FROM SC_PATIENT p
    WHERE ${where}
    ORDER BY p.${sortBy} ${sortOrder}
    LIMIT ? OFFSET ?
  `;

  const params = [...filterParams, ...searchParams, limit, offset];
  const [rows] = await db.promise().query(sql, params);

  const [countRows] = await db
    .promise()
    .query(`SELECT COUNT(*) as total FROM SC_PATIENT p WHERE ${where}`, [...filterParams, ...searchParams]);

  return { rows, total: countRows[0]?.total || 0 };
};

const insertPatient = async (db, payload) => {
  const sql = `INSERT INTO SC_PATIENT (
    IS_DELETED, ADDED_BY, UPDATED_BY,
    PATIENT_NAME, CNIC_NUMBER, PHONE_NUMBER, LOCATION_ID,
    DATE_CREATED, DATE_UPDATED
  ) VALUES (b'0', ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

  const params = [
    payload.ADDED_BY || null,
    payload.UPDATED_BY || null,
    payload.PATIENT_NAME || null,
    payload.CNIC_NUMBER || null,
    payload.PHONE_NUMBER || null,
    payload.LOCATION_ID || null,
  ];

  const [result] = await db.promise().execute(sql, params);
  return result;
};

const getPatientById = async (db, id) => {
  const [rows] = await db
    .promise()
    .query(
      `SELECT * FROM SC_PATIENT WHERE PATIENT_ID = ? AND IS_DELETED = b'0'`,
      [id]
    );
  return rows[0] || null;
};

const updatePatient = async (db, id, payload) => {
  const sql = `UPDATE SC_PATIENT SET
    UPDATED_BY = ?,
    PATIENT_NAME = ?,
    CNIC_NUMBER = ?,
    PHONE_NUMBER = ?,
    LOCATION_ID = ?
  WHERE PATIENT_ID = ? AND IS_DELETED = b'0'`;

  const params = [
    payload.UPDATED_BY || null,
    payload.PATIENT_NAME || null,
    payload.CNIC_NUMBER || null,
    payload.PHONE_NUMBER || null,
    payload.LOCATION_ID || null,
    id,
  ];

  const [result] = await db.promise().execute(sql, params);
  return result;
};

const softDeletePatient = async (db, id, updatedBy) => {
  const [result] = await db
    .promise()
    .execute(
      `UPDATE SC_PATIENT SET IS_DELETED = b'1', UPDATED_BY = ? WHERE PATIENT_ID = ? AND IS_DELETED = b'0'`,
      [updatedBy || null, id]
    );
  return result;
};

module.exports = {
  insertPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  softDeletePatient,
};

