import express from "express";
import pool from "./db.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Obtener todas las tareas
app.get("/tareas", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tareas");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una tarea
app.post("/tareas", async (req, res) => {
  const { titulo, descripcion, prioridad, usuario_id } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO tareas (titulo, descripcion, prioridad, usuario_id) VALUES (?, ?, ?, ?)",
      [titulo, descripcion, prioridad, usuario_id]
    );

    res.json({ id: result.insertId, mensaje: "Tarea creada!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
