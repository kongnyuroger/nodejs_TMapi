import jwt from 'jsonwebtoken';
import pool from '../database/db.js';
import { hashPassword, verifyPassword } from '../utils/crypto.js';

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'username, email and password required' });
    }

    const checkExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (password.length < 8) {
      return res.status(400).json({ error: 'password must be at least 8 characters' });
    }

    if (checkExist.rows.length === 0) {
      const hashPass = await hashPassword(password);
      await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
        [username, email, hashPass]
      );
      return res.json({ message: 'successfully registered' });
    }

    return res.json({ message: 'user already exists' });
  } catch (err) {
    console.error('Register route error:', err);
    return res.status(500).json({ error: 'internal server error', message: err.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }

    const checkExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
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
  } catch (err) {
    console.error('Login route error:', err);
    return res.status(500).json({ error: 'internal server error', message: err.message });
  }
};
