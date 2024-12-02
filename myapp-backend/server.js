const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();

// Configuración de MySQL
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: "EpitaphMarch#000115",
    database: 'myapp_db'
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
app.get('/api/user/profile/:userId', (req, res) => {
    const { userId } = req.params;
    db.query('SELECT id, username AS name, email, profile_image AS profileImage FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(results[0]);
    });
});

// Actualizar la información del usuario
app.put('/api/user/profile/:userId', upload.single('profileImage'), (req, res) => {
    const { userId } = req.params;
    const { name, email } = req.body;
    const profileImage = req.file ? `/uploads/profile_images/${req.file.filename}` : null;

    let query = 'UPDATE users SET username = ?, email = ?';
    const values = [name, email];
    if (profileImage) {
        query += ', profile_image = ?';
        values.push(profileImage);
    }
    query += ' WHERE id = ?';
    values.push(userId);

    db.query(query, values, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Profile updated successfully' });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
