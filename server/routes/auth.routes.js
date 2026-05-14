const express = require("express");
const { login } = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: doctor@example.com }
 *               password: { type: string, example: your_password }
 *     responses:
 *       200:
 *         description: Token returned
 */
router.post("/auth/login", login);

module.exports = router;

