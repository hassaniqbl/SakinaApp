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
 * /api/deliveries:
 *   post:
 *     summary: Create delivery
 *     tags: [Deliveries]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/deliveries", authMiddleware, createDelivery);

/**
 * @swagger
 * /api/deliveries:
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
 * /api/deliveries/{id}:
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
 * /api/deliveries/{id}:
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated
 */
router.put("/deliveries/:id", authMiddleware, updateDeliveryCtrl);

/**
 * @swagger
 * /api/deliveries/{id}:
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

