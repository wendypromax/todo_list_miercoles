// backend/Server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Obtener todas las tareas
app.get('/tareas', (req, res) => {
  db.query('SELECT * FROM tareas', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Agregar tarea
app.post('/tareas', (req, res) => {
  const { titulo } = req.body;
  db.query('INSERT INTO tareas (titulo) VALUES (?)', [titulo], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, titulo });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
