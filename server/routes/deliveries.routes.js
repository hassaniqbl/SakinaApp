const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const { createDelivery, getDeliveries, getDeliveryByIdCtrl, updateDeliveryCtrl, deleteDeliveryCtrl } = require("../modules/deliveries/deliveries.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Deliveries
 *   description: CRUD APIs for SC_DELIVERY
 */

/**
 * @swagger
 * /deliveries:
 *   post:
 *     summary: Create delivery
 *     tags: [Deliveries]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               PATIENT_ID: 16
 *               BABY_DEATH_REASON: null
 *               MOTHER_DEATH_REASON: null
 *               FEEDBACK_ON_CBK: "Good service"
 *               DELIVERY_CENTRE: "Holy Family Hospital"
 *               DATE_OF_DELIVERY: "2024-01-15"
 *               MODE_OF_DELIVERY: "Normal"
 *               BLOOD_LOSS_DURING_DELIVERY: "Low"
 *               IS_BABY_ALIVE: true
 *               IS_MOTHER_ALIVE: true
 *               PREGNANCY_PERIOD_WEEKS: 38
 *               PREGNANCY_PERIOD_DAYS: 4
 *               IS_BREAST_FEED_DURING_FIRST_HOUR: true
 *               IS_COLOSTRUM_BREASTMILK_GIVEN: true
 *               IS_KANGAROO_CARE: false
 *               FOLLOW_UP_DATE: "2024-01-22"
 *               ANTENATAL_VISITS: 5
 *               DATA_SOURCE: "Mobile App"
 *               CREATED_BY_LATITUDE: "33.6844"
 *               CREATED_BY_LONGITUDE: "73.0479"
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/deliveries", authMiddleware, createDelivery);

/**
 * @swagger
 * /deliveries:
 *   get:
 *     summary: Get deliveries list
 *     tags: [Deliveries]
 *     responses:
 *       200:
 *         description: List returned
 */
router.get("/deliveries", authMiddleware, getDeliveries);

/**
 * @swagger
 * /deliveries/{id}:
 *   get:
 *     summary: Get delivery by id
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delivery object
 */
router.get("/deliveries/:id", authMiddleware, getDeliveryByIdCtrl);

/**
 * @swagger
 * /deliveries/{id}:
 *   put:
 *     summary: Update delivery
 *     tags: [Deliveries]
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
 *             properties:
 *               PATIENT_ID:
 *                 type: integer
 *                 example: 16
 *               BABY_DEATH_REASON:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               MOTHER_DEATH_REASON:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               FEEDBACK_ON_CBK:
 *                 type: string
 *                 nullable: true
 *                 example: "Good service"
 *               DELIVERY_CENTRE:
 *                 type: integer
 *                 nullable: true
 *                 example: 212121
 *               DATE_OF_DELIVERY:
 *                 type: string
 *                 nullable: true
 *                 example: "2024-01-15"
 *               MODE_OF_DELIVERY:
 *                 type: integer
 *                 nullable: true
 *                 example: 3232
 *               BLOOD_LOSS_DURING_DELIVERY:
 *                 type: integer
 *                 nullable: true
 *                 example: 3232
 *               IS_BABY_ALIVE:
 *                 type: boolean
 *                 nullable: true
 *                 example: true
 *               IS_MOTHER_ALIVE:
 *                 type: boolean
 *                 nullable: true
 *                 example: true
 *               PREGNANCY_PERIOD_WEEKS:
 *                 type: integer
 *                 nullable: true
 *                 example: 3232
 *               PREGNANCY_PERIOD_DAYS:
 *                 type: integer
 *                 nullable: true
 *                 example: 322
 *               IS_BREAST_FEED_DURING_FIRST_HOUR:
 *                 type: boolean
 *                 nullable: true
 *                 example: true
 *               IS_COLOSTRUM_BREASTMILK_GIVEN:
 *                 type: boolean
 *                 nullable: true
 *                 example: true
 *               IS_KANGAROO_CARE:
 *                 type: boolean
 *                 nullable: true
 *                 example: false
 *               FOLLOW_UP_DATE:
 *                 type: string
 *                 nullable: true
 *                 example: "2024-01-22"
 *               ANTENATAL_VISITS:
 *                 type: integer
 *                 nullable: true
 *                 example: 5
 *               DATA_SOURCE:
 *                 type: string
 *                 nullable: true
 *                 example: "WEB"
 *               CREATED_BY_LATITUDE:
 *                 type: number
 *                 format: double
 *                 nullable: true
 *                 example: 33.6844
 *               CREATED_BY_LONGITUDE:
 *                 type: number
 *                 format: double
 *                 nullable: true
 *                 example: 73.0479
 *           example:
 *             PATIENT_ID: 16
 *             BABY_DEATH_REASON: null
 *             MOTHER_DEATH_REASON: null
 *             FEEDBACK_ON_CBK: "Good service"
 *             DELIVERY_CENTRE: 212121
 *             DATE_OF_DELIVERY: "2024-01-15"
 *             MODE_OF_DELIVERY: 3232
 *             BLOOD_LOSS_DURING_DELIVERY: 3232
 *             IS_BABY_ALIVE: true
 *             IS_MOTHER_ALIVE: true
 *             PREGNANCY_PERIOD_WEEKS: 3232
 *             PREGNANCY_PERIOD_DAYS: 322
 *             IS_BREAST_FEED_DURING_FIRST_HOUR: true
 *             IS_COLOSTRUM_BREASTMILK_GIVEN: true
 *             IS_KANGAROO_CARE: false
 *             FOLLOW_UP_DATE: "2024-01-22"
 *             ANTENATAL_VISITS: 5
 *             DATA_SOURCE: "WEB"
 *             CREATED_BY_LATITUDE: 33.6844
 *             CREATED_BY_LONGITUDE: 73.0479
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Delivery updated successfully"
 *                 data:
 *                   type: object
 *                   example: {"affectedRows": 1}
 *                 pagination:
 *                   type: object
 *                   example: {}
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *       404:
 *         description: Delivery not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 */
router.put("/deliveries/:id", authMiddleware, updateDeliveryCtrl);

/**
 * @swagger
 * /deliveries/{id}:
 *   delete:
 *     summary: Delete delivery
 *     tags: [Deliveries]
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
router.delete("/deliveries/:id", authMiddleware, deleteDeliveryCtrl);

module.exports = router;

