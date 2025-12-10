import { useState, useEffect } from "react";
import TodoItem from "./todoitem.jsx";

// URL de tu backend desplegado en Render
const BACKEND_URL = "https://todo-list-miercoles.onrender.com/";

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [input, setInput] = useState("");

  // 👉 Cargar tareas desde backend al iniciar
  useEffect(() => {
    const cargarTareas = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/tareas`);
        const data = await res.json();
        setTareas(data);
      } catch (error) {
        console.error("Error al cargar tareas:", error);
      }
    };
    cargarTareas();
  }, []);

  // 👉 Agregar tarea
  const agregarTarea = async () => {
    if (input.trim()) {
      try {
        const res = await fetch(`${BACKEND_URL}/tareas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ titulo: input.trim(), descripcion: "" }),
        });
        const nuevaTarea = await res.json();
        setTareas([...tareas, nuevaTarea]);
        setInput("");
      } catch (error) {
        console.error("Error al agregar tarea:", error);
      }
    }
  };

  // 👉 Marcar tarea como completada
  const toggleComplete = async (id, completada) => {
    try {
      const res = await fetch(`${BACKEND_URL}/tareas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completada: !completada }),
      });
      const updated = await res.json();
      setTareas(
        tareas.map((tarea) => (tarea.id === id ? updated : tarea))
      );
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };

  // 👉 Eliminar tarea
  const eliminarTarea = async (id) => {
    try {
      await fetch(`${BACKEND_URL}/tareas/${id}`, {
        method: "DELETE",
      });
      setTareas(tareas.filter((tarea) => tarea.id !== id));
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  // 👉 Editar tarea
  const editarTarea = async (id, nuevoTexto) => {
    try {
      const res = await fetch(`${BACKEND_URL}/tareas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: nuevoTexto }),
      });
      const updated = await res.json();
      setTareas(
        tareas.map((tarea) => (tarea.id === id ? updated : tarea))
      );
    } catch (error) {
      console.error("Error al editar tarea:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5 text-center">
        MI LISTA DE TAREAS REACT
      </h1>

      {/* Input + botón para agregar */}
      <div className="flex gap-3 mb-4">
        <input
          placeholder="Nueva tarea"
          className="flex-1 p-3 shadow-md rounded border"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && agregarTarea()}
        />
        <button
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-purple-400"
          onClick={agregarTarea}
        >
          Agregar
        </button>
      </div>

      {/* Lista de tareas */}
      <div>
        {tareas.length === 0 ? (
          <p className="text-center text-gray-500">No hay tareas</p>
        ) : (
          tareas.map((tarea) => (
            <TodoItem
              key={tarea.id}
              tarea={tarea}
              toggleComplete={() =>
                toggleComplete(tarea.id, tarea.completada)
              }
              eliminarTarea={eliminarTarea}
              editarTarea={editarTarea}
            />
          ))
        )}
      </div>
    </div>
  );
}
