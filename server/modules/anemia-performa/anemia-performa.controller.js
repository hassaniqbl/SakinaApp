const asyncHandler = require("../../config/asyncHandler");
const { HttpError } = require("../../utils/httpError");
const { successResponse } = require("../../utils/apiResponse");
const { getPagination, normalizeSort, buildSearchClause, buildFilterClause } = require("../../utils/queryBuilder");

const {
  insertAnemiaPerforma,
  getAllAnemiaPerformas,
  getAnemiaPerformaById,
  updateAnemiaPerforma,
  softDeleteAnemiaPerforma,
} = require("./anemia-performa.model");

const ALLOWED_SORT = ["ANEMIA_PERFORMA_ID", "ANEMIA_CHECKUP_ID", "DATE_CREATED", "DATE_UPDATED"];

const ALLOWED_DATA_SOURCE = new Set(["APP", "WEB"]);

const requireNumberOrNull = (value, fieldName) => {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) throw new HttpError(400, `${fieldName} must be a number`);
  return n;
};

const validateDataSourceIfProvided = (value) => {
  if (value === undefined || value === null || value === "") return null;
  if (!ALLOWED_DATA_SOURCE.has(value)) throw new HttpError(400, "DATA_SOURCE must be only: APP or WEB");
  return value;
};

const createAnemiaPerforma = asyncHandler(async (req, res) => {
  const {
    ANEMIA_CHECKUP_ID,
    INJECTION_BRAND,
    INJECTION_DOSE,
    IV_IRON_QUANTITY,
    INJECTION_DATE,
    REACTION_AFTER_INJECTION,
    DATA_SOURCE,
    CREATED_BY_LATITUDE,
    CREATED_BY_LONGITUDE,
  } = req.body || {};

  if (!ANEMIA_CHECKUP_ID) throw new HttpError(400, "ANEMIA_CHECKUP_ID is required");

  const payload = {
    ADDED_BY: req.user?.user_id ?? null,
    UPDATED_BY: req.user?.user_id ?? null,

    ANEMIA_CHECKUP_ID,
    INJECTION_BRAND: requireNumberOrNull(INJECTION_BRAND, "INJECTION_BRAND"),
    INJECTION_DOSE: requireNumberOrNull(INJECTION_DOSE, "INJECTION_DOSE"),
    IV_IRON_QUANTITY: requireNumberOrNull(IV_IRON_QUANTITY, "IV_IRON_QUANTITY"),
    INJECTION_DATE: INJECTION_DATE ?? null,
    REACTION_AFTER_INJECTION: REACTION_AFTER_INJECTION ?? null,

    DATA_SOURCE: validateDataSourceIfProvided(DATA_SOURCE),
    CREATED_BY_LATITUDE: requireNumberOrNull(CREATED_BY_LATITUDE, "CREATED_BY_LATITUDE"),
    CREATED_BY_LONGITUDE: requireNumberOrNull(CREATED_BY_LONGITUDE, "CREATED_BY_LONGITUDE"),
  };

  const result = await insertAnemiaPerforma(req.app.locals.db, payload);
  return res.status(201).json(successResponse("Anemia performa created successfully", { affectedRows: result.affectedRows }, {}));
});

const getAnemiaPerformas = asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const { page, limit, offset } = getPagination(req.query);
  const { sortBy, sortOrder } = normalizeSort(req.query, ALLOWED_SORT, "DATE_CREATED");

  const filterClauseObj = buildFilterClause({
    filters: req.query,
    allowedFilters: {
      anemia_checkup_id: { column: "ap.ANEMIA_CHECKUP_ID", type: "number" },
    },
  });

  const searchClauseObj = buildSearchClause({ searchFields: [], searchQuery: req.query.search });

  const { rows, total } = await getAllAnemiaPerformas(
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

const getAnemiaPerformaByIdCtrl = asyncHandler(async (req, res) => {
  const row = await getAnemiaPerformaById(req.app.locals.db, req.params.id);
  if (!row) throw new HttpError(404, "Anemia performa not found");
  return res.status(200).json(successResponse("Data fetched successfully", row, {}));
});

const updateAnemiaPerformaCtrl = asyncHandler(async (req, res) => {
  const {
    ANEMIA_CHECKUP_ID,
    INJECTION_BRAND,
    INJECTION_DOSE,
    IV_IRON_QUANTITY,
    INJECTION_DATE,
    REACTION_AFTER_INJECTION,
    DATA_SOURCE,
    CREATED_BY_LATITUDE,
    CREATED_BY_LONGITUDE,
  } = req.body || {};

  if (!ANEMIA_CHECKUP_ID) throw new HttpError(400, "ANEMIA_CHECKUP_ID is required");

  const payload = {
    UPDATED_BY: req.user?.user_id ?? null,

    ANEMIA_CHECKUP_ID,
    INJECTION_BRAND: requireNumberOrNull(INJECTION_BRAND, "INJECTION_BRAND"),
    INJECTION_DOSE: requireNumberOrNull(INJECTION_DOSE, "INJECTION_DOSE"),
    IV_IRON_QUANTITY: requireNumberOrNull(IV_IRON_QUANTITY, "IV_IRON_QUANTITY"),
    INJECTION_DATE: INJECTION_DATE ?? null,
    REACTION_AFTER_INJECTION: REACTION_AFTER_INJECTION ?? null,

    DATA_SOURCE: validateDataSourceIfProvided(DATA_SOURCE),
    CREATED_BY_LATITUDE: requireNumberOrNull(CREATED_BY_LATITUDE, "CREATED_BY_LATITUDE"),
    CREATED_BY_LONGITUDE: requireNumberOrNull(CREATED_BY_LONGITUDE, "CREATED_BY_LONGITUDE"),
  };

  const result = await updateAnemiaPerforma(req.app.locals.db, req.params.id, payload);

  if (!result.affectedRows) throw new HttpError(404, "Anemia performa not found");

  return res.status(200).json(successResponse("Anemia performa updated successfully", { affectedRows: result.affectedRows }, {}));
});

const deleteAnemiaPerformaCtrl = asyncHandler(async (req, res) => {
  const result = await softDeleteAnemiaPerforma(req.app.locals.db, req.params.id, req.user?.user_id);
  if (!result.affectedRows) throw new HttpError(404, "Anemia performa not found");
  return res.status(200).json(successResponse("Anemia performa deleted successfully", { affectedRows: result.affectedRows }, {}));
});

module.exports = {
  createAnemiaPerforma,
  getAnemiaPerformas,
  getAnemiaPerformaByIdCtrl,
  updateAnemiaPerformaCtrl,
  deleteAnemiaPerformaCtrl,
};

