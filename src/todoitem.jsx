import { useState } from "react";
import { TrashIcon, PencilIcon, CheckIcon } from "@heroicons/react/16/solid";

export default function TodoItem({ tarea, toggleComplete, eliminarTarea, editarTarea }) {
  const [editando, setEditando] = useState(false);
  const [nuevoTexto, setNuevoTexto] = useState(tarea.texto);

  const guardarEdicion = () => {
    if (nuevoTexto.trim()) {
      editarTarea(tarea.id, nuevoTexto.trim());
      setEditando(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 mb-2 p-3 shadow-md rounded">
      {editando ? (
        <input
          type="text"
          className="flex-1 p-1 border rounded"
          value={nuevoTexto}
          onChange={(e) => setNuevoTexto(e.target.value)}
        />
      ) : (
        <span
          className={`flex-1 cursor-pointer ${
            tarea.completada ? "line-through text-gray-500" : "text-gray-800"
          }`}
          onClick={toggleComplete}
        >
          {tarea.texto}
        </span>
      )}

      <div className="flex items-center gap-2">
        {/* Checkbox para completar */}
        <input
          type="checkbox"
          checked={tarea.completada}
          onChange={toggleComplete}
        />

        {/* Botón editar o guardar */}
        {editando ? (
          <button onClick={guardarEdicion}>
            <CheckIcon className="w-5 h-5 text-green-500 hover:text-green-700" />
          </button>
        ) : (
          <button onClick={() => setEditando(true)}>
            <PencilIcon className="w-5 h-5 text-gray-400 hover:text-blue-500" />
          </button>
        )}

        {/* Botón eliminar */}
        <button onClick={() => eliminarTarea(tarea.id)}>
          <TrashIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
        </button>
      </div>
    </div>
  );
}
