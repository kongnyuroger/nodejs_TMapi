import express from "express"
import tasks from "../dumydb.js";

const router = express.Router();



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json(tasks);
});

//add task
router.post('/', function(req, res, next) {
  const {title, description} = req.body;
  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    status: "pending",
    created_at: new Date()
  }
  tasks.push(newTask);
  res.json(newTask)
});

//update task
router.put('/:id', function(req, res, next) {
  const task = tasks.find(t => t.id === parseInt(req.params.id) )
   if(!task){
    return res.status(400).json({message: "task not found"})
   }

   task.title = req.body.title || task.title
   task.description = req.body.description || task.description

   return res.status(202).json(task)
});

router.delete('/:id', function(req, res, next){
  const task = tasks.find(t => t.id === parseInt(req.params.id) );
  if(!task){
    return res.status(400).json({error: "task not found"})
   }

  return res.json(tasks.filter(t => t.id !== parseInt(req.params.id)))
})

router.put('/completed/:id', function(req, res, next){
  const task = tasks.find(t => t.id === parseInt(req.params.id) );
  if(!task){
    return res.status(400).json({error: "task not found"})
   }
  task.status = "completed";
  return res.status(200).json(task);
})
export default router;
