// backend/src/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db'); // conexión a MySQL en este mismo folder

const app = express();
const PORT = process.env.PORT || 8080;

// ===== CONFIGURAR CORS =====
const allowedOrigins = [
  'http://localhost:5173',
  'https://adventurous-curiosity-production-3d05.up.railway.app'
];

// Permitir también subdominios de Vercel (ej. https://frontend-xxxxx.vercel.app)
// Configurar CORS: aceptar orígenes listados y subdominios de vercel.app
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      const msg = `La política CORS bloqueó el acceso desde: ${origin}`;
      return callback(new Error(msg), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  })
);

app.use(express.json());

// ===== RUTAS API =====
app.get('/tareas', (req, res) => {
  db.query('SELECT * FROM tareas', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

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

app.put('/tareas/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, completado } = req.body;

  db.query('SELECT * FROM tareas WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Tarea no encontrada' });

    const tarea = results[0];
    const nuevoTitulo = titulo ?? tarea.titulo;
    const nuevaDescripcion = descripcion ?? tarea.descripcion;
    const nuevoCompletado = completado !== undefined ? Number(completado) : tarea.completado;

    db.query(
      'UPDATE tareas SET titulo = ?, descripcion = ?, completado = ? WHERE id = ?',
      [nuevoTitulo, nuevaDescripcion, nuevoCompletado, id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id, titulo: nuevoTitulo, descripcion: nuevaDescripcion, completado: nuevoCompletado });
      }
    );
  });
});

app.delete('/tareas/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tareas WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json({ message: 'Tarea eliminada', id });
  });
});

// ===== SERVIR FRONTEND (OPCIONAL) =====
// Si quieres servir el build del frontend desde el backend, asegurarse de que la ruta es correcta.
const frontendPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ===== INICIAR SERVIDOR =====
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
