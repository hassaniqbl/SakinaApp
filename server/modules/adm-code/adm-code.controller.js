const asyncHandler = require("../../config/asyncHandler");
const { HttpError } = require("../../utils/httpError");
const { successResponse } = require("../../utils/apiResponse");
const { getPagination, normalizeSort, buildSearchClause } = require("../../utils/queryBuilder");

const {
  getAllAdmCodes,
  getAdmCodeById,
  getAllCodesWithItems,
  getCodeItemsByCodeName,
  getCodeItemsByCodeId,
  getDropdownCodes,
} = require("./adm-code.model");


const {
  createAdmCodeTx,
  updateAdmCodeTx,
  softDeleteAdmCodeCascadeTx,
} = require("./adm-code.service");

const ALLOWED_SORT = ["CODE_ID", "CODE_NAME", "DATE_CREATED", "DATE_UPDATED"];



const createAdmCodeCtrl = asyncHandler(async (req, res) => {
  const db = req.app.locals.db;

  const { code_name, code_description, added_by } = req.body || {};

  if (!code_name) throw new HttpError(400, "code_name is required");

  const payload = {
    code_name,
    code_description: code_description ?? null,
    added_by: added_by ?? null,
    updated_by: req.user?.user_id ?? added_by ?? null,
  };

  const result = await createAdmCodeTx(db, payload);

  return res
    .status(201)
    .json(successResponse("Code created successfully", { affectedRows: result.affectedRows }, {}));
});

const getAdmCodesCtrl = asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const { page, limit, offset } = getPagination(req.query);

  const { sortBy, sortOrder } = normalizeSort(req.query, ALLOWED_SORT, "DATE_CREATED");

  const searchClauseObj = buildSearchClause({
    searchFields: ["c.CODE_NAME"],
    searchQuery: req.query.search,
  });

  const { rows, total } = await getAllAdmCodes(
    db,
    { page, limit, offset },
    {
      searchClause: searchClauseObj.clause ? `(${searchClauseObj.clause})` : "",
      searchParams: searchClauseObj.params,
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

const getAdmCodeByIdCtrl = asyncHandler(async (req, res) => {
  const row = await getAdmCodeById(req.app.locals.db, req.params.id);
  if (!row) throw new HttpError(404, "ADM_CODE not found");
  return res.status(200).json(successResponse("Data fetched successfully", row, {}));
});

const updateAdmCodeCtrl = asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { code_name, code_description, updated_by, added_by } = req.body || {};

  if (!code_name) throw new HttpError(400, "code_name is required");

  const payload = {
    code_name,
    code_description: code_description ?? null,
    updated_by: req.user?.user_id ?? updated_by ?? added_by ?? null,
  };

  const result = await updateAdmCodeTx(db, id, payload);

  if (!result.affectedRows) throw new HttpError(404, "ADM_CODE not found");

  return res
    .status(200)
    .json(successResponse("Code updated successfully", { affectedRows: result.affectedRows }, {}));
});

const deleteAdmCodeCtrl = asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const updatedBy = req.user?.user_id ?? null;

  const result = await softDeleteAdmCodeCascadeTx(db, id, updatedBy);

  if (!result.codeAffectedRows) throw new HttpError(404, "ADM_CODE not found");

  return res
    .status(200)
    .json(
      successResponse(
        "Code deleted successfully",
        result,
        {}
      )
    );
});

const getWithItemsCtrl = asyncHandler(async (req, res) => {
  const rows = await getAllCodesWithItems(req.app.locals.db);
  return res.status(200).json(successResponse("Data fetched successfully", rows, {}));
});

const getByNameCtrl = asyncHandler(async (req, res) => {
  const items = await getCodeItemsByCodeName(req.app.locals.db, req.params.codeName);
  return res
    .status(200)
    .json(successResponse("Data fetched successfully", items, {}));
});




const getItemsByCodeIdCtrl = asyncHandler(async (req, res) => {
  const rows = await getCodeItemsByCodeId(req.app.locals.db, req.params.codeId);
  return res.status(200).json(successResponse("Data fetched successfully", rows, {}));
});


const getDropdownCtrl = asyncHandler(async (req, res) => {
  const rows = await getDropdownCodes(req.app.locals.db);
  return res.status(200).json(successResponse("Data fetched successfully", rows, {}));
});

module.exports = {
  createAdmCodeCtrl,
  getAdmCodesCtrl,
  getAdmCodeByIdCtrl,
  updateAdmCodeCtrl,
  deleteAdmCodeCtrl,
  getWithItemsCtrl,
  getByNameCtrl,
  getItemsByCodeIdCtrl,
  getDropdownCtrl,
};

