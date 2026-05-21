const normalizeDeliveryRow = (row) => {
  if (!row || typeof row !== "object") return row;

  // MySQL BIT columns may come back as Buffer.
  if (row.IS_DELETED && Buffer.isBuffer(row.IS_DELETED)) {
    row.IS_DELETED = row.IS_DELETED.length ? row.IS_DELETED[0] : 0;
  }

  // Also normalize commonly used BIT fields if returned as Buffer.
  for (const key of [
    "IS_BABY_ALIVE",
    "IS_MOTHER_ALIVE",
    "IS_BREAST_FEED_DURING_FIRST_HOUR",
    "IS_COLOSTRUM_BREASTMILK_GIVEN",
    "IS_KANGAROO_CARE",
  ]) {
    if (row[key] && Buffer.isBuffer(row[key])) {
      row[key] = row[key].length ? row[key][0] : 0;
    }
  }

  return row;
};

const insertDelivery = async (db, payload) => {
  const sql = `INSERT INTO SC_DELIVERY (
    PATIENT_ID,
    BABY_DEATH_REASON,
    MOTHER_DEATH_REASON,
    FEEDBACK_ON_CBK,
    DELIVERY_CENTRE,
    DATE_OF_DELIVERY,
    MODE_OF_DELIVERY,
    BLOOD_LOSS_DURING_DELIVERY,
    IS_BABY_ALIVE,
    IS_MOTHER_ALIVE,
    PREGNANCY_PERIOD_WEEKS,
    PREGNANCY_PERIOD_DAYS,
    IS_BREAST_FEED_DURING_FIRST_HOUR,
    IS_COLOSTRUM_BREASTMILK_GIVEN,
    IS_KANGAROO_CARE,
    FOLLOW_UP_DATE,
    ANTENATAL_VISITS,
    DATA_SOURCE,
    CREATED_BY_LATITUDE,
    CREATED_BY_LONGITUDE
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
  )`;

  const params = [
    payload.PATIENT_ID,
    payload.BABY_DEATH_REASON,
    payload.MOTHER_DEATH_REASON,
    payload.FEEDBACK_ON_CBK,
    payload.DELIVERY_CENTRE,
    payload.DATE_OF_DELIVERY,
    payload.MODE_OF_DELIVERY,
    payload.BLOOD_LOSS_DURING_DELIVERY,
    payload.IS_BABY_ALIVE ? 1 : 0,
    payload.IS_MOTHER_ALIVE ? 1 : 0,
    payload.PREGNANCY_PERIOD_WEEKS,
    payload.PREGNANCY_PERIOD_DAYS,
    payload.IS_BREAST_FEED_DURING_FIRST_HOUR ? 1 : 0,
    payload.IS_COLOSTRUM_BREASTMILK_GIVEN ? 1 : 0,
    payload.IS_KANGAROO_CARE ? 1 : 0,
    payload.FOLLOW_UP_DATE,
    payload.ANTENATAL_VISITS,
    payload.DATA_SOURCE,
    payload.CREATED_BY_LATITUDE,
    payload.CREATED_BY_LONGITUDE
  ];

  return db.execute(sql, params);
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

    PATIENT_ID = ?,
    BABY_DEATH_REASON = ?,
    MOTHER_DEATH_REASON = ?,
    FEEDBACK_ON_CBK = ?,
    DELIVERY_CENTRE = ?,
    DATE_OF_DELIVERY = ?,
    MODE_OF_DELIVERY = ?,
    BLOOD_LOSS_DURING_DELIVERY = ?,

    IS_BABY_ALIVE = ?,
    IS_MOTHER_ALIVE = ?,
    PREGNANCY_PERIOD_WEEKS = ?,
    PREGNANCY_PERIOD_DAYS = ?,

    IS_BREAST_FEED_DURING_FIRST_HOUR = ?,
    IS_COLOSTRUM_BREASTMILK_GIVEN = ?,
    IS_KANGAROO_CARE = ?,

    FOLLOW_UP_DATE = ?,
    ANTENATAL_VISITS = ?,
    DATA_SOURCE = ?,

    CREATED_BY_LATITUDE = ?,
    CREATED_BY_LONGITUDE = ?,

    DATE_UPDATED = NOW()
  WHERE DELIVERY_ID = ? AND IS_DELETED = b'0'`;

  const params = [
    payload.UPDATED_BY || null,

    payload.PATIENT_ID,
    payload.BABY_DEATH_REASON,
    payload.MOTHER_DEATH_REASON,
    payload.FEEDBACK_ON_CBK,
    payload.DELIVERY_CENTRE,
    payload.DATE_OF_DELIVERY,
    payload.MODE_OF_DELIVERY,
    payload.BLOOD_LOSS_DURING_DELIVERY,

    payload.IS_BABY_ALIVE,
    payload.IS_MOTHER_ALIVE,
    payload.PREGNANCY_PERIOD_WEEKS,
    payload.PREGNANCY_PERIOD_DAYS,

    payload.IS_BREAST_FEED_DURING_FIRST_HOUR,
    payload.IS_COLOSTRUM_BREASTMILK_GIVEN,
    payload.IS_KANGAROO_CARE,

    payload.FOLLOW_UP_DATE,
    payload.ANTENATAL_VISITS,
    payload.DATA_SOURCE,

    payload.CREATED_BY_LATITUDE,
    payload.CREATED_BY_LONGITUDE,

    id,
  ];

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

