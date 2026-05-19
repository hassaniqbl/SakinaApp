const asyncHandler = require("../../config/asyncHandler");
const { HttpError } = require("../../utils/httpError");
const { successResponse } = require("../../utils/apiResponse");
const {
  getPagination,
  normalizeSort,
  buildSearchClause,
  buildFilterClause,
} = require("../../utils/queryBuilder");

const {
  getNextPatientRegistrationNumber,
  insertPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  softDeletePatient,
} = require("./patients.model");

const ALLOWED_SORT = [
  "PATIENT_ID",
  "PATIENT_NAME",
  "PHONE_NUMBER",
  "LOCATION_ID",
  "DATE_CREATED",
  "DATE_UPDATED",
];

const searchFields = ["p.PATIENT_NAME", "p.CNIC_NUMBER", "p.PHONE_NUMBER"];

const ALLOWED_DATA_SOURCE = new Set(["APP", "WEB"]);

const requireString = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    throw new HttpError(400, `${fieldName} is required`);
  }
  if (typeof value !== "string") throw new HttpError(400, `${fieldName} must be a string`);
  return value;
};

const requirePhone = (value) => {
  // Spec only requires non-empty; keep type flexible.
  if (value === undefined || value === null || value === "") {
    throw new HttpError(400, "PHONE_NUMBER is required");
  }
  return String(value);
};


const requireNumber = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    throw new HttpError(400, `${fieldName} is required`);
  }
  const n = Number(value);
  if (!Number.isFinite(n)) throw new HttpError(400, `${fieldName} must be a number`);
  return n;
};

const createPatient = asyncHandler(async (req, res) => {
  const db = req.app.locals.db;

  const {
    PATIENT_NAME,
    CNIC_NUMBER,
    PHONE_NUMBER,
    AGE,
    DATA_SOURCE,
    // optional fields
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
    CREATED_BY_LATITUDE,
    CREATED_BY_LONGITUDE,
    // DO NOT accept IS_DELETED/REGISTRATION_DATE from client per spec
  } = req.body || {};

  if (!PATIENT_NAME) throw new HttpError(400, "PATIENT_NAME is required");
  if (!CNIC_NUMBER) throw new HttpError(400, "CNIC_NUMBER is required");
  if (!PHONE_NUMBER) throw new HttpError(400, "PHONE_NUMBER is required");

  const age = requireNumber(AGE, "AGE");

  if (!DATA_SOURCE) throw new HttpError(400, "DATA_SOURCE is required");
  if (!ALLOWED_DATA_SOURCE.has(DATA_SOURCE)) {
    throw new HttpError(400, "DATA_SOURCE must be only: APP or WEB");
  }

  // Generate PAT-YYYY-XXXXX (per-year sequence)
  const year = new Date().getFullYear();
  const PATIENT_REGISTRATION_NUMBER = await getNextPatientRegistrationNumber(db, year);

  const payload = {
    PATIENT_REGISTRATION_NUMBER,
    REGISTRATION_DATE: new Date(), // model inserts as provided (stored as DATETIME)
    IS_DELETED: 0,

    ADDED_BY: req.user?.user_id ?? null,
    UPDATED_BY: req.user?.user_id ?? null,

    PATIENT_NAME,
    CNIC_NUMBER,
    PHONE_NUMBER,
    AGE: age,

    HUSBAND_NAME: HUSBAND_NAME ?? null,
    ADDRESS_LINE1: ADDRESS_LINE1 ?? null,
    ADDRESS_LINE2: ADDRESS_LINE2 ?? null,
    RELIGION: RELIGION ?? null,
    LOCATION_ID: LOCATION_ID ?? null,
    EDUCATION: EDUCATION ?? null,
    ESTIMATED_DATE_OF_DELIVERY: ESTIMATED_DATE_OF_DELIVERY ?? null,
    BASELINE_HAEMOGLOBIN_COUNT: BASELINE_HAEMOGLOBIN_COUNT ?? null,
    PATIENT_PROFESSION: PATIENT_PROFESSION ?? null,
    PATIENT_MONTHLY_SALARY: PATIENT_MONTHLY_SALARY ?? null,
    RESIDENCE_CONDITION: RESIDENCE_CONDITION ?? null,
    RESIDENCE_OWNERSHIP: RESIDENCE_OWNERSHIP ?? null,
    GRAVIDA: GRAVIDA ?? null,
    PARA: PARA ?? null,
    MISCARRIAGE: MISCARRIAGE ?? null,
    ANTENATAL_VISITS: ANTENATAL_VISITS ?? null,

    DATA_SOURCE,
    CREATED_BY_LATITUDE: CREATED_BY_LATITUDE ?? null,
    CREATED_BY_LONGITUDE: CREATED_BY_LONGITUDE ?? null,
  };

  const result = await insertPatient(db, payload);
  return res
    .status(201)
    .json(
      successResponse(
        "Patient created successfully",
        { affectedRows: result.affectedRows },
        {}
      )
    );
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
  const {
    PATIENT_NAME,
    CNIC_NUMBER,
    PHONE_NUMBER,
    AGE,
    DATA_SOURCE,
    // optional fields
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
    CREATED_BY_LATITUDE,
    CREATED_BY_LONGITUDE,
  } = req.body || {};

  if (!PATIENT_NAME) throw new HttpError(400, "PATIENT_NAME is required");

  if (DATA_SOURCE !== undefined) {
    if (!ALLOWED_DATA_SOURCE.has(DATA_SOURCE)) {
      throw new HttpError(400, "DATA_SOURCE must be only: APP or WEB");
    }
  }

  // spec: UPDATED_BY required
  if (!req.user?.user_id) throw new HttpError(400, "UPDATED_BY is required");

  const payload = {
    UPDATED_BY: req.user.user_id,

    // pass only updatable fields; model won't touch PATIENT_ID/REGISTRATION_NUMBER/DATE_CREATED
    PATIENT_NAME,
    CNIC_NUMBER: CNIC_NUMBER ?? null,
    PHONE_NUMBER: PHONE_NUMBER ?? null,
    AGE: AGE !== undefined ? requireNumber(AGE, "AGE") : null,

    HUSBAND_NAME: HUSBAND_NAME ?? null,
    ADDRESS_LINE1: ADDRESS_LINE1 ?? null,
    ADDRESS_LINE2: ADDRESS_LINE2 ?? null,
    RELIGION: RELIGION ?? null,
    LOCATION_ID: LOCATION_ID ?? null,
    EDUCATION: EDUCATION ?? null,
    ESTIMATED_DATE_OF_DELIVERY: ESTIMATED_DATE_OF_DELIVERY ?? null,
    BASELINE_HAEMOGLOBIN_COUNT: BASELINE_HAEMOGLOBIN_COUNT ?? null,
    PATIENT_PROFESSION: PATIENT_PROFESSION ?? null,
    PATIENT_MONTHLY_SALARY: PATIENT_MONTHLY_SALARY ?? null,
    RESIDENCE_CONDITION: RESIDENCE_CONDITION ?? null,
    RESIDENCE_OWNERSHIP: RESIDENCE_OWNERSHIP ?? null,
    GRAVIDA: GRAVIDA ?? null,
    PARA: PARA ?? null,
    MISCARRIAGE: MISCARRIAGE ?? null,
    ANTENATAL_VISITS: ANTENATAL_VISITS ?? null,

    DATA_SOURCE: DATA_SOURCE !== undefined ? DATA_SOURCE : null,
    CREATED_BY_LATITUDE: CREATED_BY_LATITUDE ?? null,
    CREATED_BY_LONGITUDE: CREATED_BY_LONGITUDE ?? null,
  };

  const result = await updatePatient(req.app.locals.db, id, payload);

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

