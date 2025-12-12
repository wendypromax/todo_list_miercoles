import TodoItem from "./todoitem";
import { useState, useEffect } from "react";

export default function App() {
  // Trigger redeploy
  const [tareas, setTareas] = useState([]);
  const [input, setInput] = useState("");

  // URL de la API
  const envApi = import.meta.env.VITE_API_URL;
  const defaultLocal = "http://localhost:8080";
  const PROD_BACKEND = "https://todolistmiercoles-production.up.railway.app";
  let inferredApi = envApi || defaultLocal;
  if (!envApi && typeof window !== "undefined" && window.location.hostname !== "localhost") {
    inferredApi = PROD_BACKEND;
  }
  const API = inferredApi;

  // Cargar tareas
  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const res = await fetch(`${API}/tareas`);
        if (!res.ok) throw new Error("Error al obtener tareas");
        const data = await res.json();
        setTareas(
          data.map(t => ({
            id: t.id,
            text: t.titulo,
            completed: t.completado
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchTareas();
  }, [API]);

  // Agregar tarea
  const agregarTarea = async () => {
    if (!input.trim()) return;
    try {
      const res = await fetch(`${API}/tareas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: input.trim() })
      });
      if (!res.ok) throw new Error("Error al crear tarea");
      const nueva = await res.json();
      setTareas([
        ...tareas,
        { id: nueva.id, text: nueva.titulo, completed: nueva.completado }
      ]);
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // Marcar/desmarcar completada
  const toggleCompleted = async (id) => {
    const tarea = tareas.find(t => t.id === id);
    if (!tarea) return;
    try {
      const res = await fetch(`${API}/tareas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: tarea.text, completado: !tarea.completed })
      });
      if (!res.ok) throw new Error("Error al actualizar tarea");
      const updated = await res.json();
      setTareas(
        tareas.map(t =>
          t.id === id ? { ...t, completed: updated.completado } : t
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Eliminar tarea
  const eliminarTarea = async (id) => {
    try {
      const res = await fetch(`${API}/tareas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar tarea");
      setTareas(tareas.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Editar tarea
  const updateTarea = (id, newText, completed) => {
    setTareas(
      tareas.map(t =>
        t.id === id ? { ...t, text: newText, completed } : t
      )
    );
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-2 rounded shadow">
      <h1 className="text-3xl font-bold mb-5 text-center">TODO LIST APP</h1>

      <div className="flex gap-3 mb-5">
        <input
          className="flex-1 p-2 border rounded"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Añadir Tarea"
          onKeyDown={(e) => { if (e.key === "Enter") agregarTarea(); }}
        />
        <button
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
          onClick={agregarTarea}
        >
          Añadir Tarea
        </button>
      </div>

      <div className="space-y-2">
        {tareas.map((tarea) => (
          <TodoItem
            key={tarea.id}
            tarea={tarea}
            toggleCompleted={toggleCompleted}
            eliminarTarea={eliminarTarea}
            updateTarea={updateTarea}
            API={API}
          />
        ))}
      </div>
    </div>
  );
}
