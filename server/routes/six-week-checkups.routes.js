const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const { createSixWeekCheckup, getSixWeekCheckups, getSixWeekCheckupByIdCtrl, updateSixWeekCheckupCtrl, deleteSixWeekCheckupCtrl } = require("../modules/six-week-checkups/six-week-checkups.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Six Week Checkups
 *   description: CRUD APIs for SC_SIX_WEEK_POSTNATAL_CHECKUP
 */

/**
 * @swagger
 * /six-week-checkups:
 *   post:
 *     summary: Create six-week checkup
 *     tags: [Six Week Checkups]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               PATIENT_ID: 1
 *               CHECKUP_DATE: "2024-01-15"
 *               MOTHER_HEALTH: "Good"
 *               BABY_HEALTH: "Good"
 *               BREASTFEEDING: "Yes"
 *               CONTRACEPTION: "None"
 *               NOTES: "Mother recovering well"
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/six-week-checkups", authMiddleware, createSixWeekCheckup);

/**
 * @swagger
 * /six-week-checkups:
 *   get:
 *     summary: Get six-week checkups list
 *     tags: [Six Week Checkups]
 *     responses:
 *       200:
 *         description: List returned
 */
router.get("/six-week-checkups", authMiddleware, getSixWeekCheckups);

/**
 * @swagger
 * /six-week-checkups/{id}:
 *   get:
 *     summary: Get six-week checkup by id
 *     tags: [Six Week Checkups]
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
router.get("/six-week-checkups/:id", authMiddleware, getSixWeekCheckupByIdCtrl);

/**
 * @swagger
 * /six-week-checkups/{id}:
 *   put:
 *     summary: Update six-week checkup
 *     tags: [Six Week Checkups]
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
router.put("/six-week-checkups/:id", authMiddleware, updateSixWeekCheckupCtrl);

/**
 * @swagger
 * /six-week-checkups/{id}:
 *   delete:
 *     summary: Delete six-week checkup
 *     tags: [Six Week Checkups]
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
router.delete("/six-week-checkups/:id", authMiddleware, deleteSixWeekCheckupCtrl);

module.exports = router;

