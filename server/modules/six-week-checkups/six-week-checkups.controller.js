const asyncHandler = require("../../config/asyncHandler");
const { HttpError } = require("../../utils/httpError");
const { successResponse } = require("../../utils/apiResponse");
const { getPagination, normalizeSort, buildSearchClause, buildFilterClause } = require("../../utils/queryBuilder");

const {
  insertSixWeekCheckup,
  getAllSixWeekCheckups,
  getSixWeekCheckupById,
  updateSixWeekCheckup,
  softDeleteSixWeekCheckup,
} = require("./six-week-checkups.model");

const ALLOWED_SORT = ["SIX_WEEK_CHECKUP_ID", "DELIVERY_ID", "DATE_CREATED", "DATE_UPDATED"];

const ALLOWED_DATA_SOURCE = new Set(["APP", "WEB"]);

const requireField = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    throw new HttpError(400, `${fieldName} is required`);
  }
  return value;
};

const requireBoolean = (value, fieldName) => {
  // Accept true/false only (strict)
  if (value === undefined || value === null) throw new HttpError(400, `${fieldName} is required`);
  if (typeof value !== "boolean") throw new HttpError(400, `${fieldName} must be boolean`);
  return value;
};

const requireNumber = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    throw new HttpError(400, `${fieldName} is required`);
  }
  const n = Number(value);
  if (!Number.isFinite(n)) throw new HttpError(400, `${fieldName} must be a number`);
  return n;
};

const requireDateTime = (value, fieldName) => {
  if (!value) throw new HttpError(400, `${fieldName} is required`);
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw new HttpError(400, `${fieldName} must be a valid datetime string`);
  return d;
};

const createSixWeekCheckup = asyncHandler(async (req, res) => {
  const body = req.body || {};

  const payload = {
    ADDED_BY: req.user?.user_id ?? null,
    UPDATED_BY: req.user?.user_id ?? null,

    DELIVERY_ID: requireNumber(requireField(body.DELIVERY_ID, "DELIVERY_ID"), "DELIVERY_ID"),

    IS_PATIENT_ALIVE: requireBoolean(body.IS_PATIENT_ALIVE, "IS_PATIENT_ALIVE"),
    PATIENT_DEATH_REASON: requireField(body.PATIENT_DEATH_REASON, "PATIENT_DEATH_REASON"),
    IS_PATIENT_HEALTHY: requireBoolean(body.IS_PATIENT_HEALTHY, "IS_PATIENT_HEALTHY"),
    PATIENT_HEALTH_MORE_DETAILS: requireField(body.PATIENT_HEALTH_MORE_DETAILS, "PATIENT_HEALTH_MORE_DETAILS"),

    IS_BABY_ALIVE: requireBoolean(body.IS_BABY_ALIVE, "IS_BABY_ALIVE"),
    BABY_DEATH_REASON: requireField(body.BABY_DEATH_REASON, "BABY_DEATH_REASON"),
    IS_BABY_HEALTHY: requireBoolean(body.IS_BABY_HEALTHY, "IS_BABY_HEALTHY"),
    BABY_HEALTH_MORE_DETAILS: requireField(body.BABY_HEALTH_MORE_DETAILS, "BABY_HEALTH_MORE_DETAILS"),

    BREAST_FEEDING_DURATION: requireNumber(body.BREAST_FEEDING_DURATION, "BREAST_FEEDING_DURATION"),

    IS_BABY_CORD_HEALTHY: requireBoolean(body.IS_BABY_CORD_HEALTHY, "IS_BABY_CORD_HEALTHY"),
    BABY_CORD_CONDITION_MORE_DETAILS: requireField(body.BABY_CORD_CONDITION_MORE_DETAILS, "BABY_CORD_CONDITION_MORE_DETAILS"),

    FOLLOWUP_DATE: requireDateTime(body.FOLLOWUP_DATE, "FOLLOWUP_DATE"),

    DATA_SOURCE: requireField(body.DATA_SOURCE, "DATA_SOURCE"),
    CREATED_BY_LATITUDE: body.CREATED_BY_LATITUDE ?? null,
    CREATED_BY_LONGITUDE: body.CREATED_BY_LONGITUDE ?? null,
  };

  if (!ALLOWED_DATA_SOURCE.has(payload.DATA_SOURCE)) {
    throw new HttpError(400, "DATA_SOURCE must be only: APP or WEB");
  }

  // Optional numeric validation for latitude/longitude
  if (payload.CREATED_BY_LATITUDE !== null) payload.CREATED_BY_LATITUDE = requireNumber(payload.CREATED_BY_LATITUDE, "CREATED_BY_LATITUDE");
  if (payload.CREATED_BY_LONGITUDE !== null) payload.CREATED_BY_LONGITUDE = requireNumber(payload.CREATED_BY_LONGITUDE, "CREATED_BY_LONGITUDE");

  const result = await insertSixWeekCheckup(req.app.locals.db, payload);
  return res.status(201).json(
    successResponse("Record created successfully", { affectedRows: result.affectedRows }, {})
  );
});

const getSixWeekCheckups = asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const { page, limit, offset } = getPagination(req.query);
  const { sortBy, sortOrder } = normalizeSort(req.query, ALLOWED_SORT, "DATE_CREATED");

  const filterClauseObj = buildFilterClause({
    filters: req.query,
    allowedFilters: {
      delivery_id: { column: "sw.DELIVERY_ID", type: "number" },
    },
  });

  const searchClauseObj = buildSearchClause({ searchFields: [], searchQuery: req.query.search });

  const { rows, total } = await getAllSixWeekCheckups(
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

const getSixWeekCheckupByIdCtrl = asyncHandler(async (req, res) => {
  const row = await getSixWeekCheckupById(req.app.locals.db, req.params.id);
  if (!row) throw new HttpError(404, "Six-week checkup not found");
  return res.status(200).json(successResponse("Data fetched successfully", row, {}));
});

const updateSixWeekCheckupCtrl = asyncHandler(async (req, res) => {
  const body = req.body || {};

  const payload = {
    UPDATED_BY: req.user?.user_id ?? null,

    DELIVERY_ID: requireNumber(requireField(body.DELIVERY_ID, "DELIVERY_ID"), "DELIVERY_ID"),

    IS_PATIENT_ALIVE: requireBoolean(body.IS_PATIENT_ALIVE, "IS_PATIENT_ALIVE"),
    PATIENT_DEATH_REASON: requireField(body.PATIENT_DEATH_REASON, "PATIENT_DEATH_REASON"),
    IS_PATIENT_HEALTHY: requireBoolean(body.IS_PATIENT_HEALTHY, "IS_PATIENT_HEALTHY"),
    PATIENT_HEALTH_MORE_DETAILS: requireField(body.PATIENT_HEALTH_MORE_DETAILS, "PATIENT_HEALTH_MORE_DETAILS"),

    IS_BABY_ALIVE: requireBoolean(body.IS_BABY_ALIVE, "IS_BABY_ALIVE"),
    BABY_DEATH_REASON: requireField(body.BABY_DEATH_REASON, "BABY_DEATH_REASON"),
    IS_BABY_HEALTHY: requireBoolean(body.IS_BABY_HEALTHY, "IS_BABY_HEALTHY"),
    BABY_HEALTH_MORE_DETAILS: requireField(body.BABY_HEALTH_MORE_DETAILS, "BABY_HEALTH_MORE_DETAILS"),

    BREAST_FEEDING_DURATION: requireNumber(body.BREAST_FEEDING_DURATION, "BREAST_FEEDING_DURATION"),

    IS_BABY_CORD_HEALTHY: requireBoolean(body.IS_BABY_CORD_HEALTHY, "IS_BABY_CORD_HEALTHY"),
    BABY_CORD_CONDITION_MORE_DETAILS: requireField(
      body.BABY_CORD_CONDITION_MORE_DETAILS,
      "BABY_CORD_CONDITION_MORE_DETAILS"
    ),

    FOLLOWUP_DATE: requireDateTime(body.FOLLOWUP_DATE, "FOLLOWUP_DATE"),

    DATA_SOURCE: requireField(body.DATA_SOURCE, "DATA_SOURCE"),
    CREATED_BY_LATITUDE: body.CREATED_BY_LATITUDE ?? null,
    CREATED_BY_LONGITUDE: body.CREATED_BY_LONGITUDE ?? null,
  };

  if (!ALLOWED_DATA_SOURCE.has(payload.DATA_SOURCE)) {
    throw new HttpError(400, "DATA_SOURCE must be only: APP or WEB");
  }

  if (payload.CREATED_BY_LATITUDE !== null) {
    payload.CREATED_BY_LATITUDE = requireNumber(payload.CREATED_BY_LATITUDE, "CREATED_BY_LATITUDE");
  }
  if (payload.CREATED_BY_LONGITUDE !== null) {
    payload.CREATED_BY_LONGITUDE = requireNumber(payload.CREATED_BY_LONGITUDE, "CREATED_BY_LONGITUDE");
  }

  const result = await updateSixWeekCheckup(req.app.locals.db, req.params.id, payload);

  if (!result.affectedRows) throw new HttpError(404, "Six-week checkup not found");

  return res.status(200).json(
    successResponse("Record updated successfully", { affectedRows: result.affectedRows }, {})
  );
});

const deleteSixWeekCheckupCtrl = asyncHandler(async (req, res) => {
  const result = await softDeleteSixWeekCheckup(req.app.locals.db, req.params.id, req.user?.user_id);
  if (!result.affectedRows) throw new HttpError(404, "Six-week checkup not found");
  return res.status(200).json(successResponse("Six-week checkup deleted successfully", { affectedRows: result.affectedRows }, {}));
});

module.exports = {
  createSixWeekCheckup,
  getSixWeekCheckups,
  getSixWeekCheckupByIdCtrl,
  updateSixWeekCheckupCtrl,
  deleteSixWeekCheckupCtrl,
};

