import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import pool from '../database/db.js'


const router = express()

const users = [{username: "roger", password:"12345678"}];

router.post('/register', async function(req, res, next){
  try{ 
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'username and password required' });
    }

    const user = users.find (u => u.username === username)
//useing postgress

    const checkExist = await pool.query('SELECT * from users where username = $1',[username])


    if(password.length < 8){
        return res.status(400).json({ error: 'password must be at least 8 characters' });    
    }

    const hashPassword = await bcrypt.hash(password, 10)

    if(checkExist.rows.length === 0){
        
        const newUser = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashPassword]
    );
    return res.json({message: "successfuly registered"})
    }

   
    return res.json({message: "user already exist"})
  }catch (err) {
    console.error('Register route error:', err);  
    return res.status(500).json({ error: 'internal server error' , message: err.message});
  }
})


router.post('/login', async (req, res) => {
  try{ 
    const {username, password} = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password required' });
    }

    const checkExist = await pool.query('SELECT * from users where username = $1',[username])

    if (checkExist.rows === 0) {
      return res.status(401).json({ error: 'invalid credentials' });
    }
    const user = checkExist.rows[0]
    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk) {
      return res.status(401).json({ error: 'invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      'secret_key',
      { expiresIn: '1h' }
    );

    return res.json({ message: 'Login successful', token });
  } catch(err){
    console.error('login route error:', err);  
    return res.status(500).json({ error: 'internal server error' , message: err.message});
  }
});
export default router 