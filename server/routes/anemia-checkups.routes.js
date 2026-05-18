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
 *               HAEMOGLOBIN_LEVEL: 10.5
 *               IRON_SUPPLEMENTS: "Yes"
 *               FOLIC_ACID: "Yes"
 *               NOTES: "Patient responding well"
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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

