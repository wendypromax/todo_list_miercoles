import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Ruta de prueba
app.get("/", (req, res) => {
  res.send("Backend funcionando ✅");
});

// Obtener todas las tareas
app.get("/tareas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tareas ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener tareas:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear tarea
app.post("/tareas", async (req, res) => {
  try {
    const { titulo } = req.body;
    if (!titulo) return res.status(400).json({ error: "El título es obligatorio" });

    const result = await pool.query(
      `INSERT INTO tareas (titulo, fecha_creacion, completado)
       VALUES ($1, CURRENT_DATE, false)
       RETURNING *`,
      [titulo]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al crear tarea:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar tarea (tachar/destachar)
app.put("/tareas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completado } = req.body;
    const result = await pool.query(
      "UPDATE tareas SET completado = $1 WHERE id = $2 RETURNING *",
      [completado, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Tarea no encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al actualizar tarea:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar tarea
app.delete("/tareas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM tareas WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Tarea no encontrada" });
    res.json({ message: "Tarea eliminada", tarea: result.rows[0] });
  } catch (err) {
    console.error("Error al eliminar tarea:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Puerto
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
