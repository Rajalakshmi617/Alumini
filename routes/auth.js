const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { protect } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, company, designation, department, batch, skills, linkedin } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Please fill all required fields' });
    }

    if (!['student', 'alumni'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash, role, is_verified) VALUES (?,?,?,?,?)',
      [name, email, hash, role, role === 'student']
    );

    await db.query(
      'INSERT INTO profiles (user_id, company, designation, department, batch, skills, linkedin) VALUES (?,?,?,?,?,?,?)',
      [result.insertId, company || null, designation || null, department || null, batch || null, skills || null, linkedin || null]
    );

    res.json({ message: 'Registered successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already registered' });
    }
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.is_verified) {
      return res.status(403).json({ error: 'Account not verified yet' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/me', protect, (req, res) => {
  res.json({ message: 'Token is valid', user: req.user });
});

module.exports = router;