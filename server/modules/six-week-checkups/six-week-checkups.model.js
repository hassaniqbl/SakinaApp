const insertSixWeekCheckup = async (db, payload) => {
  const sql = `INSERT INTO SC_SIX_WEEK_POSTNATAL_CHECKUP (
    IS_DELETED, ADDED_BY, UPDATED_BY,
    DELIVERY_ID,
    DATE_CREATED, DATE_UPDATED
  ) VALUES (b'0', ?, ?, ?, NOW(), NOW())`;

  const params = [payload.ADDED_BY || null, payload.UPDATED_BY || null, payload.DELIVERY_ID];
  const [result] = await db.promise().execute(sql, params);
  return result;
};

const getAllSixWeekCheckups = async (
  db,
  { page, limit, offset },
  { searchClause, searchParams },
  { filterClause, filterParams },
  { sortBy, sortOrder }
) => {
  const where = ["sw.IS_DELETED = b'0'"]
    .concat(filterClause ? [filterClause] : [])
    .concat(searchClause ? [searchClause] : [])
    .filter(Boolean)
    .join(" AND ");

  const sql = `
    SELECT sw.SIX_WEEK_CHECKUP_ID, sw.IS_DELETED, sw.ADDED_BY, sw.UPDATED_BY, sw.DATE_CREATED, sw.DATE_UPDATED,
           sw.DELIVERY_ID
    FROM SC_SIX_WEEK_POSTNATAL_CHECKUP sw
    WHERE ${where}
    ORDER BY sw.${sortBy} ${sortOrder}
    LIMIT ? OFFSET ?
  `;

  const params = [...filterParams, ...searchParams, limit, offset];
  const [rows] = await db.promise().query(sql, params);

  const [countRows] = await db
    .promise()
    .query(`SELECT COUNT(*) as total FROM SC_SIX_WEEK_POSTNATAL_CHECKUP sw WHERE ${where}`, [...filterParams, ...searchParams]);

  return { rows, total: countRows[0]?.total || 0 };
};

const getSixWeekCheckupById = async (db, id) => {
  const [rows] = await db
    .promise()
    .query(`SELECT * FROM SC_SIX_WEEK_POSTNATAL_CHECKUP WHERE SIX_WEEK_CHECKUP_ID = ? AND IS_DELETED = b'0'`, [id]);
  return rows[0] || null;
};

const updateSixWeekCheckup = async (db, id, payload) => {
  const sql = `UPDATE SC_SIX_WEEK_POSTNATAL_CHECKUP SET
    UPDATED_BY = ?,
    DELIVERY_ID = ?
  WHERE SIX_WEEK_CHECKUP_ID = ? AND IS_DELETED = b'0'`;

  const params = [payload.UPDATED_BY || null, payload.DELIVERY_ID, id];
  const [result] = await db.promise().execute(sql, params);
  return result;
};

const softDeleteSixWeekCheckup = async (db, id, updatedBy) => {
  const [result] = await db
    .promise()
    .execute(
      `UPDATE SC_SIX_WEEK_POSTNATAL_CHECKUP SET IS_DELETED = b'1', UPDATED_BY = ? WHERE SIX_WEEK_CHECKUP_ID = ? AND IS_DELETED = b'0'`,
      [updatedBy || null, id]
    );
  return result;
};

module.exports = {
  insertSixWeekCheckup,
  getAllSixWeekCheckups,
  getSixWeekCheckupById,
  updateSixWeekCheckup,
  softDeleteSixWeekCheckup,
};

