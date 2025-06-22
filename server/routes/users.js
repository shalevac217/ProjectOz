const express = require('express');
const db = require('../db');
const router = express.Router();

// רישום
router.post('/register', async (req, res) => {
  console.log('📦 body from client:', req.body); // כאן תראי מה באמת הגיע

  const { name, email, password } = req.body;
  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.error('❌ Error inserting user:', err);
      return res.status(500).json({ error: 'שגיאה ביצירת משתמש' });
    }
    res.json({  message: 'משתמש נוצר בהצלחה',success: true, userId: result.insertId  });

  });
});

// התחברות
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: 'משתמש לא נמצא' });

    const user = results[0];

    if (password==user.password) {
      res.json({ message: 'התחברת בהצלחה', userId: user.id });
    } else {
      res.status(401).json({ error: 'סיסמה שגויה' });
    }
  });
});

module.exports = router;
