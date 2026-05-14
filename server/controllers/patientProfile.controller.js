const asyncHandler = require("../config/asyncHandler");
const {
  insertPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require("../models/patientProfile.model");

const toNullable = (v) => {
  if (v === undefined || v === null) return null;
  if (typeof v === "string" && v.trim() === "") return null;
  return v;
};

const safeInt = (v) => {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
};

const safeLat = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  if (n < -90 || n > 90) return null;
  return n;
};

const safeLng = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  if (n < -180 || n > 180) return null;
  return n;
};

// Maps requested API fields => existing PATIENT_PROFILE columns.
const mapRequestToPatientProfile = (body) => {
  return {
    patient_id: body.patient_id,

    registration_date: toNullable(body.date_of_birth), // best-effort mapping placeholder

    patient_name: [body.first_name, body.last_name].filter(Boolean).join(" ") || toNullable(body.first_name) || toNullable(body.last_name),
    cnic_number: toNullable(body.blood_group), // no direct match; best-effort
    phone: toNullable(body.phone),
    religion: null,
    patient_profession: null,
    patient_monthly_salary: null,
    age: null,
    address: toNullable(body.address),
    city: toNullable(body.city),

    estimated_date_of_delivery: null,
    baseline_haemoglobin_count: null,
    education: null,
    residence_condition: null,
    residence_ownership: null,
    husband_name: toNullable(body.emergency_contact_name),

    gravida: null,
    para: null,
    miscarrriage: null,
    antenatal_visits: null,

    created_by_latitude: body.created_by_latitude !== undefined ? safeLat(body.created_by_latitude) : null,
    created_by_longitude: body.created_by_longitude !== undefined ? safeLng(body.created_by_longitude) : null,

    created_at: null,
    updated_at: null,
    created_by: null,
    updated_by: null,
  };
};

// POST /patients
const createPatient = asyncHandler(async (req, res) => {
  const { patient_id, first_name } = req.body;

  if (!patient_id) {
    return res.status(400).json({ message: "patient_id is required" });
  }
  if (!first_name) {
    return res.status(400).json({ message: "first_name is required" });
  }

  const payload = mapRequestToPatientProfile(req.body);
  const db = req.app.locals.db;

  const result = await insertPatient(db, payload);
  return res.status(201).json({
    message: "Patient Created Successfully",
    affectedRows: result.affectedRows,
  });
});

// GET /patients
const getPatients = asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const rows = await getAllPatients(db);
  return res.status(200).json(rows);
});

// GET /patients/:id
const getPatientByIdCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = req.app.locals.db;

  const row = await getPatientById(db, id);
  if (!row) {
    return res.status(404).json({ message: "Patient not found" });
  }

  return res.status(200).json(row);
});

// PUT /patients/:id
const updatePatientCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "id is required" });

  const payload = mapRequestToPatientProfile(req.body);
  const db = req.app.locals.db;

  const result = await updatePatient(db, id, payload);
  if (!result.affectedRows) {
    return res.status(404).json({ message: "Patient not found" });
  }

  return res.status(200).json({ message: "Patient Updated Successfully", affectedRows: result.affectedRows });
});

// DELETE /patients/:id
const deletePatientCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = req.app.locals.db;

  const result = await deletePatient(db, id);
  if (!result.affectedRows) {
    return res.status(404).json({ message: "Patient not found" });
  }

  return res.status(200).json({ message: "Patient Deleted Successfully", affectedRows: result.affectedRows });
});

module.exports = {
  createPatient,
  getPatients,
  getPatientByIdCtrl,
  updatePatientCtrl,
  deletePatientCtrl,
};

