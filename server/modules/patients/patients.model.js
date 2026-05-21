const ALLOWED_LIST_SORT_COLUMNS = new Set([
  "PATIENT_ID",
  "PATIENT_NAME",
  "PHONE_NUMBER",
  "LOCATION_ID",
  "DATE_CREATED",
  "DATE_UPDATED",
]);

const mapBooleanBit = (value) => {
  // table uses BIT for IS_DELETED. mysql driver accepts 0/1 or b'0'/b'1' in SQL.
  if (value === true || value === 1 || value === "1") return 1;
  return 0;
};

const getAllPatients = async (
  db,
  { page, limit, offset },
  { searchClause, searchParams },
  { filterClause, filterParams },
  { sortBy, sortOrder }
) => {
  const whereParts = ["p.IS_DELETED = b'0'"]
    .concat(filterClause ? [filterClause] : [])
    .concat(searchClause ? [searchClause] : [])
    .filter(Boolean);

  const where = whereParts.join(" AND ");

  // Ensure safe column usage
  const safeSortBy = ALLOWED_LIST_SORT_COLUMNS.has(sortBy) ? sortBy : "DATE_CREATED";
  const safeSortOrder = sortOrder === "ASC" ? "ASC" : "DESC";

  const sql = `
    SELECT
      p.PATIENT_ID,
      p.PATIENT_REGISTRATION_NUMBER,
      p.REGISTRATION_DATE,
      p.PATIENT_NAME,
      p.CNIC_NUMBER,
      p.PHONE_NUMBER,
      p.AGE,
      p.HUSBAND_NAME,
      p.ADDRESS_LINE1,
      p.ADDRESS_LINE2,
      p.RELIGION,
      p.LOCATION_ID,
      p.EDUCATION,
      p.ESTIMATED_DATE_OF_DELIVERY,
      p.BASELINE_HAEMOGLOBIN_COUNT,
      p.PATIENT_PROFESSION,
      p.PATIENT_MONTHLY_SALARY,
      p.RESIDENCE_CONDITION,
      p.RESIDENCE_OWNERSHIP,
      p.GRAVIDA,
      p.PARA,
      p.MISCARRIAGE,
      p.ANTENATAL_VISITS,
      p.DATA_SOURCE,
      p.IS_DELETED,
      p.CREATED_BY_LATITUDE,
      p.CREATED_BY_LONGITUDE,
      p.ADDED_BY,
      p.UPDATED_BY,
      p.DATE_CREATED,
      p.DATE_UPDATED
    FROM SC_PATIENT p
    WHERE ${where}
    ORDER BY p.${safeSortBy} ${safeSortOrder}
    LIMIT ? OFFSET ?
  `;

  const params = [...filterParams, ...searchParams, limit, offset];
  const [rows] = await db.promise().query(sql, params);

  const [countRows] = await db
    .promise()
    .query(`SELECT COUNT(*) as total FROM SC_PATIENT p WHERE ${where}`, [...filterParams, ...searchParams]);

  return { rows, total: countRows[0]?.total || 0 };
};

const getNextPatientRegistrationNumber = async (db, year) => {
  // PAT-YYYY-XXXXX, where XXXXX is 5-digit sequence per year.
  const sql = `
    SELECT
      MAX(CAST(SUBSTRING_INDEX(PATIENT_REGISTRATION_NUMBER, '-', -1) AS UNSIGNED)) AS max_seq
    FROM SC_PATIENT
    WHERE PATIENT_REGISTRATION_NUMBER LIKE ?
  `;

  const like = `PAT-${year}-%`;
  const [rows] = await db.promise().query(sql, [like]);
  const maxSeq = rows?.[0]?.max_seq ? Number(rows[0].max_seq) : 0;
  const nextSeq = maxSeq + 1;
  const padded = String(nextSeq).padStart(5, "0");
  return `PAT-${year}-${padded}`;
};

const insertPatient = async (db, payload) => {
  const {
    PATIENT_REGISTRATION_NUMBER,
    REGISTRATION_DATE,
    PATIENT_NAME,
    CNIC_NUMBER,
    PHONE_NUMBER,
    AGE,
    HUSBAND_NAME,
    ADDRESS_LINE1,
    ADDRESS_LINE2,
    RELIGION,
    LOCATION_ID,
    EDUCATION,
    ESTIMATED_DATE_OF_DELIVERY,
    BASELINE_HAEMOGLOBIN_COUNT,
    PATIENT_PROFESSION,
    PATIENT_MONTHLY_SALARY,
    RESIDENCE_CONDITION,
    RESIDENCE_OWNERSHIP,
    GRAVIDA,
    PARA,
    MISCARRIAGE,
    ANTENATAL_VISITS,
    DATA_SOURCE,
    ADDED_BY,
    UPDATED_BY,
    CREATED_BY_LATITUDE,
    CREATED_BY_LONGITUDE,
  } = payload;

  const sql = `
    INSERT INTO SC_PATIENT (
      PATIENT_REGISTRATION_NUMBER,
      REGISTRATION_DATE,
      IS_DELETED,
      ADDED_BY,
      UPDATED_BY,
      PATIENT_NAME,
      CNIC_NUMBER,
      PHONE_NUMBER,
      AGE,
      HUSBAND_NAME,
      ADDRESS_LINE1,
      ADDRESS_LINE2,
      RELIGION,
      LOCATION_ID,
      EDUCATION,
      ESTIMATED_DATE_OF_DELIVERY,
      BASELINE_HAEMOGLOBIN_COUNT,
      PATIENT_PROFESSION,
      PATIENT_MONTHLY_SALARY,
      RESIDENCE_CONDITION,
      RESIDENCE_OWNERSHIP,
      GRAVIDA,
      PARA,
      MISCARRIAGE,
      ANTENATAL_VISITS,
      DATA_SOURCE,
      CREATED_BY_LATITUDE,
      CREATED_BY_LONGITUDE,
      DATE_CREATED,
      DATE_UPDATED
    ) VALUES (
      ?, ?, b'0', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()
    )`;

  const params = [
    PATIENT_REGISTRATION_NUMBER,
    REGISTRATION_DATE,
    ADDED_BY || null,
    UPDATED_BY || null,
    PATIENT_NAME,
    CNIC_NUMBER || null,
    PHONE_NUMBER,
    AGE || null,
    HUSBAND_NAME || null,
    ADDRESS_LINE1 || null,
    ADDRESS_LINE2 || null,
    RELIGION || null,
    LOCATION_ID || null,
    EDUCATION || null,
    ESTIMATED_DATE_OF_DELIVERY || null,
    BASELINE_HAEMOGLOBIN_COUNT || null,
    PATIENT_PROFESSION || null,
    PATIENT_MONTHLY_SALARY || null,
    RESIDENCE_CONDITION || null,
    RESIDENCE_OWNERSHIP || null,
    GRAVIDA || null,
    PARA || null,
    MISCARRIAGE || null,
    ANTENATAL_VISITS || null,
    DATA_SOURCE,
    CREATED_BY_LATITUDE || null,
    CREATED_BY_LONGITUDE || null,
  ];

  const [result] = await db.promise().execute(sql, params);
  return result;
};

const getPatientById = async (db, id) => {
  const [rows] = await db
    .promise()
    .query(`SELECT * FROM SC_PATIENT WHERE PATIENT_ID = ? AND IS_DELETED = b'0'`, [id]);
  return rows[0] || null;
};

const updatePatient = async (db, id, payload) => {
  const {
    UPDATED_BY,
    PATIENT_NAME,
    CNIC_NUMBER,
    PHONE_NUMBER,
    AGE,
    HUSBAND_NAME,
    ADDRESS_LINE1,
    ADDRESS_LINE2,
    RELIGION,
    LOCATION_ID,
    EDUCATION,
    ESTIMATED_DATE_OF_DELIVERY,
    BASELINE_HAEMOGLOBIN_COUNT,
    PATIENT_PROFESSION,
    PATIENT_MONTHLY_SALARY,
    RESIDENCE_CONDITION,
    RESIDENCE_OWNERSHIP,
    GRAVIDA,
    PARA,
    MISCARRIAGE,
    ANTENATAL_VISITS,
    DATA_SOURCE,
    CREATED_BY_LATITUDE,
    CREATED_BY_LONGITUDE,
  } = payload;

  const sql = `
    UPDATE SC_PATIENT SET
      UPDATED_BY = ?,
      DATE_UPDATED = NOW(),
      PATIENT_NAME = ?,
      CNIC_NUMBER = ?,
      PHONE_NUMBER = ?,
      AGE = ?,
      HUSBAND_NAME = ?,
      ADDRESS_LINE1 = ?,
      ADDRESS_LINE2 = ?,
      RELIGION = ?,
      LOCATION_ID = ?,
      EDUCATION = ?,
      ESTIMATED_DATE_OF_DELIVERY = ?,
      BASELINE_HAEMOGLOBIN_COUNT = ?,
      PATIENT_PROFESSION = ?,
      PATIENT_MONTHLY_SALARY = ?,
      RESIDENCE_CONDITION = ?,
      RESIDENCE_OWNERSHIP = ?,
      GRAVIDA = ?,
      PARA = ?,
      MISCARRIAGE = ?,
      ANTENATAL_VISITS = ?,
      DATA_SOURCE = ?,
      CREATED_BY_LATITUDE = ?,
      CREATED_BY_LONGITUDE = ?
    WHERE PATIENT_ID = ? AND IS_DELETED = 0
  `;


  const params = [
    UPDATED_BY || null,
    PATIENT_NAME,
    CNIC_NUMBER || null,
    PHONE_NUMBER,
    AGE || null,
    HUSBAND_NAME || null,
    ADDRESS_LINE1 || null,
    ADDRESS_LINE2 || null,
    RELIGION || null,
    LOCATION_ID || null,
    EDUCATION || null,
    ESTIMATED_DATE_OF_DELIVERY || null,
    BASELINE_HAEMOGLOBIN_COUNT || null,
    PATIENT_PROFESSION || null,
    PATIENT_MONTHLY_SALARY || null,
    RESIDENCE_CONDITION || null,
    RESIDENCE_OWNERSHIP || null,
    GRAVIDA || null,
    PARA || null,
    MISCARRIAGE || null,
    ANTENATAL_VISITS || null,
    DATA_SOURCE || null,
    CREATED_BY_LATITUDE || null,
    CREATED_BY_LONGITUDE || null,
    id,
  ];

  const [result] = await db.promise().execute(sql, params);
  return result;
};

const softDeletePatient = async (db, id, updatedBy) => {
  const [result] = await db
    .promise()
    .execute(
      `UPDATE SC_PATIENT SET IS_DELETED = b'1', UPDATED_BY = ?, DATE_UPDATED = NOW() WHERE PATIENT_ID = ? AND IS_DELETED = b'0'`,
      [updatedBy || null, id]
    );
  return result;
};

module.exports = {
  getNextPatientRegistrationNumber,
  insertPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  softDeletePatient,
};


