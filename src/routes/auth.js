import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const router = express()

const users = [{username: "roger", password:"12345678"}];

router.post('/register', async function(req, res, next){
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'username and password required' });
    }

    const user = users.find (u => u.username === username)

    if(password.length < 8){
        return res.status(400).json({ error: 'password must be at least 8 characters' });    
    }

    const hashPassword = await bcrypt.hash(password, 10)
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


router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password required' });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'invalid credentials' });
    }

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
  
});
export default router 