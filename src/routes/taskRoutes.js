import express from 'express';
import authenticateToken from '../middleware/auth.js';
import {
  getTasks,
  createTask,
  updateTask,
  changeStatus,
  deleteTask
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/', authenticateToken, getTasks);
router.post('/', authenticateToken, createTask);
router.put('/:id', authenticateToken, updateTask);
router.put('/status/:id', authenticateToken, changeStatus);
router.delete('/:id', authenticateToken, deleteTask);

export default router;
