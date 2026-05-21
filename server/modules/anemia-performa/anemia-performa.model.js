const insertAnemiaPerforma = async (db, payload) => {
  const sql = `INSERT INTO SC_ANEMIA_PERFORMA (
    IS_DELETED,
    ADDED_BY,
    UPDATED_BY,

    ANEMIA_CHECKUP_ID,
    INJECTION_BRAND,
    INJECTION_DOSE,
    IV_IRON_QUANTITY,
    INJECTION_DATE,
    REACTION_AFTER_INJECTION,

    DATA_SOURCE,
    CREATED_BY_LATITUDE,
    CREATED_BY_LONGITUDE,

    DATE_CREATED,
    DATE_UPDATED
  ) VALUES (
    b'0', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()
  )`;

  const params = [
    payload.ADDED_BY ?? null,
    payload.UPDATED_BY ?? null,

    payload.ANEMIA_CHECKUP_ID,
    payload.INJECTION_BRAND ?? null,
    payload.INJECTION_DOSE ?? null,
    payload.IV_IRON_QUANTITY ?? null,
    payload.INJECTION_DATE ?? null,
    payload.REACTION_AFTER_INJECTION ?? null,

    payload.DATA_SOURCE ?? null,
    payload.CREATED_BY_LATITUDE ?? null,
    payload.CREATED_BY_LONGITUDE ?? null,
  ];

  const [result] = await db.promise().execute(sql, params);
  return result;
};

const getAllAnemiaPerformas = async (
  db,
  { page, limit, offset },
  { searchClause, searchParams },
  { filterClause, filterParams },
  { sortBy, sortOrder }
) => {
  const where = ["ap.IS_DELETED = b'0'"]
    .concat(filterClause ? [filterClause] : [])
    .concat(searchClause ? [searchClause] : [])
    .filter(Boolean)
    .join(" AND ");

  const sql = `
    SELECT
      ap.ANEMIA_PERFORMA_ID,
      ap.ANEMIA_CHECKUP_ID,
      ap.INJECTION_BRAND,
      ap.INJECTION_DOSE,
      ap.IV_IRON_QUANTITY,
      ap.INJECTION_DATE,
      ap.REACTION_AFTER_INJECTION,
      ap.DATA_SOURCE,
      ap.IS_DELETED,
      ap.CREATED_BY_LATITUDE,
      ap.CREATED_BY_LONGITUDE,
      ap.ADDED_BY,
      ap.UPDATED_BY,
      ap.DATE_CREATED,
      ap.DATE_UPDATED
    FROM SC_ANEMIA_PERFORMA ap
    WHERE ${where}
    ORDER BY ap.${sortBy} ${sortOrder}
    LIMIT ? OFFSET ?
  `;


  const params = [...filterParams, ...searchParams, limit, offset];
  const [rows] = await db.promise().query(sql, params);

  const [countRows] = await db
    .promise()
    .query(`SELECT COUNT(*) as total FROM SC_ANEMIA_PERFORMA ap WHERE ${where}`, [...filterParams, ...searchParams]);

  return { rows, total: countRows[0]?.total || 0 };
};

const getAnemiaPerformaById = async (db, id) => {
  const [rows] = await db
    .promise()
    .query(`SELECT * FROM SC_ANEMIA_PERFORMA WHERE ANEMIA_PERFORMA_ID = ? AND IS_DELETED = b'0'`, [id]);
  return rows[0] || null;
};

const updateAnemiaPerforma = async (db, id, payload) => {
  const sql = `UPDATE SC_ANEMIA_PERFORMA SET
    UPDATED_BY = ?,

    ANEMIA_CHECKUP_ID = ?,
    INJECTION_BRAND = ?,
    INJECTION_DOSE = ?,
    IV_IRON_QUANTITY = ?,
    INJECTION_DATE = ?,
    REACTION_AFTER_INJECTION = ?,

    DATA_SOURCE = ?,
    CREATED_BY_LATITUDE = ?,
    CREATED_BY_LONGITUDE = ?
  WHERE ANEMIA_PERFORMA_ID = ? AND IS_DELETED = b'0'`;

  const params = [
    payload.UPDATED_BY ?? null,

    payload.ANEMIA_CHECKUP_ID,
    payload.INJECTION_BRAND ?? null,
    payload.INJECTION_DOSE ?? null,
    payload.IV_IRON_QUANTITY ?? null,
    payload.INJECTION_DATE ?? null,
    payload.REACTION_AFTER_INJECTION ?? null,

    payload.DATA_SOURCE ?? null,
    payload.CREATED_BY_LATITUDE ?? null,
    payload.CREATED_BY_LONGITUDE ?? null,

    id,
  ];

  const [result] = await db.promise().execute(sql, params);
  return result;
};

const softDeleteAnemiaPerforma = async (db, id, updatedBy) => {
  const [result] = await db
    .promise()
    .execute(
      `UPDATE SC_ANEMIA_PERFORMA SET IS_DELETED = b'1', UPDATED_BY = ? WHERE ANEMIA_PERFORMA_ID = ? AND IS_DELETED = b'0'`,
      [updatedBy || null, id]
    );
  return result;
};

module.exports = {
  insertAnemiaPerforma,
  getAllAnemiaPerformas,
  getAnemiaPerformaById,
  updateAnemiaPerforma,
  softDeleteAnemiaPerforma,
};

