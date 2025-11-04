import express from "express";
//import tasks from "../dumydb.js";
import authenticateToken from "../middleware/auth.js";
const router = express.Router();
import pool from "../database/db.js";

/* GET users listing. */
router.get("/", authenticateToken, async function (req, res, next) {
  try {
    const tasks = await pool.query(
      "select * from tasks where created_by = $1 or assigned_to = $1",
      [req.user.id]
    );
    res.json(tasks.rows);
  } catch (err) {
    res.json({ error: err.message });
  }
});

//add task
router.post("/", authenticateToken, async function (req, res, next) {
  try {
    const { title, description, due_date, assigned_to } = req.body;
    const created_by = req.user.id;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    const newTask = await pool.query(
      `
      INSERT INTO tasks (title, description, due_date, status, assigned_to, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        title,
        description,
        due_date || null,
        "todo",
        assigned_to || null,
        created_by,
      ]
    );
    return res.status(201).json({
      message: "Task created successfully",
      task: newTask.rows[0],
    });
  } catch (err) {
    console.error("Error creating task:", err);
    return res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
});

// update task
router.put("/:id", authenticateToken, async function (req, res, next) {
  try {
    const gettask = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND created_by = $2",
      [parseInt(req.params.id), req.user.id]
    );

    const task = gettask.rows[0];
    if (!task) {
      return res.status(400).json({ message: "task not found" });
    }

    const title = req.body.title || task.title;
    const description = req.body.description || task.description;
    const due_date = req.body.due_date || task.due_date;
    const status = req.body.status || task.status;

    const updated = await pool.query(
      `UPDATE tasks 
       SET title = $1, description = $2, due_date = $3, status = $4 
       WHERE id = $5 
       RETURNING *`,
      [title, description, due_date, status, task.id]
    );

    return res.status(202).json(updated.rows[0]);
  } catch (err) {
    console.error("Update task error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// change task status to 'in-progress'
router.put(
  "/in-progress/:id",
  authenticateToken,
  async function (req, res, next) {
    try {
      const taskRes = await pool.query(
        "SELECT * FROM tasks WHERE id = $1 AND (created_by = $2 OR assigned_to = $2)",
        [parseInt(req.params.id), req.user.id]
      );
      const task = taskRes.rows[0];

      if (!task) {
        return res
          .status(403)
          .json({ error: "Not authorized or task not found" });
      }

      const updated = await pool.query(
        `UPDATE tasks SET status = 'in-progress' WHERE id = $1 RETURNING *`,
        [task.id]
      );

      return res.status(200).json(updated.rows[0]);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

// change task status to 'done'
router.put(
  "/completed/:id",
  authenticateToken,
  async function (req, res, next) {
    try {
      const taskRes = await pool.query(
        "SELECT * FROM tasks WHERE id = $1 AND (created_by = $2 OR assigned_to = $2)",
        [parseInt(req.params.id), req.user.id]
      );
      const task = taskRes.rows[0];

      if (!task) {
        return res
          .status(403)
          .json({ error: "Not authorized or task not found" });
      }

      const completed = await pool.query(
        `UPDATE tasks SET status = 'done' WHERE id = $1 RETURNING *`,
        [task.id]
      );

      return res.status(200).json(completed.rows[0]);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

// revert task status to 'todo'
router.put("/todo/:id", authenticateToken, async function (req, res, next) {
  try {
    const taskRes = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND (created_by = $2 OR assigned_to = $2)",
      [parseInt(req.params.id), req.user.id]
    );
    const task = taskRes.rows[0];

    if (!task) {
      return res
        .status(403)
        .json({ error: "Not authorized or task not found" });
    }

    const updated = await pool.query(
      `UPDATE tasks SET status = 'todo' WHERE id = $1 RETURNING *`,
      [task.id]
    );

    return res.status(200).json(updated.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});



// delete task
router.delete("/delete/:id", authenticateToken, async function (req, res, next) {
  try {
    const taskRes = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND (created_by = $2 OR assigned_to = $2)",
      [parseInt(req.params.id), req.user.id]
    );

    const task = taskRes.rows[0];

    if (!task) {
      return res.status(403).json({ error: "Not authorized or task not found" });
    }

    await pool.query("DELETE FROM tasks WHERE id = $1", [task.id]);

    return res.json({ message: "delete successful" });

  } catch (err) {
    console.error("delete task error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
