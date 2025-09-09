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
router.post('/', authenticateToken, async function(req, res, next) {
  const {title, description} = req.body;
  const userId = req.user.id
  if (!title || !description){
    res.json("title and description required")
  }
try{ 
  const newTask = await pool.query('insert into tasks (title, content, user_id) values($1, $2, $3) returning *', [title, description, userId]);
  console.log(newTask)
  res.json(newTask.rows)
}catch(err){
  res.json({erro:err})
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
