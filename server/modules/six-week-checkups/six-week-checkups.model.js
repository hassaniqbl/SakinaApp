const insertSixWeekCheckup = async (db, payload) => {
  const sql = `
    INSERT INTO SC_SIX_WEEK_POSTNATAL_CHECKUP (
      IS_DELETED,
      ADDED_BY,
      UPDATED_BY,
      DELIVERY_ID,
      IS_PATIENT_ALIVE,
      PATIENT_DEATH_REASON,
      IS_PATIENT_HEALTHY,
      PATIENT_HEALTH_MORE_DETAILS,
      IS_BABY_ALIVE,
      BABY_DEATH_REASON,
      IS_BABY_HEALTHY,
      BABY_HEALTH_MORE_DETAILS,
      BREAST_FEEDING_DURATION,
      IS_BABY_CORD_HEALTHY,
      BABY_CORD_CONDITION_MORE_DETAILS,
      FOLLOWUP_DATE,
      DATA_SOURCE,
      CREATED_BY_LATITUDE,
      CREATED_BY_LONGITUDE,
      DATE_CREATED,
      DATE_UPDATED
    ) VALUES (
      b'0',
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      NOW(),
      NOW()
    )
  `;

  const params = [
    payload.ADDED_BY || null,
    payload.UPDATED_BY || null,
    payload.DELIVERY_ID,

    payload.IS_PATIENT_ALIVE,
    payload.PATIENT_DEATH_REASON,
    payload.IS_PATIENT_HEALTHY,
    payload.PATIENT_HEALTH_MORE_DETAILS,

    payload.IS_BABY_ALIVE,
    payload.BABY_DEATH_REASON,
    payload.IS_BABY_HEALTHY,
    payload.BABY_HEALTH_MORE_DETAILS,

    payload.BREAST_FEEDING_DURATION,
    payload.IS_BABY_CORD_HEALTHY,
    payload.BABY_CORD_CONDITION_MORE_DETAILS,

    payload.FOLLOWUP_DATE,

    payload.DATA_SOURCE,
    payload.CREATED_BY_LATITUDE || null,
    payload.CREATED_BY_LONGITUDE || null,
  ];

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
    SELECT
      sw.SIX_WEEK_CHECKUP_ID,
      sw.IS_DELETED,
      sw.ADDED_BY,
      sw.UPDATED_BY,
      sw.DATE_CREATED,
      sw.DATE_UPDATED,

      sw.DELIVERY_ID,
      sw.IS_PATIENT_ALIVE,
      sw.PATIENT_DEATH_REASON,
      sw.IS_PATIENT_HEALTHY,
      sw.PATIENT_HEALTH_MORE_DETAILS,
      sw.IS_BABY_ALIVE,
      sw.BABY_DEATH_REASON,
      sw.IS_BABY_HEALTHY,
      sw.BABY_HEALTH_MORE_DETAILS,
      sw.BREAST_FEEDING_DURATION,
      sw.IS_BABY_CORD_HEALTHY,
      sw.BABY_CORD_CONDITION_MORE_DETAILS,
      sw.FOLLOWUP_DATE,
      sw.DATA_SOURCE,
      sw.CREATED_BY_LATITUDE,
      sw.CREATED_BY_LONGITUDE
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
  const sql = `
    UPDATE SC_SIX_WEEK_POSTNATAL_CHECKUP SET
      UPDATED_BY = ?,
      DELIVERY_ID = ?,
      IS_PATIENT_ALIVE = ?,
      PATIENT_DEATH_REASON = ?,
      IS_PATIENT_HEALTHY = ?,
      PATIENT_HEALTH_MORE_DETAILS = ?,
      IS_BABY_ALIVE = ?,
      BABY_DEATH_REASON = ?,
      IS_BABY_HEALTHY = ?,
      BABY_HEALTH_MORE_DETAILS = ?,
      BREAST_FEEDING_DURATION = ?,
      IS_BABY_CORD_HEALTHY = ?,
      BABY_CORD_CONDITION_MORE_DETAILS = ?,
      FOLLOWUP_DATE = ?,
      DATA_SOURCE = ?,
      CREATED_BY_LATITUDE = ?,
      CREATED_BY_LONGITUDE = ?,
      DATE_UPDATED = NOW()
    WHERE SIX_WEEK_CHECKUP_ID = ? AND IS_DELETED = b'0'
  `;

  const params = [
    payload.UPDATED_BY || null,
    payload.DELIVERY_ID,

    payload.IS_PATIENT_ALIVE,
    payload.PATIENT_DEATH_REASON,
    payload.IS_PATIENT_HEALTHY,
    payload.PATIENT_HEALTH_MORE_DETAILS,

    payload.IS_BABY_ALIVE,
    payload.BABY_DEATH_REASON,
    payload.IS_BABY_HEALTHY,
    payload.BABY_HEALTH_MORE_DETAILS,

    payload.BREAST_FEEDING_DURATION,
    payload.IS_BABY_CORD_HEALTHY,
    payload.BABY_CORD_CONDITION_MORE_DETAILS,

    payload.FOLLOWUP_DATE,

    payload.DATA_SOURCE,
    payload.CREATED_BY_LATITUDE || null,
    payload.CREATED_BY_LONGITUDE || null,

    id,
  ];

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

