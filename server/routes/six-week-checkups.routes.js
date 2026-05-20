const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const { validateCreateSixWeekCheckup, validateUpdateSixWeekCheckup } = require("../modules/six-week-checkups/six-week-checkups.validation");
const { validateRequest } = require("../middleware/validate.middleware");
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
 * /six-week-checkup:
 *   post:
 *     summary: Create six-week checkup
 *     tags: [Six Week Checkups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             DELIVERY_ID: 1
 *             IS_PATIENT_ALIVE: true
 *             PATIENT_DEATH_REASON: ""
 *             IS_PATIENT_HEALTHY: true
 *             PATIENT_HEALTH_MORE_DETAILS: ""
 *             IS_BABY_ALIVE: true
 *             BABY_DEATH_REASON: ""
 *             IS_BABY_HEALTHY: true
 *             BABY_HEALTH_MORE_DETAILS: ""
 *             BREAST_FEEDING_DURATION: 1
 *             IS_BABY_CORD_HEALTHY: true
 *             BABY_CORD_CONDITION_MORE_DETAILS: ""
 *             FOLLOWUP_DATE: "2026-05-19T10:00:00"
 *             DATA_SOURCE: "WEB"
 *             CREATED_BY_LATITUDE: 33.6844
 *             CREATED_BY_LONGITUDE: 73.0479
 *             ADDED_BY: 1
 *             UPDATED_BY: 1
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/six-week-checkup", authMiddleware, validateCreateSixWeekCheckup, validateRequest, createSixWeekCheckup);

/**
 * @swagger
 * /six-week-checkup:
 *   get:
 *     summary: Get six-week checkups list
 *     tags: [Six Week Checkups]
 *     responses:
 *       200:
 *         description: List returned
 */
router.get("/six-week-checkup", authMiddleware, getSixWeekCheckups);

/**
 * @swagger
 * /six-week-checkup/{id}:
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
router.get("/six-week-checkup/:id", authMiddleware, getSixWeekCheckupByIdCtrl);

/**
 * @swagger
 * /six-week-checkup/{id}:
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             DELIVERY_ID: 1
 *             IS_PATIENT_ALIVE: true
 *             PATIENT_DEATH_REASON: ""
 *             IS_PATIENT_HEALTHY: true
 *             PATIENT_HEALTH_MORE_DETAILS: ""
 *             IS_BABY_ALIVE: true
 *             BABY_DEATH_REASON: ""
 *             IS_BABY_HEALTHY: true
 *             BABY_HEALTH_MORE_DETAILS: ""
 *             BREAST_FEEDING_DURATION: 1
 *             IS_BABY_CORD_HEALTHY: true
 *             BABY_CORD_CONDITION_MORE_DETAILS: ""
 *             FOLLOWUP_DATE: "2026-05-19T10:00:00"
 *             DATA_SOURCE: "WEB"
 *             CREATED_BY_LATITUDE: 33.6844
 *             CREATED_BY_LONGITUDE: 73.0479
 *             ADDED_BY: 1
 *             UPDATED_BY: 1
 *     responses:
 *       200:
 *         description: Updated
 */
router.put("/six-week-checkup/:id", authMiddleware, validateUpdateSixWeekCheckup, validateRequest, updateSixWeekCheckupCtrl);


/**
 * @swagger
 * /six-week-checkup/{id}:
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
router.delete("/six-week-checkup/:id", authMiddleware, deleteSixWeekCheckupCtrl);

module.exports = router;

