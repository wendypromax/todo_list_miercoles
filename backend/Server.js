import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

// PostgreSQL Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(cors());
app.use(express.json());

// ✅ ruta prueba
app.get("/", (req, res) => {
  res.send("Backend funcionando ✅");
});

// Obtener tareas
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
    const { descripcion } = req.body;
    const result = await pool.query(
      "INSERT INTO tareas (descripcion, completado) VALUES ($1, false) RETURNING *",
      [descripcion]
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
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
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
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    res.json({ message: "Tarea eliminada", tarea: result.rows[0] });
  } catch (err) {
    console.error("Error al eliminar tarea:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Puerto compatible con Render
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Servidor backend corriendo en puerto", PORT);
});