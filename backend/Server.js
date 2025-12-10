// backend/index.js
// ... tu código actual arriba

// 1️⃣ Obtener todas las tareas
app.get('/tareas', (req, res) => {
  db.query('SELECT * FROM tareas', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// 2️⃣ Actualizar tarea (marcar completada o editar título)
app.put('/tareas/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, completada } = req.body;

  // Construir query dinámicamente según lo que se envíe
  let query = 'UPDATE tareas SET ';
  const params = [];

  if (titulo !== undefined) {
    query += 'titulo = ? ';
    params.push(titulo);
  }

  if (completada !== undefined) {
    if (params.length > 0) query += ', ';
    query += 'completado = ? ';
    params.push(completada);
  }

  query += 'WHERE id = ?';
  params.push(id);

  db.query(query, params, (err) => {
    if (err) return res.status(500).send(err);
    db.query('SELECT * FROM tareas WHERE id = ?', [id], (err2, results) => {
      if (err2) return res.status(500).send(err2);
      res.json(results[0]);
    });
  });
});

// 3️⃣ Eliminar tarea
app.delete('/tareas/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tareas WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Tarea eliminada' });
  });
});
