import express from 'express';
import authenticateToken from '../middleware/auth.js';
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask, 
  completeTask
} from '../controllers/taskController.js';

import { createTaskValidator } from '../validators/taskValidator.js';
import validate from '../middleware/validate.js';


const router = express.Router();

router.get('/', authenticateToken, getTasks);
router.post('/', authenticateToken,createTaskValidator, validate, createTask);
router.put("/:id", authenticateToken, updateTask);
router.delete('/:id', authenticateToken, deleteTask);
router.patch("/:id/complete", authenticateToken, completeTask);
export default router;
