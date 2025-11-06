import express from 'express';
import authlimit from '../middleware/ratelimiting.js';
import { registerUser, loginUser } from '../controllers/authController.js';
import { loginValidator, registerValidator} from '../validators/authValidator.js';
import validate from '../middleware/validate.js';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and account management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: rugadev
 *               email:
 *                 type: string
 *                 format: email
 *                 example: rugadev@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: rugapass123
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: successfully registered
 *       400:
 *         description: Missing or invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate a user and return a JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: rugadev@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: rugapass123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

const router = express.Router();

router.post('/register', registerValidator, validate, authlimit, registerUser);
router.post('/login',loginValidator, validate, authlimit, loginUser);

export default router;
