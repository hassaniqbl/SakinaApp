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
  softDeletePatient,
} = require("./patients.model");



const { updatePatientService } = require("./patients.service");
const { assertUserExists } = require("./patients.integrity");

// (Used during createPatient validation)





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

  if (!req.body || typeof req.body !== "object") {
    throw new HttpError(400, "Request body must be a valid JSON object");
  }

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
  } = req.body;

  const requiredFields = ["PATIENT_NAME", "CNIC_NUMBER", "PHONE_NUMBER", "AGE", "DATA_SOURCE"];

  const missing = requiredFields.filter((field) => {
    const v = req.body[field];
    return v === undefined || v === null || v === "";
  });

  if (missing.length) {
    throw new HttpError(400, `Missing required fields: ${missing.join(", ")}`);
  }

  const age = requireNumber(AGE, "AGE");

  if (!ALLOWED_DATA_SOURCE.has(DATA_SOURCE)) {
    throw new HttpError(400, "DATA_SOURCE must be only: APP or WEB");
  }

  const year = new Date().getFullYear();
  const PATIENT_REGISTRATION_NUMBER = await getNextPatientRegistrationNumber(db, year);

  const payload = {
    PATIENT_REGISTRATION_NUMBER,
    REGISTRATION_DATE: new Date(),
    IS_DELETED: 0,


    ADDED_BY: req.body?.ADDED_BY ?? req.user?.user_id ?? null,
    UPDATED_BY: req.body?.UPDATED_BY ?? req.user?.user_id ?? null,

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

  // Validate FK only when client explicitly provides values.
  // If you want to rely on req.user later, auth middleware must populate req.user.
  if (req.body?.ADDED_BY !== undefined && req.body?.ADDED_BY !== null && req.body?.ADDED_BY !== "") {
    await assertUserExists(db, payload.ADDED_BY, "ADDED_BY");
  }
  if (req.body?.UPDATED_BY !== undefined && req.body?.UPDATED_BY !== null && req.body?.UPDATED_BY !== "") {
    await assertUserExists(db, payload.UPDATED_BY, "UPDATED_BY");
  }


  const result = await insertPatient(db, payload);

  return res
    .status(201)
    .json(successResponse("Patient created successfully", { affectedRows: result.affectedRows }, {}));
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
  try {
    const { id } = req.params;
    if (!id) throw new HttpError(400, "Patient id is required");

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

      UPDATED_BY,
    } = req.body || {};

    if (!PATIENT_NAME) throw new HttpError(400, "PATIENT_NAME is required");

    if (DATA_SOURCE !== undefined) {
      if (!ALLOWED_DATA_SOURCE.has(DATA_SOURCE)) {
        throw new HttpError(400, "DATA_SOURCE must be only: APP or WEB");
      }
    }

    // UPDATED_BY required; do not fail when UPDATED_BY = 1
    if (UPDATED_BY === undefined || UPDATED_BY === null || UPDATED_BY === "") {
      throw new HttpError(400, "UPDATED_BY is required");
    }

    const updatedByNum = Number(UPDATED_BY);
    if (!Number.isFinite(updatedByNum)) {
      throw new HttpError(400, "UPDATED_BY must be a number");
    }

    // UPDATED_BY is a FK to SC_USER.USER_ID.
    // UPDATED_BY FK validation is performed in service layer.

    const payload = {

      UPDATED_BY: updatedByNum,

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

    const result = await updatePatientService(req.app.locals.db, id, payload);


    if (!result.affectedRows) throw new HttpError(404, "Patient not found");

    return res
      .status(200)
      .json({
        success: true,
        message: "Patient updated successfully",
        data: {},
      });
  } catch (err) {
    if (err instanceof HttpError) {
      const statusCode = err.statusCode || 500;
      return res
        .status(statusCode)
        .json({ success: false, message: err.message, error: { statusCode } });
    }

    // Avoid leaking raw SQL FK errors to clients.
    if (err?.message && String(err.message).toLowerCase().includes("foreign key constraint fails")) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid UPDATED_BY user", error: { statusCode: 400 } });
    }


    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: {
        message: err?.message,
        sqlMessage: err?.sqlMessage,
      },
    });
  }
});

const deletePatientCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await softDeletePatient(req.app.locals.db, id, req.user?.user_id);
  if (!result.affectedRows) throw new HttpError(404, "Patient not found");
  return res
    .status(200)
    .json(successResponse("Patient deleted successfully", { affectedRows: result.affectedRows }, {}));
});

module.exports = {
  createPatient,
  getPatients,
  getPatientByIdCtrl,
  updatePatientCtrl,
  deletePatientCtrl,
};

