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



// Validate status transitions
const validTransition = (oldStatus, newStatus) => {
  const transitions = {
    todo: ["in-progress", "done"],
    "in-progress": ["done"],
    done: [], // only PATCH /complete can handle 'done' → 'todo' reset logic
  };
  return transitions[oldStatus]?.includes(newStatus);
};

// PUT /tasks/:id
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, description, due_date, status } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️ Fetch task and check ownership
    const taskRes = await client.query(
      "SELECT * FROM tasks WHERE id = $1 AND (created_by = $2 OR assigned_to = $2)",
      [parseInt(id), userId]
    );
    const task = taskRes.rows[0];

    if (!task) {
      await client.query("ROLLBACK");
      return res.status(403).json({ error: "Not authorized or task not found" });
    }

    // 2️Validate future due date
    if (due_date && new Date(due_date) <= new Date()) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Due date must be in the future" });
    }

    // 3️ Validate status transition
    if (status && !validTransition(task.status, status)) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        error: `Invalid status transition: ${task.status} → ${status}`,
      });
    }

    // 4️ Perform update
    const updatedTask = await client.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           due_date = COALESCE($3, due_date),
           status = COALESCE($4, status)
       WHERE id = $5
       RETURNING *`,
      [title, description, due_date, status, task.id]
    );

    await client.query("COMMIT");
    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Update task error:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};


// PATCH /tasks/:id/complete
export const completeTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️ Fetch task
    const taskRes = await client.query(
      "SELECT * FROM tasks WHERE id = $1 AND (created_by = $2 OR assigned_to = $2)",
      [parseInt(id), userId]
    );
    const task = taskRes.rows[0];

    if (!task) {
      await client.query("ROLLBACK");
      return res.status(403).json({ error: "Not authorized or task not found" });
    }

    // 2️ Skip if already completed
    if (task.status === "done") {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Task is already completed" });
    }

    // 3️Update status and timestamp
    const result = await client.query(
      `UPDATE tasks
       SET status = 'done',
           completed_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [task.id]
    );

    await client.query("COMMIT");
    return res.status(200).json({
      message: "Task marked as completed",
      task: result.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Complete task error:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    client.release();
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
