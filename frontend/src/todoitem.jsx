import { TrashIcon, PencilIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from "react";

export default function TodoItem({ tarea, toggleCompleted, eliminarTarea, updateTarea, API }) {
  const [editando, setEditando] = useState(false);
  const [textoEditado, setTextoEditado] = useState(tarea.text);

  // ⚡ Sincronizar textoEditado con cambios de tarea.text
  useEffect(() => {
    setTextoEditado(tarea.text);
  }, [tarea.text]);

  // Guardar edición en backend y estado local
  const guardarEdicion = async () => {
    if (textoEditado.trim() === "") return;

    try {
      const res = await fetch(`${API}/tareas/${tarea.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: textoEditado,
          completado: tarea.completed
        })
      });

      if (!res.ok) throw new Error("Error al actualizar tarea");

      const updated = await res.json();

      // Actualizar estado en App.jsx
      updateTarea(tarea.id, updated.titulo, updated.completado);

      // Salir del modo edición
      setEditando(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`flex justify-between items-center p-4 mb-2 rounded shadow transition-all
        ${tarea.completed ? "bg-gray-100 opacity-80" : "bg-white"}`}
    >
      {/* MODO EDICIÓN */}
      {editando ? (
        <input
          className="bg-white text-black p-1 rounded w-full mr-3 border border-purple-400 outline-purple-500"
          value={textoEditado || ""}
          onChange={(e) => setTextoEditado(e.target.value)}
          onBlur={guardarEdicion}
          onKeyDown={(e) => {
            if (e.key === "Enter") guardarEdicion();
            if (e.key === "Escape") setEditando(false);
          }}
          autoFocus
        />
      ) : (
        <span
          className={tarea.completed ? "line-through text-gray-500" : "text-black"}
          onDoubleClick={() => setEditando(true)} // doble clic para editar
        >
          {tarea.text}
        </span>
      )}

      {/* BOTONES */}
      <div className="flex items-center gap-3 ml-3">
        <input
          className="w-4 h-4"
          type="checkbox"
          checked={tarea.completed}
          onChange={() => toggleCompleted(tarea.id)}
        />

        <button onClick={() => setEditando(true)}>
          <PencilIcon className="w-5 h-5 text-purple-500 hover:text-purple-600" />
        </button>

        <button onClick={() => eliminarTarea(tarea.id)}>
          <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-600" />
        </button>
      </div>
    </div>
  );
}
