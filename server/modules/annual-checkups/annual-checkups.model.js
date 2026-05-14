const insertAnnualCheckup = async (db, payload) => {
  const sql = `INSERT INTO SC_ANNUAL_POSTNATAL_CHECKUP (
    IS_DELETED, ADDED_BY, UPDATED_BY,
    DELIVERY_ID,
    DATE_CREATED, DATE_UPDATED
  ) VALUES (b'0', ?, ?, ?, NOW(), NOW())`;

  const params = [payload.ADDED_BY || null, payload.UPDATED_BY || null, payload.DELIVERY_ID];
  const [result] = await db.promise().execute(sql, params);
  return result;
};

const getAllAnnualCheckups = async (
  db,
  { page, limit, offset },
  { searchClause, searchParams },
  { filterClause, filterParams },
  { sortBy, sortOrder }
) => {
  const where = ["ac.IS_DELETED = b'0'"]
    .concat(filterClause ? [filterClause] : [])
    .concat(searchClause ? [searchClause] : [])
    .filter(Boolean)
    .join(" AND ");

  const sql = `
    SELECT ac.ANNUAL_CHECKUP_ID, ac.IS_DELETED, ac.ADDED_BY, ac.UPDATED_BY, ac.DATE_CREATED, ac.DATE_UPDATED,
           ac.DELIVERY_ID
    FROM SC_ANNUAL_POSTNATAL_CHECKUP ac
    WHERE ${where}
    ORDER BY ac.${sortBy} ${sortOrder}
    LIMIT ? OFFSET ?
  `;

  const params = [...filterParams, ...searchParams, limit, offset];
  const [rows] = await db.promise().query(sql, params);

  const [countRows] = await db
    .promise()
    .query(`SELECT COUNT(*) as total FROM SC_ANNUAL_POSTNATAL_CHECKUP ac WHERE ${where}`, [...filterParams, ...searchParams]);

  return { rows, total: countRows[0]?.total || 0 };
};

const getAnnualCheckupById = async (db, id) => {
  const [rows] = await db
    .promise()
    .query(`SELECT * FROM SC_ANNUAL_POSTNATAL_CHECKUP WHERE ANNUAL_CHECKUP_ID = ? AND IS_DELETED = b'0'`, [id]);
  return rows[0] || null;
};

const updateAnnualCheckup = async (db, id, payload) => {
  const sql = `UPDATE SC_ANNUAL_POSTNATAL_CHECKUP SET
    UPDATED_BY = ?,
    DELIVERY_ID = ?
  WHERE ANNUAL_CHECKUP_ID = ? AND IS_DELETED = b'0'`;

  const params = [payload.UPDATED_BY || null, payload.DELIVERY_ID, id];
  const [result] = await db.promise().execute(sql, params);
  return result;
};

const softDeleteAnnualCheckup = async (db, id, updatedBy) => {
  const [result] = await db
    .promise()
    .execute(
      `UPDATE SC_ANNUAL_POSTNATAL_CHECKUP SET IS_DELETED = b'1', UPDATED_BY = ? WHERE ANNUAL_CHECKUP_ID = ? AND IS_DELETED = b'0'`,
      [updatedBy || null, id]
    );
  return result;
};

module.exports = {
  insertAnnualCheckup,
  getAllAnnualCheckups,
  getAnnualCheckupById,
  updateAnnualCheckup,
  softDeleteAnnualCheckup,
};

