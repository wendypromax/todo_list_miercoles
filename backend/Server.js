// Server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importa tu conexión a la DB desde db.js
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --------------------- RUTAS API ---------------------

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

  console.log("PUT recibido:", req.body); // DEBUG

  db.query('SELECT * FROM tareas WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ error: 'Tarea no encontrada' });

    const tarea = results[0];

    const nuevoTitulo = titulo !== undefined ? titulo : tarea.titulo;
    const nuevaDescripcion = descripcion !== undefined ? descripcion : tarea.descripcion;

    // 🔥 FIX: convertir boolean → número
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

// ------------------- SERVIR FRONTEND -------------------
const frontendBuildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendBuildPath));

// React router (AL FINAL)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// ------------------- INICIAR SERVIDOR -------------------
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
