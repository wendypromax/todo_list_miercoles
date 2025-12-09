const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());

// Conexión a PostgreSQL usando Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Obtener todas las tareas
app.get('/tareas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tareas ORDER BY fecha_creacion DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener tareas');
  }
});

// Crear nueva tarea
app.post('/tareas', async (req, res) => {
  const { titulo, descripcion } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tareas (titulo, descripcion) VALUES ($1, $2) RETURNING *',
      [titulo, descripcion || '']
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear tarea');
  }
});

// Editar tarea (incluye marcar/subrayar)
app.put('/tareas/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, estado } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tareas SET titulo=$1, descripcion=$2, estado=$3 WHERE id=$4 RETURNING *',
      [titulo, descripcion, estado, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar tarea');
  }
});

// Eliminar tarea
app.delete('/tareas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tareas WHERE id=$1', [id]);
    res.send({ message: 'Tarea eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar tarea');
  }
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
