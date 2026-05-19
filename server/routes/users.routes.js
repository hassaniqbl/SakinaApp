const express = require("express");
const {
  createUser,
  getUsers,
  getUserByIdCtrl,
  updateUserCtrl,
  deleteUserCtrl,
} = require("../modules/users/users.controller");

const { authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - EMAIL
 *         - PASS
 *       properties:
 *         EMAIL:
 *           type: string
 *           example: admin@example.com
 *         PASS:
 *           type: string
 *           example: Admin@123
 *         USER_ROLE:
 *           type: string
 *           example: ADMIN
 *         LOCATION_ID:
 *           type: integer
 *           example: 1
 *         FIRSTNAME:
 *           type: string
 *           example: Hassan
 *         LASTNAME:
 *           type: string
 *           example: Iqbal
 *         CONTACT:
 *           type: string
 *           example: +923001234567
 *         ADDRESS:
 *           type: string
 *           example: Rawalpindi Pakistan
 *         PROFILE_PICTURE_URL:
 *           type: string
 *           example: https://example.com/profile.jpg
 *         added_by:
 *           type: integer
 *           example: 1
 *
 *     UpdateUserRequest:
 *       type: object
 *       required:
 *         - EMAIL
 *       properties:
 *         EMAIL:
 *           type: string
 *           example: updated@example.com
 *         USER_ROLE:
 *           type: string
 *           example: STAFF
 *         LOCATION_ID:
 *           type: integer
 *           example: 2
 *         FIRSTNAME:
 *           type: string
 *           example: Ali
 *         LASTNAME:
 *           type: string
 *           example: Raza
 *         CONTACT:
 *           type: string
 *           example: +923009998887
 *         ADDRESS:
 *           type: string
 *           example: Islamabad Pakistan
 *         PROFILE_PICTURE_URL:
 *           type: string
 *           example: https://example.com/new-profile.jpg
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: CRUD APIs for SC_USER
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *           example:
 *             EMAIL: admin@example.com
 *             PASS: Admin@123
 *             USER_ROLE: ADMIN
 *             LOCATION_ID: 1
 *             FIRSTNAME: Hassan
 *             LASTNAME: Iqbal
 *             CONTACT: +923001234567
 *             ADDRESS: Rawalpindi Pakistan
 *             PROFILE_PICTURE_URL: https://example.com/profile.jpg
 *             added_by: 1
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post("/users", authMiddleware, createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/users", authMiddleware, getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: User object
 *       404:
 *         description: User not found
 */
router.get("/users/:id", authMiddleware, getUserByIdCtrl);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *           example:
 *             EMAIL: updated@example.com
 *             USER_ROLE: STAFF
 *             LOCATION_ID: 2
 *             FIRSTNAME: Ali
 *             LASTNAME: Raza
 *             CONTACT: +923009998887
 *             ADDRESS: Islamabad Pakistan
 *             PROFILE_PICTURE_URL: https://example.com/new-profile.jpg
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put("/users/:id", authMiddleware, updateUserCtrl);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete("/users/:id", authMiddleware, deleteUserCtrl);

module.exports = router;