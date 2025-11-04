import express from 'express';
import authenticateToken from '../middleware/auth.js';
import {
  getTasks,
  createTask,
  updateTask,
  changeStatus,
  deleteTask
} from '../controllers/taskController.js';

import { createTaskValidator } from '../validators/taskValidator.js';
import validate from '../middleware/validate.js';


const router = express.Router();

router.get('/', authenticateToken, getTasks);
router.post('/', authenticateToken,createTaskValidator, validate, createTask);
router.put('/:id', authenticateToken, updateTask);
router.put('/status/:id', authenticateToken, changeStatus);
router.delete('/:id', authenticateToken, deleteTask);

export default router;
