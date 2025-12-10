// backend/Server.js
const express = require('express');
const cors = require('cors');
const db = require('./db'); // conexión MySQL

const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",  // Cambiar por el dominio de tu frontend en producción
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json()); // para parsear JSON

// --- Rutas CRUD ---

// Obtener todas las tareas
app.get('/tareas', (req, res) => {
  db.query('SELECT * FROM tareas', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Agregar tarea
app.post('/tareas', (req, res) => {
  const { titulo, descripcion } = req.body;
  db.query(
    'INSERT INTO tareas (titulo, descripcion) VALUES (?, ?)',
    [titulo, descripcion],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ id: results.insertId, titulo, descripcion, completado: false });
    }
  );
});

// Actualizar tarea (editar título o marcar completada)
app.put('/tareas/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, completado } = req.body;

  let query = 'UPDATE tareas SET ';
  const params = [];

  if (titulo !== undefined) {
    query += 'titulo = ? ';
    params.push(titulo);
  }

  if (completado !== undefined) {
    if (params.length > 0) query += ', ';
    query += 'completado = ? ';
    params.push(completado);
  }

  query += ' WHERE id = ?';
  params.push(id);

  db.query(query, params, (err) => {
    if (err) return res.status(500).send(err);
    db.query('SELECT * FROM tareas WHERE id = ?', [id], (err2, results) => {
      if (err2) return res.status(500).send(err2);
      res.json(results[0]);
    });
  });
});

// Eliminar tarea
app.delete('/tareas/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tareas WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Tarea eliminada' });
  });
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
