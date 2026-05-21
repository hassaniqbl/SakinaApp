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

  const {
    BABY_DEATH_REASON,
    MOTHER_DEATH_REASON,
    FEEDBACK_ON_CBK,
    DELIVERY_CENTRE,
    DATE_OF_DELIVERY,
    MODE_OF_DELIVERY,
    BLOOD_LOSS_DURING_DELIVERY,
    IS_BABY_ALIVE,
    IS_MOTHER_ALIVE,
    PREGNANCY_PERIOD_WEEKS,
    PREGNANCY_PERIOD_DAYS,
    IS_BREAST_FEED_DURING_FIRST_HOUR,
    IS_COLOSTRUM_BREASTMILK_GIVEN,
    IS_KANGAROO_CARE,
    FOLLOW_UP_DATE,
    ANTENATAL_VISITS,
    DATA_SOURCE,
    CREATED_BY_LATITUDE,
    CREATED_BY_LONGITUDE,
  } = req.body || {};

  const toBit = (v) => {
    if (v === true || v === 1 || v === "1") return 1;
    if (v === false || v === 0 || v === "0") return 0;
    return null;
  };

  const payload = {
    ADDED_BY: req.user?.user_id ?? null,
    UPDATED_BY: req.user?.user_id ?? null,
    PATIENT_ID,

    BABY_DEATH_REASON: BABY_DEATH_REASON ?? null,
    MOTHER_DEATH_REASON: MOTHER_DEATH_REASON ?? null,
    FEEDBACK_ON_CBK: FEEDBACK_ON_CBK ?? null,
    DELIVERY_CENTRE: DELIVERY_CENTRE ?? null,

    DATE_OF_DELIVERY: DATE_OF_DELIVERY ?? null,
    MODE_OF_DELIVERY: MODE_OF_DELIVERY ?? null,
    BLOOD_LOSS_DURING_DELIVERY: BLOOD_LOSS_DURING_DELIVERY ?? null,

    IS_BABY_ALIVE: toBit(IS_BABY_ALIVE),
    IS_MOTHER_ALIVE: toBit(IS_MOTHER_ALIVE),

    PREGNANCY_PERIOD_WEEKS: PREGNANCY_PERIOD_WEEKS ?? null,
    PREGNANCY_PERIOD_DAYS: PREGNANCY_PERIOD_DAYS ?? null,

    IS_BREAST_FEED_DURING_FIRST_HOUR: toBit(IS_BREAST_FEED_DURING_FIRST_HOUR),
    IS_COLOSTRUM_BREASTMILK_GIVEN: toBit(IS_COLOSTRUM_BREASTMILK_GIVEN),
    IS_KANGAROO_CARE: toBit(IS_KANGAROO_CARE),

    FOLLOW_UP_DATE: FOLLOW_UP_DATE ?? null,
    ANTENATAL_VISITS: ANTENATAL_VISITS ?? null,

    DATA_SOURCE: DATA_SOURCE ?? null,
    CREATED_BY_LATITUDE: CREATED_BY_LATITUDE ?? null,
    CREATED_BY_LONGITUDE: CREATED_BY_LONGITUDE ?? null,
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
  const body = req.body || {};
  const { PATIENT_ID } = body;
  if (!PATIENT_ID) throw new HttpError(400, "PATIENT_ID is required");

  const toBit = (v) => {
    if (v === true || v === 1 || v === "1") return 1;
    if (v === false || v === 0 || v === "0") return 0;
    return null;
  };

  const toNumberOrNull = (v) => {
    if (v === undefined || v === null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const payload = {
    UPDATED_BY: req.user?.user_id ?? null,
    PATIENT_ID,

    BABY_DEATH_REASON: body.BABY_DEATH_REASON ?? null,
    MOTHER_DEATH_REASON: body.MOTHER_DEATH_REASON ?? null,
    FEEDBACK_ON_CBK: body.FEEDBACK_ON_CBK ?? null,

    DELIVERY_CENTRE: toNumberOrNull(body.DELIVERY_CENTRE),
    DATE_OF_DELIVERY: body.DATE_OF_DELIVERY ?? null,
    MODE_OF_DELIVERY: toNumberOrNull(body.MODE_OF_DELIVERY),
    BLOOD_LOSS_DURING_DELIVERY: toNumberOrNull(body.BLOOD_LOSS_DURING_DELIVERY),

    IS_BABY_ALIVE: toBit(body.IS_BABY_ALIVE),
    IS_MOTHER_ALIVE: toBit(body.IS_MOTHER_ALIVE),
    PREGNANCY_PERIOD_WEEKS: toNumberOrNull(body.PREGNANCY_PERIOD_WEEKS),
    PREGNANCY_PERIOD_DAYS: toNumberOrNull(body.PREGNANCY_PERIOD_DAYS),

    IS_BREAST_FEED_DURING_FIRST_HOUR: toBit(body.IS_BREAST_FEED_DURING_FIRST_HOUR),
    IS_COLOSTRUM_BREASTMILK_GIVEN: toBit(body.IS_COLOSTRUM_BREASTMILK_GIVEN),
    IS_KANGAROO_CARE: toBit(body.IS_KANGAROO_CARE),

    FOLLOW_UP_DATE: body.FOLLOW_UP_DATE ?? null,
    ANTENATAL_VISITS: toNumberOrNull(body.ANTENATAL_VISITS),
    DATA_SOURCE: body.DATA_SOURCE ?? null,

    CREATED_BY_LATITUDE:
      body.CREATED_BY_LATITUDE === undefined ? null : body.CREATED_BY_LATITUDE,
    CREATED_BY_LONGITUDE:
      body.CREATED_BY_LONGITUDE === undefined ? null : body.CREATED_BY_LONGITUDE,
  };

  const result = await updateDelivery(req.app.locals.db, req.params.id, payload);

  if (!result.affectedRows) throw new HttpError(404, "Delivery not found");

  return res
    .status(200)
    .json(
      successResponse(
        "Delivery updated successfully",
        { affectedRows: result.affectedRows },
        {}
      )
    );
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

