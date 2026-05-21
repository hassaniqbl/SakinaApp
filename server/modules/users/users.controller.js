const asyncHandler = require("../../config/asyncHandler");
const bcrypt = require("bcrypt");
const path = require("path");
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
  "EMAIL",
  "USER_ROLE",
  "FIRSTNAME",
  "LASTNAME",
  "DATE_CREATED",
  "DATE_UPDATED",
];

const getFilters = (query) => {
  return {
    filters: query,
    allowedFilters: {
      location_id: { column: "u.LOCATION_ID", type: "number" },
      user_role: { column: "u.USER_ROLE", type: "string" },
    },
  };
};

const searchFields = ["u.EMAIL", "u.FIRSTNAME", "u.LASTNAME", "u.CONTACT", "u.ADDRESS"];

const createUser = asyncHandler(async (req, res) => {
  const {
    EMAIL,
    PASS,
    USER_ROLE,
    LOCATION_ID,
    FIRSTNAME,
    LASTNAME,
    CONTACT,
    ADDRESS,
    PROFILE_PICTURE_URL,
    added_by,
  } = req.body || {};

  if (!EMAIL) throw new HttpError(400, "EMAIL is required");
  if (!PASS) throw new HttpError(400, "PASS is required");

  const hashed = await bcrypt.hash(String(PASS), 10);

  // Normalize LOCATION_ID to avoid FK failures:
  // - treat empty/undefined/null as NULL
  // - coerce numeric strings to number
  // - if invalid, set NULL (FK allows NULL)
  const normalizedLocationId = (() => {
    if (LOCATION_ID === undefined || LOCATION_ID === null || LOCATION_ID === "") return null;
    const n = Number(LOCATION_ID);
    return Number.isFinite(n) ? n : null;
  })();

  const payload = {
    EMAIL: String(EMAIL).trim(),
    PASS: hashed,
    USER_ROLE: USER_ROLE || null,
    LOCATION_ID: normalizedLocationId,
    FIRSTNAME: FIRSTNAME || null,
    LASTNAME: LASTNAME || null,
    CONTACT: CONTACT || null,
    ADDRESS: ADDRESS || null,
    PROFILE_PICTURE_URL: PROFILE_PICTURE_URL || null,
    ADDED_BY: added_by ?? req.user?.user_id ?? null,
    UPDATED_BY: req.user?.user_id ?? null,
  };


  const db = req.app.locals.db;
  const result = await insertUser(db, payload);

  return res
    .status(201)
    .json(successResponse("User created successfully", { affectedRows: result.affectedRows }, {}));
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
  try {
    const { id } = req.params;
    const db = req.app.locals.db;

    const {
      FIRSTNAME,
      LASTNAME,
      EMAIL,
      // optional alternate names clients might send
      EMAIL_ADDRESS,
      USER_EMAIL,
    } = req.body || {};

    if (!id) throw new HttpError(400, "User id is required");

    const finalEmail = EMAIL ?? EMAIL_ADDRESS ?? USER_EMAIL;
    if (!finalEmail) throw new HttpError(400, "EMAIL is required");

    const payload = {
      FIRSTNAME: FIRSTNAME ?? null,
      LASTNAME: LASTNAME ?? null,
      EMAIL: String(finalEmail).trim(),
      UPDATED_BY: req.user?.user_id ?? null,
    };

    const existing = await getUserById(db, id);
    if (!existing) throw new HttpError(404, "User not found");

    const result = await updateUser(db, id, payload);
    if (!result.affectedRows) throw new HttpError(404, "User not found");

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {},
    });
  } catch (err) {
    throw err;
  }
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

