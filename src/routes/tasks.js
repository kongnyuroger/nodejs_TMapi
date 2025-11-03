import express from "express"
//import tasks from "../dumydb.js";
import authenticateToken from "../middleware/auth.js";
const router = express.Router();
import pool from "../database/db.js";



/* GET users listing. */
router.get('/', async function(req, res, next) {
  try{ 
  const tasks = await pool.query('select * from tasks where user_id = $1',[req.user.id])
  res.json(tasks.rows);
  }catch(err){
    res.json({error: err.message})
  }
});

//add task
router.post('/', authenticateToken, async function (req, res, next) {
  try {
    const { title, description, due_date, assigned_to } = req.body;
    const created_by = req.user.id;

    
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const newTask = await pool.query(
      `
      INSERT INTO tasks (title, description, due_date, status, assigned_to, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [title, description, due_date || null, 'todo', assigned_to || null, created_by]
    );
    return res.status(201).json({
      message: "Task created successfully",
      task: newTask.rows[0],
    });

  } catch (err) {
    console.error("Error creating task:", err);
    return res.status(500).json({ error: "Internal server error", message: err.message });
  }
});


//update task
router.put('/:id', authenticateToken, async function(req, res, next) {
  const gettask =  await pool.query('SELECT * from tasks where id = $1',[parseInt(req.params.id)])
  const task = gettask.rows[0]
   if(!task){
    return res.status(400).json({message: "task not found"})
   }

   task.title = req.body.title || task.title
   task.content = req.body.description || task.content

   return res.status(202).json(task)
});

router.delete('/:id', authenticateToken, async function(req, res, next){
  const gettask =  await pool.query('SELECT * from tasks where id = $1',[parseInt(req.params.id)])

  const task = gettask.rows[0]
  if(!task){
    return res.status(400).json({error: "task not found"})
   }
  await pool.query('delete from tasks where  id = $1',[task.id])
  return res.json({message: "delete successful"})
})

router.put('/completed/:id', async function(req, res, next){
   const gettask =  await pool.query('SELECT * from tasks where id = $1',[parseInt(req.params.id)])
  const task = gettask.rows[0]
  try{ 
  if(!task){
    return res.status(400).json({error: "task not found"})
   }
  const competed = await pool.query(`update tasks set status = 'completed' where id = $1 returning *`,[task.id])
  return res.status(200).json(competed.rows);
  }catch(err){
    return res.json({error: err.message})
  }
})
export default router;
