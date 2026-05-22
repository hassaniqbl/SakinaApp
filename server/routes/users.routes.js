const express = require("express");
const {
  createUser,
  getUsers,
  getUserByIdCtrl,
  updateUserCtrl,
  deleteUserCtrl,
} = require("../modules/users/users.controller");

const { validateCreateUser, validateUpdateUser } = require("../modules/users/users.validation");
const { authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - EMAIL_ADDRESS
 *         - PASS
 *       properties:
 *         ACCOUNT_GUID:
 *           type: string
 *           example: abc-123-guid
 *         EMAIL_ADDRESS:
 *           type: string
 *           example: admin@example.com
 *         PASS:
 *           type: string
 *           example: Admin@123
 *         ROLE_ID:
 *           type: integer
 *           example: 1
 *         LOCATION_ID:
 *           type: integer
 *           example: 1
 *         FIRST_NAME:
 *           type: string
 *           example: Hassan
 *         LAST_NAME:
 *           type: string
 *           example: Iqbal
 *         PHONE_NUMBER:
 *           type: string
 *           example: +923001234567
 *         ADDRESS_LINE1:
 *           type: string
 *           example: Rawalpindi Pakistan
 *         ADDRESS_LINE2:
 *           type: string
 *           example: Sector 1
 *         PROFILE_PICTURE_URL:
 *           type: string
 *           example: https://example.com/profile.jpg
 *         IS_ACTIVE:
 *           type: integer
 *           example: 1
 *         ADDED_BY:
 *           type: integer
 *           example: 1
 *
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         ACCOUNT_GUID:
 *           type: string
 *         EMAIL_ADDRESS:
 *           type: string
 *         PASS:
 *           type: string
 *         ROLE_ID:
 *           type: integer
 *         LOCATION_ID:
 *           type: integer
 *         FIRST_NAME:
 *           type: string
 *         LAST_NAME:
 *           type: string
 *         PHONE_NUMBER:
 *           type: string
 *         ADDRESS_LINE1:
 *           type: string
 *         ADDRESS_LINE2:
 *           type: string
 *         PROFILE_PICTURE_URL:
 *           type: string
 *         IS_ACTIVE:
 *           type: integer
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: CRUD APIs for ADM_USER
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
router.post("/users", authMiddleware, validateCreateUser, createUser);

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
router.put("/users/:id", authMiddleware, validateUpdateUser, updateUserCtrl);

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