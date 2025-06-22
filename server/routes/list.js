const express = require('express');
const db = require('../db');
const router = express.Router();

// שליפת כל האירועים של משתמש לפי userId
router.get('/:userId', (req, res) => {
  const sql = 'SELECT * FROM events WHERE userId = ? ORDER BY eventDate DESC';
  db.query(sql, [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'שגיאה בשליפת אירועים' });
    res.json(results);
  });
});

// הוספת אירוע חדש
router.post('/', (req, res) => {
  const { userId, eventName, eventDate, budget, notes } = req.body;
  const sql = `
    INSERT INTO events (userId, eventName, eventDate, budget, notes)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [userId, eventName, eventDate, budget, notes], (err, result) => {
    if (err) return res.status(500).json({ error: 'שגיאה בהוספת אירוע' });
    res.json({ message: 'אירוע נוסף בהצלחה', eventId: result.insertId });
  });
});

// עריכת אירוע קיים
router.put('/:id', (req, res) => {
  const { eventName, eventDate, budget, notes } = req.body;
  const sql = `
    UPDATE events
    SET eventName = ?, eventDate = ?, budget = ?, notes = ?
    WHERE id = ?
  `;
  db.query(sql, [eventName, eventDate, budget, notes, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'שגיאה בעדכון אירוע' });
    res.json({ message: 'האירוע עודכן בהצלחה' });
  });
});

// מחיקת אירוע לפי id
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM events WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'שגיאה במחיקת אירוע' });
    res.json({ message: 'האירוע נמחק בהצלחה' });
  });
});

module.exports = router;
