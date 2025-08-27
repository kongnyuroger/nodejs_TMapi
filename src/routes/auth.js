import express from 'express'

import bcrypt from 'bcrypt'

const router = express()

const users = [];

router.post('/register', function(req, res, next){
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'username and password required' });
    }

    const user = users.find (u => u.username === username)

    if(password.length < 8){
        return res.status(400).json({ error: 'password must be at least 8 characters' });    
    }

    const hashPassword = bcrypt.hash(password, 10)
    if(!user){
        const newuser = {
          id: users.length + 1,
          username,
          password: hashPassword,

        }
        users.push(newuser)
        return res.json({message: "registration successful"})
    }

    return res.json({message: "user already exist"})
})

router.post('/login', function(req,res, next){
    
})

export default router 