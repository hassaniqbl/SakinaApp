const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const { createAnemiaPerforma, getAnemiaPerformas, getAnemiaPerformaByIdCtrl, updateAnemiaPerformaCtrl, deleteAnemiaPerformaCtrl } = require("../modules/anemia-performa/anemia-performa.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Anemia Performa
 *   description: CRUD APIs for SC_ANEMIA_PERFORMA
 */

/**
 * @swagger
 * /api/anemia-performa:
 *   post:
 *     summary: Create anemia performa
 *     tags: [Anemia Performa]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/anemia-performa", authMiddleware, createAnemiaPerforma);

/**
 * @swagger
 * /api/anemia-performa:
 *   get:
 *     summary: Get anemia performas list
 *     tags: [Anemia Performa]
 *     responses:
 *       200:
 *         description: List returned
 */
router.get("/anemia-performa", authMiddleware, getAnemiaPerformas);

/**
 * @swagger
 * /api/anemia-performa/{id}:
 *   get:
 *     summary: Get anemia performa by id
 *     tags: [Anemia Performa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Performa object
 */
router.get("/anemia-performa/:id", authMiddleware, getAnemiaPerformaByIdCtrl);

/**
 * @swagger
 * /api/anemia-performa/{id}:
 *   put:
 *     summary: Update anemia performa
 *     tags: [Anemia Performa]
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
router.put("/anemia-performa/:id", authMiddleware, updateAnemiaPerformaCtrl);

/**
 * @swagger
 * /api/anemia-performa/{id}:
 *   delete:
 *     summary: Delete anemia performa
 *     tags: [Anemia Performa]
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
router.delete("/anemia-performa/:id", authMiddleware, deleteAnemiaPerformaCtrl);

module.exports = router;

