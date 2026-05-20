const express = require("express");

const authMiddleware = require("../../middleware/auth.middleware").authMiddleware;
const { validateRequest } = require("../../middleware/validate.middleware");

const {
  createAdmCodeCtrl,
  getAdmCodesCtrl,
  getAdmCodeByIdCtrl,
  updateAdmCodeCtrl,
  deleteAdmCodeCtrl,
} = require("./adm-code.controller");

const {
  validateCreateAdmCode,
  validateUpdateAdmCode,
  validateIdParam,
} = require("./adm-code.validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ADM_CODE
 *   description: CRUD API for ADM_CODE
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
 *               CODE_NAME: Gender
 *               CODE_DESCRIPTION: Gender master data
 *               ADDED_BY: 1
 *     responses:
 *       201:
 *         description: ADM_CODE created
 */
router.post("/adm-code", authMiddleware, validateCreateAdmCode, validateRequest, createAdmCodeCtrl);

/**
 * @swagger
 * /adm-code:
 *   get:
 *     summary: Get all ADM_CODE (non deleted)
 *     tags: [ADM_CODE]
 *     responses:
 *       200:
 *         description: List fetched
 */
router.get("/adm-code", authMiddleware, getAdmCodesCtrl);

/**
 * @swagger
 * /adm-code/{id}:
 *   get:
 *     summary: Get ADM_CODE by id
 *     tags: [ADM_CODE]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *     summary: Update ADM_CODE by id
 *     tags: [ADM_CODE]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               CODE_NAME: Updated Name
 *               CODE_DESCRIPTION: Updated Description
 *               UPDATED_BY: 1
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put("/adm-code/:id", authMiddleware, validateUpdateAdmCode, validateRequest, updateAdmCodeCtrl);

/**
 * @swagger
 * /adm-code/{id}:
 *   delete:
 *     summary: Soft delete ADM_CODE by id
 *     tags: [ADM_CODE]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete("/adm-code/:id", authMiddleware, validateIdParam, validateRequest, deleteAdmCodeCtrl);

module.exports = router;

