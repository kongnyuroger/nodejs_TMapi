import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import pool from '../database/db.js'
import authlimit from '../middleware/ratelimiting.js'
import { verifyPassword, hashPassword } from '../utils/crypto.js'

import 'dotenv/config'


const router = express()


router.post('/register', authlimit, async function(req, res, next){
  try{ 
    const {username, email, password} = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ error: 'username, email and password required' });
    }
    console.log(username, password, email)
//useing postgress
    const checkExist = await pool.query('SELECT * from users where email = $1',[email])
    if(password.length < 8){
        return res.status(400).json({ error: 'password must be at least 8 characters' });    
    }
    const hashPass= await hashPassword(password)
    console.log(hashPass)
    if(checkExist.rows.length === 0){
        
        const newUser = await pool.query(
      'INSERT INTO users (username,email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashPass]
    );
    return res.json({message: "successfuly registered"})
    }

   
    return res.json({message: "user already exist"})
  }catch (err) {
    console.error('Register route error:', err);  
    return res.status(500).json({ error: 'internal server error' , message: err.message});
  }
})


router.post('/login', authlimit, async (req, res) => {
  try{ 
    const {email, password} = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }

    const checkExist = await pool.query('SELECT * from users where email = $1',[email])
    
  const user = checkExist.rows[0];
  if (!user) {
    return res.status(401).json({ error: 'User with this email does not exist' });
  }

    const passwordOk = await verifyPassword(password, user.password);
    if (!passwordOk) {
      return res.status(401).json({ error: 'Check password and try again' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.SECRET_KEY,
      { expiresIn: '6h' }
    );

    return res.json({ message: 'Login successful', token });
  } catch(err){
    console.error('login route error:', err);  
    return res.status(500).json({ error: 'internal server error' , message: err.message});
  }
});
export default router 

//just adding this so i can push a piece of code