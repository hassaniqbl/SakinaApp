const asyncHandler = require("../../config/asyncHandler");
const { HttpError } = require("../../utils/httpError");
const { successResponse } = require("../../utils/apiResponse");
const { getPagination, normalizeSort, buildSearchClause, buildFilterClause } = require("../../utils/queryBuilder");

const {
  insertAnnualCheckup,
  getAllAnnualCheckups,
  getAnnualCheckupById,
  updateAnnualCheckup,
  softDeleteAnnualCheckup,
} = require("./annual-checkups.model");

const ALLOWED_SORT = ["ANNUAL_CHECKUP_ID", "DELIVERY_ID", "DATE_CREATED", "DATE_UPDATED"];

const createAnnualCheckup = asyncHandler(async (req, res) => {
  const { DELIVERY_ID } = req.body || {};
  if (!DELIVERY_ID) throw new HttpError(400, "DELIVERY_ID is required");

  const payload = {
    ADDED_BY: req.user?.user_id ?? null,
    UPDATED_BY: req.user?.user_id ?? null,
    DELIVERY_ID,
  };

  const result = await insertAnnualCheckup(req.app.locals.db, payload);
  return res.status(201).json(successResponse("Annual checkup created successfully", { affectedRows: result.affectedRows }, {}));
});

const getAnnualCheckups = asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const { page, limit, offset } = getPagination(req.query);
  const { sortBy, sortOrder } = normalizeSort(req.query, ALLOWED_SORT, "DATE_CREATED");

  const filterClauseObj = buildFilterClause({
    filters: req.query,
    allowedFilters: {
      delivery_id: { column: "ac.DELIVERY_ID", type: "number" },
    },
  });

  const searchClauseObj = buildSearchClause({ searchFields: [], searchQuery: req.query.search });

  const { rows, total } = await getAllAnnualCheckups(
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

const getAnnualCheckupByIdCtrl = asyncHandler(async (req, res) => {
  const row = await getAnnualCheckupById(req.app.locals.db, req.params.id);
  if (!row) throw new HttpError(404, "Annual checkup not found");
  return res.status(200).json(successResponse("Data fetched successfully", row, {}));
});

const updateAnnualCheckupCtrl = asyncHandler(async (req, res) => {
  const { DELIVERY_ID } = req.body || {};
  if (!DELIVERY_ID) throw new HttpError(400, "DELIVERY_ID is required");

  const result = await updateAnnualCheckup(req.app.locals.db, req.params.id, {
    UPDATED_BY: req.user?.user_id ?? null,
    DELIVERY_ID,
  });

  if (!result.affectedRows) throw new HttpError(404, "Annual checkup not found");

  return res.status(200).json(successResponse("Annual checkup updated successfully", { affectedRows: result.affectedRows }, {}));
});

const deleteAnnualCheckupCtrl = asyncHandler(async (req, res) => {
  const result = await softDeleteAnnualCheckup(req.app.locals.db, req.params.id, req.user?.user_id);
  if (!result.affectedRows) throw new HttpError(404, "Annual checkup not found");
  return res.status(200).json(successResponse("Annual checkup deleted successfully", { affectedRows: result.affectedRows }, {}));
});

module.exports = {
  createAnnualCheckup,
  getAnnualCheckups,
  getAnnualCheckupByIdCtrl,
  updateAnnualCheckupCtrl,
  deleteAnnualCheckupCtrl,
};

