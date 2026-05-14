const asyncHandler = require("../../config/asyncHandler");
const { HttpError } = require("../../utils/httpError");
const { successResponse } = require("../../utils/apiResponse");
const { getPagination, normalizeSort, buildSearchClause, buildFilterClause } = require("../../utils/queryBuilder");

const {
  insertDelivery,
  getAllDeliveries,
  getDeliveryById,
  updateDelivery,
  softDeleteDelivery,
} = require("./deliveries.model");

const ALLOWED_SORT = ["DELIVERY_ID", "PATIENT_ID", "DATE_CREATED", "DATE_UPDATED"];

const searchFields = [];

const createDelivery = asyncHandler(async (req, res) => {
  const { PATIENT_ID } = req.body || {};
  if (!PATIENT_ID) throw new HttpError(400, "PATIENT_ID is required");

  const payload = {
    ADDED_BY: req.user?.user_id ?? null,
    UPDATED_BY: req.user?.user_id ?? null,
    PATIENT_ID,
  };

  const result = await insertDelivery(req.app.locals.db, payload);
  return res.status(201).json(successResponse("Delivery created successfully", { affectedRows: result.affectedRows }, {}));
});

const getDeliveries = asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const { page, limit, offset } = getPagination(req.query);
  const { sortBy, sortOrder } = normalizeSort(req.query, ALLOWED_SORT, "DATE_CREATED");

  const filterClauseObj = buildFilterClause({
    filters: req.query,
    allowedFilters: {
      patient_id: { column: "d.PATIENT_ID", type: "number" },
    },
  });

  const searchClauseObj = buildSearchClause({ searchFields, searchQuery: req.query.search });

  const { rows, total } = await getAllDeliveries(
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

const getDeliveryByIdCtrl = asyncHandler(async (req, res) => {
  const row = await getDeliveryById(req.app.locals.db, req.params.id);
  if (!row) throw new HttpError(404, "Delivery not found");
  return res.status(200).json(successResponse("Data fetched successfully", row, {}));
});

const updateDeliveryCtrl = asyncHandler(async (req, res) => {
  const { PATIENT_ID } = req.body || {};
  if (!PATIENT_ID) throw new HttpError(400, "PATIENT_ID is required");

  const result = await updateDelivery(req.app.locals.db, req.params.id, {
    UPDATED_BY: req.user?.user_id ?? null,
    PATIENT_ID,
  });

  if (!result.affectedRows) throw new HttpError(404, "Delivery not found");

  return res.status(200).json(successResponse("Delivery updated successfully", { affectedRows: result.affectedRows }, {}));
});

const deleteDeliveryCtrl = asyncHandler(async (req, res) => {
  const result = await softDeleteDelivery(req.app.locals.db, req.params.id, req.user?.user_id);
  if (!result.affectedRows) throw new HttpError(404, "Delivery not found");
  return res.status(200).json(successResponse("Delivery deleted successfully", { affectedRows: result.affectedRows }, {}));
});

module.exports = {
  createDelivery,
  getDeliveries,
  getDeliveryByIdCtrl,
  updateDeliveryCtrl,
  deleteDeliveryCtrl,
};

