const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const { createAnemiaCheckup, getAnemiaCheckups, getAnemiaCheckupByIdCtrl, updateAnemiaCheckupCtrl, deleteAnemiaCheckupCtrl } = require("../modules/anemia-checkups/anemia-checkups.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Anemia Checkups
 *   description: CRUD APIs for SC_ANEMIA_CHECKUP
 */

/**
 * @swagger
 * /anemia-checkups:
 *   post:
 *     summary: Create anemia checkup
 *     tags: [Anemia Checkups]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               PATIENT_ID: 1
 *               CHECKUP_DATE: "2024-01-15"
 *               HAEMOGLOBIN_COUNT: 10.5
 *               ANY_OTHER_SYMPTOMS: "Patient responding well"
 *               DATA_SOURCE: "APP"
 *               CREATED_BY_LATITUDE: 31.5204
 *               CREATED_BY_LONGITUDE: 74.3587
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/anemia-checkups", authMiddleware, createAnemiaCheckup);


/**
 * @swagger
 * /anemia-checkups:
 *   get:
 *     summary: Get anemia checkups list
 *     tags: [Anemia Checkups]
 *     responses:
 *       200:
 *         description: List returned
 */
router.get("/anemia-checkups", authMiddleware, getAnemiaCheckups);

/**
 * @swagger
 * /anemia-checkups/{id}:
 *   get:
 *     summary: Get anemia checkup by id
 *     tags: [Anemia Checkups]
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
router.get("/anemia-checkups/:id", authMiddleware, getAnemiaCheckupByIdCtrl);

/**
 * @swagger
 * /anemia-checkups/{id}:
 *   put:
 *     summary: Update anemia checkup
 *     tags: [Anemia Checkups]
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
 *             required:
 *               - PATIENT_ID
 *             properties:
 *               PATIENT_ID:
 *                 type: integer
 *                 example: 1
 *               CHECKUP_DATE:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-14T19:00:00.000Z"
 *               HAEMOGLOBIN_COUNT:
 *                 type: number
 *                 example: 10.5
 *               ANY_OTHER_SYMPTOMS:
 *                 type: string
 *                 example: "Patient responding well"
 *               DATA_SOURCE:
 *                 type: string
 *                 enum: [APP, WEB]
 *                 example: "APP"
 *               CREATED_BY_LATITUDE:
 *                 type: string
 *                 example: "31.5204000"
 *               CREATED_BY_LONGITUDE:
 *                 type: string
 *                 example: "74.3587000"
 *               UPDATED_BY:
 *                 type: integer
 *                 example: 1
 *             additionalProperties: false
 *           example:
 *             PATIENT_ID: 1
 *             CHECKUP_DATE: "2024-01-14T19:00:00.000Z"
 *             HAEMOGLOBIN_COUNT: "10.50"
 *             ANY_OTHER_SYMPTOMS: "Patient responding well"
 *             DATA_SOURCE: "APP"
 *             CREATED_BY_LATITUDE: "31.5204000"
 *             CREATED_BY_LONGITUDE: "74.3587000"
 *             UPDATED_BY: 1
 *     responses:
 *       200:
 *         description: Updated
 */
router.put("/anemia-checkups/:id", authMiddleware, updateAnemiaCheckupCtrl);

/**
 * @swagger
 * /anemia-checkups/{id}:
 *   delete:

 *     summary: Delete anemia checkup
 *     tags: [Anemia Checkups]
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
router.delete("/anemia-checkups/:id", authMiddleware, deleteAnemiaCheckupCtrl);

module.exports = router;

