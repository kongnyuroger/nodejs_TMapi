import express from 'express';
import authlimit from '../middleware/ratelimiting.js';
import { registerUser, loginUser } from '../controllers/authController.js';
import { loginValidator, registerValidator} from '../validators/authValidator.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.post('/register', registerValidator, validate, authlimit, registerUser);
router.post('/login',loginValidator, validate, authlimit, loginUser);

export default router;
