const express = require("express");
const {
  createUser,
  getUsers,
  getUserByIdCtrl,
  updateUserCtrl,
  deleteUserCtrl,
} = require("../modules/users/users.controller");
// Temporary: auth disabled for testing
const { authMiddleware } = require("../middleware/auth.middleware");


const router = express.Router();

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
 *             type: object
 *     responses:
 *       201:
 *         description: User created
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
 *           type: string
 *     responses:
 *       200:
 *         description: User object
 *       404:
 *         description: Not found
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
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               USERNAME: "doctor1_updated"
 *               EMAIL: "doctor_updated@example.com"
 *               FULL_NAME: "Dr. John Smith"
 *               PHONE: "03119998888"
 *     responses:
 *       200:
 *         description: User updated
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
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted (soft)
 */
router.delete("/users/:id", authMiddleware, deleteUserCtrl);

module.exports = router;

