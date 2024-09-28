'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Task {
  id: string;
  name: string;
  description: string | null;
  priority: string;
  createdBy: {
    id: string;
    username: string | null;
  };
}

export default function TaskList_Page() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error('Error al obtener las tareas');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    fetchTasks();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Tareas</h1>
      <Link href="/tasks/new" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Nueva Tarea
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">{task.name}</h2>
            <p><strong>Descripción:</strong> {task.description || 'No especificada'}</p>
            <p><strong>Prioridad:</strong> {task.priority}</p>
            <p><strong>Creado por:</strong> {task.createdBy.username || 'Usuario desconocido'}</p>
            <p><strong>Creado por UserId:</strong> {task.createdBy.id || 'Usuario desconocido'}</p>
            <Link href={`/tasks/${task.id}`} className="text-blue-500 hover:underline">
              Ver detalles
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}