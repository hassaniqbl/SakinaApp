const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const { createAnnualCheckup, getAnnualCheckups, getAnnualCheckupByIdCtrl, updateAnnualCheckupCtrl, deleteAnnualCheckupCtrl } = require("../modules/annual-checkups/annual-checkups.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Annual Checkups
 *   description: CRUD APIs for SC_ANNUAL_POSTNATAL_CHECKUP
 */

/**
 * @swagger
 * /api/annual-checkups:
 *   post:
 *     summary: Create annual checkup
 *     tags: [Annual Checkups]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/annual-checkups", authMiddleware, createAnnualCheckup);

/**
 * @swagger
 * /api/annual-checkups:
 *   get:
 *     summary: Get annual checkups list
 *     tags: [Annual Checkups]
 *     responses:
 *       200:
 *         description: List returned
 */
router.get("/annual-checkups", authMiddleware, getAnnualCheckups);

/**
 * @swagger
 * /api/annual-checkups/{id}:
 *   get:
 *     summary: Get annual checkup by id
 *     tags: [Annual Checkups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Checkup object
 */
router.get("/annual-checkups/:id", authMiddleware, getAnnualCheckupByIdCtrl);

/**
 * @swagger
 * /api/annual-checkups/{id}:
 *   put:
 *     summary: Update annual checkup
 *     tags: [Annual Checkups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated
 */
router.put("/annual-checkups/:id", authMiddleware, updateAnnualCheckupCtrl);

/**
 * @swagger
 * /api/annual-checkups/{id}:
 *   delete:
 *     summary: Delete annual checkup
 *     tags: [Annual Checkups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/annual-checkups/:id", authMiddleware, deleteAnnualCheckupCtrl);

module.exports = router;

