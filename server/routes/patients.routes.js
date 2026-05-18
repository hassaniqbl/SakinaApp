const express = require("express");

const {
  createPatient,
  getPatients,
  getPatientByIdCtrl,
  updatePatientCtrl,
  deletePatientCtrl,
} = require("../modules/patients/patients.controller");

// Auth disabled for testing
const { authMiddleware } = require("../middleware/auth.middleware");


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Patients
 */

/**
 * @swagger
 * /patients:
 *   post:

 *     summary: Create patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatientProfile'
 *     responses:
 *       201:
 *         description: Patient created
 */
router.post("/patients", authMiddleware, createPatient);

/**
 * @swagger
 * /patients:
 *   get:

 *     summary: Get list of patients
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: List of patients
 */
router.get("/patients", authMiddleware, getPatients);

/**
 * @swagger
 * /patients/{id}:
 *   get:

 *     summary: Get patient by id
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient object
 *       404:
 *         description: Not found
 */
router.get("/patients/:id", authMiddleware, getPatientByIdCtrl);

/**
 * @swagger
 * /patients/{id}:
 *   put:

 *     summary: Update patient by id
 *     tags: [Patients]
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
 *             $ref: '#/components/schemas/PatientProfile'
 *     responses:
 *       200:
 *         description: Patient updated
 */
router.put("/patients/:id", authMiddleware, updatePatientCtrl);

/**
 * @swagger
 * /patients/{id}:
 *   delete:

 *     summary: Delete patient by id
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient deleted
 */
router.delete("/patients/:id", authMiddleware, deletePatientCtrl);

module.exports = router;

