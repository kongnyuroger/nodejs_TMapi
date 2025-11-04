import express from 'express';
import authlimit from '../middleware/ratelimiting.js';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', authlimit, registerUser);
router.post('/login', authlimit, loginUser);

export default router;
