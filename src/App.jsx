import { useState } from 'react';
import TodoItem from './todoitem.jsx';

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [input, setInput] = useState('');

  // 👉 Agregar tarea
  const agregarTareas = () => {
    if (input.trim()) {
      setTareas([
        ...tareas,
        { id: Date.now(), texto: input.trim(), completada: false },
      ]);
      setInput('');
    }
  };

  // 👉 Marcar tarea como completada
  const toggleComplete = (id) => {
    setTareas(
      tareas.map((tarea) =>
        tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
      )
    );
  };

  // 👉 Eliminar tarea
  const eliminarTarea = (id) => {
    setTareas(tareas.filter((tarea) => tarea.id !== id));
  };

  // 👉 Editar tarea
  const editarTarea = (id, nuevoTexto) => {
    setTareas(
      tareas.map((tarea) =>
        tarea.id === id ? { ...tarea, texto: nuevoTexto } : tarea
      )
    );
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
          onKeyDown={(e) => e.key === "Enter" && agregarTareas()} // Enter agrega tarea
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={agregarTareas}
        >
          Agregar
        </button>
      </div>

      {/* Lista de tareas */}
      <div>
        {tareas.length === 0 ? (
          <p className="text-center text-gray-500">No hay tareas aún 🚀</p>
        ) : (
          tareas.map((tarea) => (
            <TodoItem
              key={tarea.id}
              tarea={tarea}
              toggleComplete={() => toggleComplete(tarea.id)}
              eliminarTarea={eliminarTarea}
              editarTarea={editarTarea} // 👈 pasa función de edición
            />
          ))
        )}
      </div>
    </div>
  );
}
