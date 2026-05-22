const asyncHandler = require("../../config/asyncHandler");
const { HttpError } = require("../../utils/httpError");
const { successResponse } = require("../../utils/apiResponse");


const { getAdmCodeItemById, getDropdownItemsByCodeId } = require("./adm-code-item.model");





const {
  createAdmCodeItemTx,
  updateAdmCodeItemTx,
  softDeleteAdmCodeItemTx,
  ensureCodeIdExists,
} = require("./adm-code-item.service");

const getItemsCtrl = asyncHandler(async (req, res) => {
  const rows = await req.app.locals.db.promise().query("SELECT * FROM ADM_CODE_ITEM").then(([r]) => r);

  return res.status(200).json({
    success: true,
    message: "ADM_CODE_ITEM list fetched successfully",
    data: rows,
  });
});





const getByIdCtrl = asyncHandler(async (req, res) => {
  const row = await getAdmCodeItemById(req.app.locals.db, req.params.id);
  if (!row) throw new HttpError(404, "ADM_CODE_ITEM not found");
  return res.status(200).json(successResponse("Data fetched successfully", row, {}));
});

const createCtrl = asyncHandler(async (req, res) => {
  const db = req.app.locals.db;

  const { code_id, item_name, item_value, display_order, added_by } = req.body || {};

  if (!code_id) throw new HttpError(400, "code_id is required");
  if (!item_name) throw new HttpError(400, "item_name is required");
  if (item_value === undefined || item_value === null || item_value === "") {
    throw new HttpError(400, "item_value is required");
  }

  const payload = {
    code_id: Number(code_id),
    item_name,
    item_value,
    display_order: display_order !== undefined ? Number(display_order) : null,
    added_by: added_by ?? null,
    updated_by: req.user?.user_id ?? added_by ?? null,
  };

  const result = await createAdmCodeItemTx(db, payload);

  return res
    .status(201)
    .json(successResponse("Code item created successfully", { affectedRows: result.affectedRows }, {}));
});

const updateCtrl = asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { code_id, item_name, item_value, display_order, updated_by, added_by } = req.body || {};

  if (!item_name) throw new HttpError(400, "item_name is required");
  if (item_value === undefined || item_value === null || item_value === "") {
    throw new HttpError(400, "item_value is required");
  }

  const existing = await getAdmCodeItemById(db, id);
  if (!existing) throw new HttpError(404, "ADM_CODE_ITEM not found");

  const payload = {
    code_id: code_id !== undefined && code_id !== null ? Number(code_id) : existing.CODE_ID,
    item_name,
    item_value,
    display_order: display_order !== undefined ? Number(display_order) : existing.DISPLAY_ORDER,
    updated_by: req.user?.user_id ?? updated_by ?? added_by ?? null,
  };

  const result = await updateAdmCodeItemTx(db, id, payload);

  if (!result.affectedRows) throw new HttpError(404, "ADM_CODE_ITEM not found");

  return res
    .status(200)
    .json(successResponse("Code item updated successfully", { affectedRows: result.affectedRows }, {}));
});

const deleteCtrl = asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  const result = await softDeleteAdmCodeItemTx(db, id, req.user?.user_id ?? null);

  if (!result.affectedRows) throw new HttpError(404, "ADM_CODE_ITEM not found");

  return res.status(200).json(successResponse("Code item deleted successfully", { affectedRows: result.affectedRows }, {}));
});

const dropdownItemsCtrl = asyncHandler(async (req, res) => {
  const rows = await getDropdownItemsByCodeId(req.app.locals.db, req.params.codeId);
  return res.status(200).json(successResponse("Data fetched successfully", rows, {}));
});

module.exports = {
  getItemsCtrl,
  getByIdCtrl,
  createCtrl,
  updateCtrl,
  deleteCtrl,
  dropdownItemsCtrl,
};

