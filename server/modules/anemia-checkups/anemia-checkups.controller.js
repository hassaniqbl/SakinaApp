const asyncHandler = require("../../config/asyncHandler");
const { HttpError } = require("../../utils/httpError");
const { successResponse } = require("../../utils/apiResponse");
const { getPagination, normalizeSort, buildSearchClause, buildFilterClause } = require("../../utils/queryBuilder");

const {
  insertAnemiaCheckup,
  getAllAnemiaCheckups,
  getAnemiaCheckupById,
  updateAnemiaCheckup,
  softDeleteAnemiaCheckup,
} = require("./anemia-checkups.model");

const ALLOWED_SORT = ["ANEMIA_CHECKUP_ID", "PATIENT_ID", "DATE_CREATED", "DATE_UPDATED"];

const ALLOWED_DATA_SOURCE = new Set(["APP", "WEB"]);

const requireNumberOrNull = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) throw new HttpError(400, "HAEMOGLOBIN_COUNT must be a number");
  return n;
};

const validateDataSourceIfProvided = (value) => {
  if (value === undefined || value === null || value === "") return null;
  if (!ALLOWED_DATA_SOURCE.has(value)) throw new HttpError(400, "DATA_SOURCE must be only: APP or WEB");
  return value;
};

const createAnemiaCheckup = asyncHandler(async (req, res) => {
  const {
    PATIENT_ID,
    CHECKUP_DATE,
    HAEMOGLOBIN_COUNT,
    ANY_OTHER_SYMPTOMS,
    DATA_SOURCE,
    CREATED_BY_LATITUDE,
    CREATED_BY_LONGITUDE,
  } = req.body || {};

  if (!PATIENT_ID) throw new HttpError(400, "PATIENT_ID is required");

  const payload = {
    ADDED_BY: req.user?.user_id ?? null,
    UPDATED_BY: req.user?.user_id ?? null,

    PATIENT_ID,
    CHECKUP_DATE: CHECKUP_DATE ?? null,
    HAEMOGLOBIN_COUNT: requireNumberOrNull(HAEMOGLOBIN_COUNT),
    ANY_OTHER_SYMPTOMS: ANY_OTHER_SYMPTOMS ?? null,
    DATA_SOURCE: validateDataSourceIfProvided(DATA_SOURCE),
    CREATED_BY_LATITUDE: CREATED_BY_LATITUDE ?? null,
    CREATED_BY_LONGITUDE: CREATED_BY_LONGITUDE ?? null,
  };

  const result = await insertAnemiaCheckup(req.app.locals.db, payload);
  return res
    .status(201)
    .json(successResponse("Anemia checkup created successfully", { affectedRows: result.affectedRows }, {}));
});


const getAnemiaCheckups = asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const { page, limit, offset } = getPagination(req.query);
  const { sortBy, sortOrder } = normalizeSort(req.query, ALLOWED_SORT, "DATE_CREATED");

  const filterClauseObj = buildFilterClause({
    filters: req.query,
    allowedFilters: {
      patient_id: { column: "a.PATIENT_ID", type: "number" },
    },
  });

  const searchClauseObj = buildSearchClause({
    searchFields: [],
    searchQuery: req.query.search,
  });

  const { rows, total } = await getAllAnemiaCheckups(
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

const getAnemiaCheckupByIdCtrl = asyncHandler(async (req, res) => {
  const row = await getAnemiaCheckupById(req.app.locals.db, req.params.id);
  if (!row) throw new HttpError(404, "Anemia checkup not found");
  return res.status(200).json(successResponse("Data fetched successfully", row, {}));
});

const updateAnemiaCheckupCtrl = asyncHandler(async (req, res) => {
  const {
    PATIENT_ID,
    CHECKUP_DATE,
    HAEMOGLOBIN_COUNT,
    ANY_OTHER_SYMPTOMS,
    DATA_SOURCE,
    CREATED_BY_LATITUDE,
    CREATED_BY_LONGITUDE,
  } = req.body || {};

  if (!PATIENT_ID) throw new HttpError(400, "PATIENT_ID is required");

  const payload = {
    UPDATED_BY: req.user?.user_id ?? null,

    PATIENT_ID,
    CHECKUP_DATE: CHECKUP_DATE ?? null,
    HAEMOGLOBIN_COUNT: requireNumberOrNull(HAEMOGLOBIN_COUNT),
    ANY_OTHER_SYMPTOMS: ANY_OTHER_SYMPTOMS ?? null,
    DATA_SOURCE: validateDataSourceIfProvided(DATA_SOURCE),
    CREATED_BY_LATITUDE: CREATED_BY_LATITUDE ?? null,
    CREATED_BY_LONGITUDE: CREATED_BY_LONGITUDE ?? null,
  };

  const result = await updateAnemiaCheckup(req.app.locals.db, req.params.id, payload);

  if (!result.affectedRows) throw new HttpError(404, "Anemia checkup not found");

  return res
    .status(200)
    .json(successResponse("Anemia checkup updated successfully", { affectedRows: result.affectedRows }, {}));
});


const deleteAnemiaCheckupCtrl = asyncHandler(async (req, res) => {
  const result = await softDeleteAnemiaCheckup(req.app.locals.db, req.params.id, req.user?.user_id);
  if (!result.affectedRows) throw new HttpError(404, "Anemia checkup not found");
  return res.status(200).json(successResponse("Anemia checkup deleted successfully", { affectedRows: result.affectedRows }, {}));
});

module.exports = {
  createAnemiaCheckup,
  getAnemiaCheckups,
  getAnemiaCheckupByIdCtrl,
  updateAnemiaCheckupCtrl,
  deleteAnemiaCheckupCtrl,
};

