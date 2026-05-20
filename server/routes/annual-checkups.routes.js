const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const {
  validateCreateAnnualCheckup,
  validateUpdateAnnualCheckup,
} = require("../modules/annual-checkups/annual-checkups.validation");
const { validateRequest } = require("../middleware/validate.middleware");

const {
  createAnnualCheckup,
  getAnnualCheckups,
  getAnnualCheckupByIdCtrl,
  updateAnnualCheckupCtrl,
  deleteAnnualCheckupCtrl,
} = require("../modules/annual-checkups/annual-checkups.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Annual Checkups
 *   description: CRUD APIs for SC_ANNUAL_POSTNATAL_CHECKUP
 */

/**
 * @swagger
 * /annual-checkup:
 *   post:
 *     summary: Create annual checkup
 *     tags: [Annual Checkups]
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
 *             IS_BREAST_FEEDING: true
 *             BREAST_FEEDING_DURATION: 1
 *             BIRTH_SPACING_PRACTICES: 1
 *             DATA_SOURCE: "WEB"
 *             CREATED_BY_LATITUDE: 33.6844
 *             CREATED_BY_LONGITUDE: 73.0479
 *     responses:
 *       201:
 *         description: Created
 */
router.post(
  "/annual-checkup",
  authMiddleware,
  validateCreateAnnualCheckup,
  validateRequest,
  createAnnualCheckup
);

/**
 * @swagger
 * /annual-checkup:
 *   get:
 *     summary: Get annual checkups list
 *     tags: [Annual Checkups]
 *     responses:
 *       200:
 *         description: List returned
 */
router.get("/annual-checkup", authMiddleware, getAnnualCheckups);

/**
 * @swagger
 * /annual-checkup/{id}:
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
router.get("/annual-checkup/:id", authMiddleware, getAnnualCheckupByIdCtrl);

/**
 * @swagger
 * /annual-checkup/{id}:
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
 *             IS_BREAST_FEEDING: true
 *             BREAST_FEEDING_DURATION: 1
 *             BIRTH_SPACING_PRACTICES: 1
 *             DATA_SOURCE: "WEB"
 *             CREATED_BY_LATITUDE: 33.6844
 *             CREATED_BY_LONGITUDE: 73.0479
 *     responses:
 *       200:
 *         description: Updated
 */
router.put(
  "/annual-checkup/:id",
  authMiddleware,
  validateUpdateAnnualCheckup,
  validateRequest,
  updateAnnualCheckupCtrl
);

/**
 * @swagger
 * /annual-checkup/{id}:
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
router.delete("/annual-checkup/:id", authMiddleware, deleteAnnualCheckupCtrl);

module.exports = router;


