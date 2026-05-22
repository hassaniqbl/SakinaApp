const asyncHandler = require("../../config/asyncHandler");
const bcrypt = require("bcrypt");
const { HttpError } = require("../../utils/httpError");
const { successResponse, errorResponse } = require("../../utils/apiResponse");

const {
  insertUser,
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUser,
} = require("./users.model");

const { getPagination, normalizeSort, buildSearchClause, buildFilterClause } = require("../../utils/queryBuilder");

const ALLOWED_SORT = [
  "USER_ID",
  "EMAIL_ADDRESS",
  "ROLE_ID",
  "LOCATION_ID",
  "FIRST_NAME",
  "LAST_NAME",
  "DATE_CREATED",
  "DATE_UPDATED",
  "IS_ACTIVE",
];

const getFilters = (query) => {
  return {
    filters: query,
    allowedFilters: {
      location_id: { column: "u.LOCATION_ID", type: "number" },
      role_id: { column: "u.ROLE_ID", type: "number" },
    },
  };
};

const searchFields = ["u.EMAIL_ADDRESS", "u.FIRST_NAME", "u.LAST_NAME", "u.PHONE_NUMBER", "u.ADDRESS_LINE1", "u.ADDRESS_LINE2"];

const createUser = asyncHandler(async (req, res) => {
  const body = req.body || {};

  const EMAIL_ADDRESS = body.EMAIL_ADDRESS ?? body.EMAIL;
  const PASS = body.PASS;

  if (!EMAIL_ADDRESS) throw new HttpError(400, "EMAIL_ADDRESS is required");
  if (!PASS) throw new HttpError(400, "PASS is required");

  const hashed = await bcrypt.hash(String(PASS), 10);

  const normalizeId = (v) => {
    if (v === undefined || v === null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const payload = {
    ACCOUNT_GUID: body.ACCOUNT_GUID ?? null,
    EMAIL_ADDRESS: String(EMAIL_ADDRESS).trim(),
    PASS: hashed,
    ROLE_ID: normalizeId(body.ROLE_ID),
    LOCATION_ID: normalizeId(body.LOCATION_ID),
    FIRST_NAME: body.FIRST_NAME ?? body.FIRSTNAME ?? null,
    LAST_NAME: body.LAST_NAME ?? body.LASTNAME ?? null,
    PHONE_NUMBER: body.PHONE_NUMBER ?? body.CONTACT ?? null,
    ADDRESS_LINE1: body.ADDRESS_LINE1 ?? body.ADDRESS ?? null,
    ADDRESS_LINE2: body.ADDRESS_LINE2 ?? null,
    PROFILE_PICTURE_URL: body.PROFILE_PICTURE_URL ?? null,
    IS_ACTIVE: body.IS_ACTIVE === undefined ? 1 : body.IS_ACTIVE ? 1 : 0,
    ADDED_BY: body.ADDED_BY ?? req.user?.user_id ?? null,
    UPDATED_BY: req.user?.user_id ?? null,
  };

  const db = req.app.locals.db;
  const result = await insertUser(db, payload);

  return res.status(201).json(successResponse("User created successfully", { affectedRows: result.affectedRows }, {}));
});

const getUsers = asyncHandler(async (req, res) => {
  const db = req.app.locals.db;

  const { page, limit, offset } = getPagination(req.query);
  const { sortBy, sortOrder } = normalizeSort(req.query, ALLOWED_SORT, "DATE_CREATED");

  const { filters, allowedFilters } = getFilters(req.query);
  const filterClauseObj = buildFilterClause({ filters, allowedFilters });

  const searchClauseObj = buildSearchClause({
    searchFields,
    searchQuery: req.query.search,
  });

  const { rows, total } = await getAllUsers(
    db,
    { page, limit, offset },
    { searchClause: searchClauseObj.clause ? `(${searchClauseObj.clause})` : "", searchParams: searchClauseObj.params },
    { filterClause: filterClauseObj.clause ? `(${filterClauseObj.clause})` : "", filterParams: filterClauseObj.params },
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

const getUserByIdCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = req.app.locals.db;

  const row = await getUserById(db, id);
  if (!row) throw new HttpError(404, "User not found");

  return res.status(200).json(successResponse("Data fetched successfully", row, {}));
});

const updateUserCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = req.app.locals.db;

  if (!id) throw new HttpError(400, "User id is required");

  const body = req.body || {};

  const existing = await getUserById(db, id);
  if (!existing) throw new HttpError(404, "User not found");

  const normalizeId = (v) => {
    if (v === undefined || v === null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  // If PASS provided, hash it; otherwise keep existing PASS
  const pass = body.PASS ? await bcrypt.hash(String(body.PASS), 10) : existing.PASS;

  const payload = {
    EMAIL_ADDRESS: (body.EMAIL_ADDRESS ?? body.EMAIL ?? existing.EMAIL_ADDRESS) ? String(body.EMAIL_ADDRESS ?? body.EMAIL ?? existing.EMAIL_ADDRESS).trim() : null,
    PASS: pass,
    ROLE_ID: normalizeId(body.ROLE_ID) ?? existing.ROLE_ID ?? null,
    LOCATION_ID: normalizeId(body.LOCATION_ID) ?? existing.LOCATION_ID ?? null,
    FIRST_NAME: body.FIRST_NAME ?? body.FIRSTNAME ?? existing.FIRST_NAME ?? null,
    LAST_NAME: body.LAST_NAME ?? body.LASTNAME ?? existing.LAST_NAME ?? null,
    PHONE_NUMBER: body.PHONE_NUMBER ?? body.CONTACT ?? existing.PHONE_NUMBER ?? null,
    ADDRESS_LINE1: body.ADDRESS_LINE1 ?? body.ADDRESS ?? existing.ADDRESS_LINE1 ?? null,
    ADDRESS_LINE2: body.ADDRESS_LINE2 ?? existing.ADDRESS_LINE2 ?? null,
    PROFILE_PICTURE_URL: body.PROFILE_PICTURE_URL ?? existing.PROFILE_PICTURE_URL ?? null,
    IS_ACTIVE: body.IS_ACTIVE === undefined ? existing.IS_ACTIVE : body.IS_ACTIVE ? 1 : 0,
    UPDATED_BY: req.user?.user_id ?? null,
  };

  const result = await updateUser(db, id, payload);
  if (!result.affectedRows) throw new HttpError(404, "User not found");

  return res.status(200).json({ success: true, message: "User updated successfully", data: {} });
});

const deleteUserCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = req.app.locals.db;

  const result = await softDeleteUser(db, id, req.user?.user_id);
  if (!result.affectedRows) throw new HttpError(404, "User not found");

  return res.status(200).json(successResponse("User deleted successfully", { affectedRows: result.affectedRows }, {}));
});

module.exports = {
  createUser,
  getUsers,
  getUserByIdCtrl,
  updateUserCtrl,
  deleteUserCtrl,
};

