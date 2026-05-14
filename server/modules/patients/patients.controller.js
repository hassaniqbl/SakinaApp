const asyncHandler = require("../../config/asyncHandler");
const { HttpError } = require("../../utils/httpError");
const { successResponse } = require("../../utils/apiResponse");
const { getPagination, normalizeSort, buildSearchClause, buildFilterClause } = require("../../utils/queryBuilder");

const {
  insertPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  softDeletePatient,
} = require("./patients.model");

const ALLOWED_SORT = ["PATIENT_ID", "PATIENT_NAME", "PHONE_NUMBER", "LOCATION_ID", "DATE_CREATED", "DATE_UPDATED"];

const searchFields = ["p.PATIENT_NAME", "p.CNIC_NUMBER", "p.PHONE_NUMBER"];

const createPatient = asyncHandler(async (req, res) => {
  const { PATIENT_NAME, CNIC_NUMBER, PHONE_NUMBER, LOCATION_ID } = req.body || {};
  if (!PATIENT_NAME) throw new HttpError(400, "PATIENT_NAME is required");

  const payload = {
    ADDED_BY: req.user?.user_id ?? null,
    UPDATED_BY: req.user?.user_id ?? null,
    PATIENT_NAME,
    CNIC_NUMBER: CNIC_NUMBER || null,
    PHONE_NUMBER: PHONE_NUMBER || null,
    LOCATION_ID: LOCATION_ID || null,
  };

  const db = req.app.locals.db;
  const result = await insertPatient(db, payload);

  return res.status(201).json(successResponse("Patient created successfully", { affectedRows: result.affectedRows }, {}));
});

const getPatients = asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const { page, limit, offset } = getPagination(req.query);
  const { sortBy, sortOrder } = normalizeSort(req.query, ALLOWED_SORT, "DATE_CREATED");

  const filterClauseObj = buildFilterClause({
    filters: req.query,
    allowedFilters: {
      location_id: { column: "p.LOCATION_ID", type: "number" },
    },
  });

  const searchClauseObj = buildSearchClause({
    searchFields,
    searchQuery: req.query.search,
  });

  const { rows, total } = await getAllPatients(
    db,
    { page, limit, offset },
    {
      searchClause: searchClauseObj.clause ? `(${searchClauseObj.clause})` : "",
      searchParams: searchClauseObj.params,
    },
    {
      filterClause: filterClauseObj.clause ? `(${filterClauseObj.clause})` : "",
      filterParams: filterClauseObj.params,
    },
    { sortBy, sortOrder }
  );

  return res.status(200).json(
    successResponse("Data fetched successfully", rows, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 0,
    })
  );
});

const getPatientByIdCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const row = await getPatientById(req.app.locals.db, id);
  if (!row) throw new HttpError(404, "Patient not found");
  return res.status(200).json(successResponse("Data fetched successfully", row, {}));
});

const updatePatientCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { PATIENT_NAME, CNIC_NUMBER, PHONE_NUMBER, LOCATION_ID } = req.body || {};
  if (!PATIENT_NAME) throw new HttpError(400, "PATIENT_NAME is required");

  const result = await updatePatient(req.app.locals.db, id, {
    UPDATED_BY: req.user?.user_id ?? null,
    PATIENT_NAME,
    CNIC_NUMBER: CNIC_NUMBER || null,
    PHONE_NUMBER: PHONE_NUMBER || null,
    LOCATION_ID: LOCATION_ID || null,
  });

  if (!result.affectedRows) throw new HttpError(404, "Patient not found");

  return res.status(200).json(successResponse("Patient updated successfully", { affectedRows: result.affectedRows }, {}));
});

const deletePatientCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await softDeletePatient(req.app.locals.db, id, req.user?.user_id);
  if (!result.affectedRows) throw new HttpError(404, "Patient not found");
  return res.status(200).json(successResponse("Patient deleted successfully", { affectedRows: result.affectedRows }, {}));
});

module.exports = {
  createPatient,
  getPatients,
  getPatientByIdCtrl,
  updatePatientCtrl,
  deletePatientCtrl,
};

