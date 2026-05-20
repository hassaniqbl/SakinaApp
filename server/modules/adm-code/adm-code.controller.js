const asyncHandler = require("../../config/asyncHandler");
const { HttpError } = require("../../utils/httpError");
const { errorResponse } = require("../../utils/apiResponse");

const {
  createAdmCodeTx,
  getAdmCodes,
  getAdmCodeById,
  updateAdmCodeTx,
  softDeleteAdmCodeTx,
} = require("./adm-code.service");

const buildSuccess = (message, data) => ({ success: true, message, data });
const buildError = (message, error) => ({ success: false, message, error: error || {} });

const createAdmCodeCtrl = asyncHandler(async (req, res) => {
  try {
    const db = req.app.locals.db;


    const { CODE_NAME, CODE_DESCRIPTION, ADDED_BY } = req.body || {};




    if (!CODE_NAME) throw new HttpError(400, "CODE_NAME is required");

    const payload = {
      CODE_NAME,
      CODE_DESCRIPTION: CODE_DESCRIPTION ?? null,
      ADDED_BY: ADDED_BY ?? null,
      UPDATED_BY: req.user?.user_id ?? ADDED_BY ?? null,
    };

    const result = await createAdmCodeTx(db, payload);

    return res.status(201).json(
      buildSuccess("ADM_CODE created successfully", result.row)
    );
  } catch (err) {
    // asyncHandler will catch thrown errors, but keep consistent structure
    throw err;
  }
});

const getAdmCodesCtrl = asyncHandler(async (req, res) => {
  const db = req.app.locals.db;

  const rows = await getAdmCodes(db);

  return res
    .status(200)
    .json(buildSuccess("ADM_CODE fetched successfully", rows));
});

const getAdmCodeByIdCtrl = asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const row = await getAdmCodeById(db, req.params.id);

  if (!row) throw new HttpError(404, "ADM_CODE not found");

  return res
    .status(200)
    .json(buildSuccess("ADM_CODE fetched successfully", row));
});

const updateAdmCodeCtrl = asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { CODE_NAME, CODE_DESCRIPTION, UPDATED_BY } = req.body || {};

  const payload = {
    CODE_NAME,
    CODE_DESCRIPTION: CODE_DESCRIPTION ?? null,
    UPDATED_BY: UPDATED_BY ?? req.user?.user_id ?? null,
  };

  const result = await updateAdmCodeTx(db, id, payload);

  if (!result.affectedRows || !result.row) throw new HttpError(404, "ADM_CODE not found");

  return res
    .status(200)
    .json(buildSuccess("ADM_CODE updated successfully", result.row));
});

const deleteAdmCodeCtrl = asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const updatedBy = req.user?.user_id ?? null;

  const result = await softDeleteAdmCodeTx(db, id, updatedBy);

  if (!result.affectedRows) throw new HttpError(404, "ADM_CODE not found");

  return res
    .status(200)
    .json(buildSuccess("ADM_CODE deleted successfully", result));
});

module.exports = {
  createAdmCodeCtrl,
  getAdmCodesCtrl,
  getAdmCodeByIdCtrl,
  updateAdmCodeCtrl,
  deleteAdmCodeCtrl,
};

