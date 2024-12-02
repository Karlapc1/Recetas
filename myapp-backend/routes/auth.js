const express = require('express');
const router = express.Router();
const db = require('../db');

// Flag to control access based on login button press
let isLoggedIn = false;

// Registro
router.post('/register', (req, res) => {
  const { email, username, password } = req.body;
  const query = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';

  db.query(query, [email, username, password], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send({ message: 'Usuario registrado con éxito' });
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length > 0) {
      isLoggedIn = true; // Set the flag to true on successful login
      res.status(200).send({ message: 'Inicio de sesión exitoso' });
    } else {
      res.status(401).send({ message: 'Correo o contraseña incorrectos' });
    }
  });
});

// Middleware to bypass authentication if logged in
router.use((req, res, next) => {
  if (isLoggedIn) {
    next(); // Allow access if logged in
  } else {
    res.status(401).send({ message: 'Unauthorized access' });
  }
});

// Example protected endpoint
router.get('/some-protected-endpoint', (req, res) => {
  res.json({ message: 'This is a protected endpoint, accessible after login.' });
});

module.exports = router;
