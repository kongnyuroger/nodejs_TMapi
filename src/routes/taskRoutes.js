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
/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks (with pagination & sorting)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit number of tasks (default 10)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset for pagination
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [due_date, status, created_at]
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         due_date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [todo, in-progress, done]
 *         created_by:
 *           type: integer
 *         assigned_to:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 */



const router = express.Router();

router.get('/', authenticateToken, getTasks);
router.post('/', authenticateToken,createTaskValidator, validate, createTask);
router.put("/:id", authenticateToken, updateTask);
router.delete('/:id', authenticateToken, deleteTask);
router.patch("/:id/complete", authenticateToken, completeTask);
export default router;
