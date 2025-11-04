import pool from '../database/db.js';

// Get all tasks for the logged-in user
export const getTasks = async (req, res) => {
  try {
    const tasks = await pool.query(
      'SELECT * FROM tasks WHERE created_by = $1 OR assigned_to = $1',
      [req.user.id]
    );
    res.json(tasks.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a task
export const createTask = async (req, res) => {
  try {
    const { title, description, due_date, assigned_to } = req.body;
    const created_by = req.user.id;

    const newTask = await pool.query(
      `INSERT INTO tasks (title, description, due_date, status, assigned_to, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description, due_date || null, 'todo', assigned_to || null, created_by]
    );

    res.status(201).json({ message: 'Task created successfully', task: newTask.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const gettask = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND created_by = $2',
      [parseInt(req.params.id), req.user.id]
    );
    const task = gettask.rows[0];

    if (!task) return res.status(400).json({ message: 'task not found' });

    const title = req.body.title || task.title;
    const description = req.body.description || task.description;
    const due_date = req.body.due_date || task.due_date;
    const status = req.body.status || task.status;

    const updated = await pool.query(
      `UPDATE tasks SET title = $1, description = $2, due_date = $3, status = $4 WHERE id = $5 RETURNING *`,
      [title, description, due_date, status, task.id]
    );

    res.status(202).json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Change task status
export const changeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const taskRes = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND (created_by = $2 OR assigned_to = $2)',
      [parseInt(req.params.id), req.user.id]
    );
    const task = taskRes.rows[0];
    if (!task) return res.status(403).json({ error: 'Not authorized or task not found' });

    const updated = await pool.query(
      `UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *`,
      [status, task.id]
    );

    res.status(200).json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const taskRes = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND (created_by = $2 OR assigned_to = $2)',
      [parseInt(req.params.id), req.user.id]
    );
    const task = taskRes.rows[0];
    if (!task) return res.status(403).json({ error: 'Not authorized or task not found' });

    await pool.query('DELETE FROM tasks WHERE id = $1', [task.id]);
    res.json({ message: 'delete successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
