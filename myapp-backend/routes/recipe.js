const express = require('express');
const multer = require('multer');
const db = require('../db');
const router = express.Router();

// Configuración de multer para manejo de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Ruta para añadir una receta (manejo de imagen como archivo o URL)
router.post('/', upload.single('image'), async (req, res) => {
  const { name, category, ingredients, instructions, user_id } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image; // Usa la URL si se proporciona

  try {
    const query = 'INSERT INTO recipes (name, category, ingredients, instructions, image, user_id) VALUES (?, ?, ?, ?, ?, ?)';
    const result = await db.query(query, [name, category, ingredients, instructions, image, user_id]);
    res.status(201).json({ id: result.insertId, name, category, ingredients, instructions, image, user_id });
  } catch (err) {
    console.error('Error adding recipe:', err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener detalles de la receta
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [recipe] = await db.query('SELECT * FROM recipes WHERE id = ?', [id]);
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener comentarios para una receta
router.get('/:id/comments', async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await db.query(`
      SELECT c.id, c.comment, c.created_at, u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.recipe_id = ?`, [id]);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Añadir comentario a una receta
router.post('/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const userId = req.user.id; // Supón que tienes middleware para gestionar la sesión de usuario
  try {
    const result = await db.query('INSERT INTO comments (recipe_id, user_id, comment) VALUES (?, ?, ?)', [id, userId, comment]);
    res.status(201).json({ id: result.insertId, comment, created_at: new Date() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
