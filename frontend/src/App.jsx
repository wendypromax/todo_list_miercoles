import { useState, useEffect } from "react";
import TodoItem from "./components/TodoItem.jsx";

// URL de tu backend desplegado
const BACKEND_URL = "https://adventurous-curiosity-production-3d05.up.railway.app";

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");

  // Cargar tareas al iniciar
  useEffect(() => {
    const cargarTareas = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/tareas`);
        if (!res.ok) throw new Error("Error al obtener tareas");
        const data = await res.json();
        setTareas(data);
      } catch (error) {
        console.error("Error al cargar tareas:", error);
      }
    };
    cargarTareas();
  }, []);

  // Agregar tarea
  const agregarTarea = async () => {
    if (!titulo.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/tareas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: titulo.trim(),
          descripcion: "",
        }),
      });

      if (!res.ok) throw new Error("Error al agregar tarea");

      const nuevaTarea = await res.json();
      setTareas([...tareas, nuevaTarea]);

      setTitulo("");
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  // Marcar tarea como completada
  const toggleComplete = async (id, completado) => {
    console.log("Actualizando tarea con id:", id);
    try {
      const res = await fetch(`${BACKEND_URL}/tareas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completado: !completado }),
      });

      if (!res.ok) throw new Error(`Error al actualizar tarea ${id}`);

      const updated = await res.json();
      setTareas(tareas.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };

  // Eliminar tarea
  const eliminarTarea = async (id) => {
    console.log("Eliminando tarea con id:", id);
    try {
      const res = await fetch(`${BACKEND_URL}/tareas/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`Error al eliminar tarea ${id}`);

      setTareas(tareas.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  // Editar tarea
  const editarTarea = async (id, nuevoTitulo) => {
    console.log("Editando tarea con id:", id);
    try {
      const res = await fetch(`${BACKEND_URL}/tareas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: nuevoTitulo }),
      });

      if (!res.ok) throw new Error(`Error al editar tarea ${id}`);

      const updated = await res.json();
      setTareas(tareas.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      console.error("Error al editar tarea:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5 text-center">
        MI LISTA DE TAREAS REACT
      </h1>

      <div className="flex gap-3 mb-4 flex-col">
        <input
          placeholder="Título de la tarea"
          className="p-3 shadow-md rounded border"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <button
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-purple-400"
          onClick={agregarTarea}
        >
          Agregar
        </button>
      </div>

      <div>
        {tareas.length === 0 ? (
          <p className="text-center text-gray-500">No hay tareas</p>
        ) : (
          tareas.map((tarea) => (
            <TodoItem
              key={tarea.id}
              tarea={tarea}
              toggleComplete={() => toggleComplete(tarea.id, tarea.completado)}
              eliminarTarea={eliminarTarea}
              editarTarea={editarTarea}
            />
          ))
        )}
      </div>
    </div>
  );
}
