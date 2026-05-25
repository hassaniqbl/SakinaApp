const express = require("express");
const authRoutesController = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

const { validateLogout, validateForgotPassword } = require("../modules/auth/auth.validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/login:
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
router.post("/auth/login", authRoutesController.login);

// POST /auth/logout
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     description: Logout the currently authenticated user and invalidate the access token/session.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [USER_ID]
 *             properties:
 *               USER_ID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "User logged out successfully" }
 *             example:
 *               success: true
 *               message: "User logged out successfully"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Validation error"
 *               error: { errors: ["USER_ID is required"] }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error: {}
 */
router.post("/auth/logout", validateLogout, authRoutesController.logout);

// POST /auth/forgot-password
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot Password
 *     tags: [Auth]
 *     description: Send password reset instructions to the registered email address.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [EMAIL_ADDRESS]
 *             properties:
 *               EMAIL_ADDRESS:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset instructions sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Password reset instructions sent successfully" }
 *             example:
 *               success: true
 *               message: "Password reset instructions sent successfully"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Validation error"
 *               error: { errors: ["EMAIL_ADDRESS must be a valid email address"] }
 *       404:
 *         description: Email address not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Email address not found"
 *               error: {}
 */
router.post("/auth/forgot-password", validateForgotPassword, authRoutesController.forgotPassword);

module.exports = router;


