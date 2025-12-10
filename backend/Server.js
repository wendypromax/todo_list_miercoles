// backend/Server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db'); // tu conexión a MySQL

const app = express();
const PORT = process.env.PORT || 8080;

// ===== CONFIGURAR CORS =====
const allowedOrigins = [
  "http://localhost:5173", // tu frontend local
  "https://adventurous-curiosity-production-3d05.up.railway.app" // dominio de producción
];

app.use(cors({
  origin: function(origin, callback) {
    // permitir solicitudes sin origen (como Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `La política CORS bloqueó el acceso desde: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

// ===== RUTAS API =====

// Obtener todas las tareas
app.get('/tareas', (req, res) => {
  db.query('SELECT * FROM tareas', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Crear tarea
app.post('/tareas', (req, res) => {
  const { titulo, descripcion } = req.body;
  db.query(
    'INSERT INTO tareas (titulo, descripcion, completado) VALUES (?, ?, 0)',
    [titulo, descripcion],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: result.insertId,
        titulo,
        descripcion,
        completado: 0
      });
    }
  );
});

// Actualizar tarea
app.put('/tareas/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, completado } = req.body;

  db.query('SELECT * FROM tareas WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ error: 'Tarea no encontrada' });

    const tarea = results[0];
    const nuevoTitulo = titulo ?? tarea.titulo;
    const nuevaDescripcion = descripcion ?? tarea.descripcion;
    const nuevoCompletado =
      completado !== undefined ? Number(completado) : tarea.completado;

    db.query(
      'UPDATE tareas SET titulo = ?, descripcion = ?, completado = ? WHERE id = ?',
      [nuevoTitulo, nuevaDescripcion, nuevoCompletado, id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
          id,
          titulo: nuevoTitulo,
          descripcion: nuevaDescripcion,
          completado: nuevoCompletado
        });
      }
    );
  });
});

// Eliminar tarea
app.delete('/tareas/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tareas WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json({ message: 'Tarea eliminada', id });
  });
});

// ===== SERVIR FRONTEND (OPCIONAL) =====
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ===== INICIAR SERVIDOR =====
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
