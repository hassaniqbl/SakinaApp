const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const { validateRequest } = require("../middleware/validate.middleware");



const {
  getItemsCtrl,
  getByIdCtrl,
  createCtrl,
  updateCtrl,
  deleteCtrl,
  dropdownItemsCtrl,
} = require("../modules/adm-code-item/adm-code-item.controller");

const {
  validateCreateAdmCodeItem,
  validateUpdateAdmCodeItem,
  validateIdParam,
  validateDropdownCodeId,
} = require("../modules/adm-code-item/adm-code-item.validation");


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ADM_CODE_ITEM
 *   description: CRUD + Lookup APIs for ADM_CODE_ITEM
 */

/**
 * @swagger
 * /adm-code-item:
 *   post:
 *     summary: Create ADM_CODE_ITEM
 *     tags: [ADM_CODE_ITEM]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               code_id: 1
 *               item_name: Male
 *               item_value: M
 *               display_order: 1
 *               added_by: 1
 *     responses:
 *       201:
 *         description: Item created
 */
router.post("/adm-code-item", authMiddleware, validateCreateAdmCodeItem, validateRequest, createCtrl);

/**
 * @swagger
 * /adm-code-item:
 *   get:
 *     summary: Get ADM_CODE_ITEM list
 *     tags: [ADM_CODE_ITEM]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 10 }
 *       - in: query
 *         name: code_id
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: search
 *         schema: { type: string, example: male }
 *     responses:
 *       200:
 *         description: List fetched
 */
router.get("/adm-code-item", authMiddleware, validateRequest, getItemsCtrl);

/**
 * @swagger
 * /adm-code-item/{id}:
 *   get:
 *     summary: Get ADM_CODE_ITEM by ID
 *     tags: [ADM_CODE_ITEM]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Record fetched
 */
router.get("/adm-code-item/:id", authMiddleware, validateIdParam, validateRequest, getByIdCtrl);

/**
 * @swagger
 * /adm-code-item/{id}:
 *   put:
 *     summary: Update ADM_CODE_ITEM
 *     tags: [ADM_CODE_ITEM]
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
 *               code_id: 1
 *               item_name: Male
 *               item_value: M
 *               display_order: 1
 *               updated_by: 1
 *     responses:
 *       200:
 *         description: Updated
 */
router.put("/adm-code-item/:id", authMiddleware, validateUpdateAdmCodeItem, validateRequest, updateCtrl);

/**
 * @swagger
 * /adm-code-item/{id}:
 *   delete:
 *     summary: Soft delete ADM_CODE_ITEM
 *     tags: [ADM_CODE_ITEM]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/adm-code-item/:id", authMiddleware, validateIdParam, validateRequest, deleteCtrl);

/**
 * @swagger
 * /adm-code-item/dropdown/{codeId}:
 *   get:
 *     summary: Get ADM_CODE_ITEM dropdown items by CODE_ID
 *     tags: [ADM_CODE_ITEM]
 *     parameters:
 *       - in: path
 *         name: codeId
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Dropdown items fetched
 */
router.get("/adm-code-item/dropdown/:codeId", authMiddleware, validateDropdownCodeId, validateRequest, dropdownItemsCtrl);

module.exports = router;

