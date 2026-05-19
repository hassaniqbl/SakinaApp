const express = require("express");

const { authMiddleware } = require("../../middleware/auth.middleware");
const { validateRequest } = require("../../middleware/validate.js");

const {
  createAdmCodeCtrl,
  getAdmCodesCtrl,
  getAdmCodeByIdCtrl,
  updateAdmCodeCtrl,
  deleteAdmCodeCtrl,
  getWithItemsCtrl,
  getByNameCtrl,
  getItemsByCodeIdCtrl,
  getDropdownCtrl,
} = require("./adm-code.controller");

const {
  validateCreateAdmCode,
  validateUpdateAdmCode,
  validateIdParam,
  validateListQuery,
  validateByName,
} = require("./adm-code.validation");

const { validateDropdownCodeId } = require("../adm-code-item/adm-code-item.validation");


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ADM_CODE
 *   description: CRUD + Lookup APIs for ADM_CODE
 */

/**
 * @swagger
 * /adm-code:
 *   post:
 *     summary: Create ADM_CODE
 *     tags: [ADM_CODE]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               code_name: Gender
 *               code_description: Gender Master
 *               added_by: 1
 *     responses:
 *       201:
 *         description: Code created
 */
router.post("/adm-code", authMiddleware, validateCreateAdmCode, validateRequest, createAdmCodeCtrl);

/**
 * @swagger
 * /adm-code:
 *   get:
 *     summary: Get ADM_CODE list
 *     tags: [ADM_CODE]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string, example: gender }
 *     responses:
 *       200:
 *         description: List fetched
 */
router.get("/adm-code", authMiddleware, validateListQuery, validateRequest, getAdmCodesCtrl);

/**
 * @swagger
 * /adm-code/{id}:
 *   get:
 *     summary: Get ADM_CODE by ID
 *     tags: [ADM_CODE]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Record fetched
 *       404:
 *         description: Not found
 */
router.get("/adm-code/:id", authMiddleware, validateIdParam, validateRequest, getAdmCodeByIdCtrl);

/**
 * @swagger
 * /adm-code/{id}:
 *   put:
 *     summary: Update ADM_CODE
 *     tags: [ADM_CODE]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               code_name: Gender
 *               code_description: Gender Master
 *               updated_by: 1
 *     responses:
 *       200:
 *         description: Updated
 */
router.put("/adm-code/:id", authMiddleware, validateUpdateAdmCode, validateRequest, updateAdmCodeCtrl);

/**
 * @swagger
 * /adm-code/{id}:
 *   delete:
 *     summary: Soft delete ADM_CODE (cascade items)
 *     tags: [ADM_CODE]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/adm-code/:id", authMiddleware, validateIdParam, validateRequest, deleteAdmCodeCtrl);

/**
 * @swagger
 * /adm-code/with-items:
 *   get:
 *     summary: Get all ADM_CODE with their items
 *     tags: [ADM_CODE]
 *     responses:
 *       200:
 *         description: Dropdown data fetched
 */
router.get("/adm-code/with-items", authMiddleware, getWithItemsCtrl);

/**
 * @swagger
 * /adm-code/by-name/{codeName}:
 *   get:
 *     summary: Get ADM_CODE items by code name
 *     tags: [ADM_CODE]
 *     parameters:
 *       - in: path
 *         name: codeName
 *         required: true
 *         schema: { type: string, example: Gender }
 *     responses:
 *       200:
 *         description: Items fetched
 */
router.get("/adm-code/by-name/:codeName", authMiddleware, validateByName, validateRequest, getByNameCtrl);

/**
 * @swagger
 * /adm-code/items/{codeId}:
 *   get:
 *     summary: Get ADM_CODE items by CODE_ID
 *     tags: [ADM_CODE]
 *     parameters:
 *       - in: path
 *         name: codeId
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Items fetched
 */
router.get("/adm-code/items/:codeId", authMiddleware, validateDropdownCodeId, validateRequest, getItemsByCodeIdCtrl);


/**
 * @swagger
 * /adm-code/dropdown:
 *   get:
 *     summary: Get ADM_CODE dropdown
 *     tags: [ADM_CODE]
 *     responses:
 *       200:
 *         description: Dropdown fetched
 */
router.get("/adm-code/dropdown", authMiddleware, getDropdownCtrl);

module.exports = router;

