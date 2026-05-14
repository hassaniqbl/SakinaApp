const { createDbConnection } = require("../config/db");

// Note: in server.js we also keep a connection on app.locals.db.
// This model supports both patterns: pass in db or use a new connection.

const getDb = (db) => db || createDbConnection();

const insertPatient = async (db, payload) => {
  const conn = getDb(db);

  const sql = `INSERT INTO PATIENT_PROFILE (
    PATIENT_REGISTRATION_NUMBER,
    REGISTRATION_DATE,
    PATIENT_NAME,
    CNIC_NUMBER,
    PHONE_NUMBER,
    RELIGION,
    PATIENT_PROFESSION,
    PATIENT_MONTHLY_SALARY,
    AGE,
    ADDRESS,
    LOCATION,
    ESTIMATED_DATE_OF_DELIVERY,
    BASELINE_HAEMOGLOBIN_COUNT,
    EDUCATION,
    RESIDENCE_CONDITION,
    RESIDENCE_OWNERSHIP,
    HUSBAND_NAME,
    GRAVIDA,
    PARA,
    MISCARRIAGE,
    ANTENATAL_VISITS,
    CREATED_BY_LATITUDE,
    CREATED_BY_LONGITUDE,
    CREATED_AT,
    UPDATED_AT,
    CREATED_BY,
    UPDATED_BY
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
  )`;

  const params = [
    payload.patient_id,
    payload.registration_date || null,
    payload.patient_name || null,
    payload.cnic_number || null,
    payload.phone || null,
    payload.religion || null,
    payload.patient_profession || null,
    payload.patient_monthly_salary || null,
    payload.age || null,
    payload.address || null,
    payload.city || null,
    payload.estimated_date_of_delivery || null,
    payload.baseline_haemoglobin_count || null,
    payload.education || null,
    payload.residence_condition || null,
    payload.residence_ownership || null,
    payload.husband_name || null,
    payload.gravida || null,
    payload.para || null,
    payload.miscarrriage || null,
    payload.antenatal_visits || null,
    payload.created_by_latitude || null,
    payload.created_by_longitude || null,
    payload.created_at || null,
    payload.updated_at || null,
    payload.created_by || null,
    payload.updated_by || null,
  ];

  const [result] = await conn.promise().execute(sql, params);
  return result;
};

const getAllPatients = async (db) => {
  const conn = getDb(db);
  const [rows] = await conn
    .promise()
    .query("SELECT * FROM PATIENT_PROFILE ORDER BY REGISTRATION_DATE DESC");
  return rows;
};

const getPatientById = async (db, id) => {
  const conn = getDb(db);
  const [rows] = await conn
    .promise()
    .query("SELECT * FROM PATIENT_PROFILE WHERE PATIENT_REGISTRATION_NUMBER = ?", [id]);
  return rows[0] || null;
};

const updatePatient = async (db, id, payload) => {
  const conn = getDb(db);

  const sql = `UPDATE PATIENT_PROFILE SET
    REGISTRATION_DATE = ?,
    PATIENT_NAME = ?,
    CNIC_NUMBER = ?,
    PHONE_NUMBER = ?,
    RELIGION = ?,
    PATIENT_PROFESSION = ?,
    PATIENT_MONTHLY_SALARY = ?,
    AGE = ?,
    ADDRESS = ?,
    LOCATION = ?,
    ESTIMATED_DATE_OF_DELIVERY = ?,
    BASELINE_HAEMOGLOBIN_COUNT = ?,
    EDUCATION = ?,
    RESIDENCE_CONDITION = ?,
    RESIDENCE_OWNERSHIP = ?,
    HUSBAND_NAME = ?,
    GRAVIDA = ?,
    PARA = ?,
    MISCARRIAGE = ?,
    ANTENATAL_VISITS = ?,
    CREATED_BY_LATITUDE = ?,
    CREATED_BY_LONGITUDE = ?,
    CREATED_AT = ?,
    UPDATED_AT = ?,
    CREATED_BY = ?,
    UPDATED_BY = ?
  WHERE PATIENT_REGISTRATION_NUMBER = ?`;

  const params = [
    payload.registration_date || null,
    payload.patient_name || null,
    payload.cnic_number || null,
    payload.phone || null,
    payload.religion || null,
    payload.patient_profession || null,
    payload.patient_monthly_salary || null,
    payload.age || null,
    payload.address || null,
    payload.city || null,
    payload.estimated_date_of_delivery || null,
    payload.baseline_haemoglobin_count || null,
    payload.education || null,
    payload.residence_condition || null,
    payload.residence_ownership || null,
    payload.husband_name || null,
    payload.gravida || null,
    payload.para || null,
    payload.miscarrriage || null,
    payload.antenatal_visits || null,
    payload.created_by_latitude || null,
    payload.created_by_longitude || null,
    payload.created_at || null,
    payload.updated_at || null,
    payload.created_by || null,
    payload.updated_by || null,
    id,
  ];

  const [result] = await conn.promise().execute(sql, params);
  return result;
};

const deletePatient = async (db, id) => {
  const conn = getDb(db);
  const [result] = await conn
    .promise()
    .execute("DELETE FROM PATIENT_PROFILE WHERE PATIENT_REGISTRATION_NUMBER = ?", [id]);
  return result;
};

module.exports = {
  insertPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};

