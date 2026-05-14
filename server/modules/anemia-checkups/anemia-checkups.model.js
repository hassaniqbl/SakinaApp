const insertAnemiaCheckup = async (db, payload) => {
  const sql = `INSERT INTO SC_ANEMIA_CHECKUP (
    IS_DELETED, ADDED_BY, UPDATED_BY,
    PATIENT_ID,
    DATE_CREATED, DATE_UPDATED
  ) VALUES (b'0', ?, ?, ?, NOW(), NOW())`;

  const params = [payload.ADDED_BY || null, payload.UPDATED_BY || null, payload.PATIENT_ID];
  const [result] = await db.promise().execute(sql, params);
  return result;
};

const getAllAnemiaCheckups = async (
  db,
  { page, limit, offset },
  { searchClause, searchParams },
  { filterClause, filterParams },
  { sortBy, sortOrder }
) => {
  const where = ["a.IS_DELETED = b'0'" ]
    .concat(filterClause ? [filterClause] : [])
    .concat(searchClause ? [searchClause] : [])
    .filter(Boolean)
    .join(" AND ");

  const sql = `
    SELECT a.ANEMIA_CHECKUP_ID, a.IS_DELETED, a.ADDED_BY, a.UPDATED_BY, a.DATE_CREATED, a.DATE_UPDATED,
           a.PATIENT_ID
    FROM SC_ANEMIA_CHECKUP a
    WHERE ${where}
    ORDER BY a.${sortBy} ${sortOrder}
    LIMIT ? OFFSET ?
  `;

  const params = [...filterParams, ...searchParams, limit, offset];
  const [rows] = await db.promise().query(sql, params);

  const [countRows] = await db
    .promise()
    .query(`SELECT COUNT(*) as total FROM SC_ANEMIA_CHECKUP a WHERE ${where}`, [...filterParams, ...searchParams]);

  return { rows, total: countRows[0]?.total || 0 };
};

const getAnemiaCheckupById = async (db, id) => {
  const [rows] = await db
    .promise()
    .query(`SELECT * FROM SC_ANEMIA_CHECKUP WHERE ANEMIA_CHECKUP_ID = ? AND IS_DELETED = b'0'`, [id]);
  return rows[0] || null;
};

const updateAnemiaCheckup = async (db, id, payload) => {
  const sql = `UPDATE SC_ANEMIA_CHECKUP SET
    UPDATED_BY = ?,
    PATIENT_ID = ?
  WHERE ANEMIA_CHECKUP_ID = ? AND IS_DELETED = b'0'`;

  const params = [payload.UPDATED_BY || null, payload.PATIENT_ID, id];
  const [result] = await db.promise().execute(sql, params);
  return result;
};

const softDeleteAnemiaCheckup = async (db, id, updatedBy) => {
  const [result] = await db
    .promise()
    .execute(
      `UPDATE SC_ANEMIA_CHECKUP SET IS_DELETED = b'1', UPDATED_BY = ? WHERE ANEMIA_CHECKUP_ID = ? AND IS_DELETED = b'0'`,
      [updatedBy || null, id]
    );
  return result;
};

module.exports = {
  insertAnemiaCheckup,
  getAllAnemiaCheckups,
  getAnemiaCheckupById,
  updateAnemiaCheckup,
  softDeleteAnemiaCheckup,
};

