const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer para manejo de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile_images/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Obtener la información del usuario
router.get('/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [user] = await db.query('SELECT name, email, profile_image FROM users WHERE id = ?', [userId]);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar la información del usuario
router.put('/profile/:userId', upload.single('profileImage'), async (req, res) => {
  const { userId } = req.params;
  const { name, email } = req.body;
  const profileImage = req.file ? `/uploads/profile_images/${req.file.filename}` : null;

  try {
    let query = 'UPDATE users SET name = ?, email = ?';
    const values = [name, email];
    if (profileImage) {
      query += ', profile_image = ?';
      values.push(profileImage);
    }
    query += ' WHERE id = ?';
    values.push(userId);

    await db.query(query, values);
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
