'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  name: string;
  description: string | null;
  priority: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    username: string;
  };
}

export default function DeleteTask_Page() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/tasks?id=${id}`);
        if (response.ok) {
          const taskData = await response.json();
          setTask(taskData);
        } else {
          console.error('Error al obtener los datos de la tarea');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        const response = await fetch(`/api/tasks?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Tarea eliminada exitosamente');
          router.push('/tasks');
        } else {
          const errorData = await response.json();
          alert(`Error al eliminar la tarea: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar la tarea');
      }
    }
  };

  if (!task) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Eliminar Tarea</h1>
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <p><strong>Nombre de la tarea:</strong> {task.name}</p>
        <p><strong>Descripción:</strong> {task.description || 'No hay descripción'}</p>
        <p><strong>Prioridad:</strong> {task.priority}</p>
        <p><strong>Creado por:</strong> {task.createdBy.username}</p>
        <p><strong>Fecha de creación:</strong> {new Date(task.createdAt).toLocaleString()}</p>
        <p><strong>Última actualización:</strong> {new Date(task.updatedAt).toLocaleString()}</p>
      </div>
      <button 
        onClick={handleDelete}
        className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Eliminar Tarea
      </button>
    </div>
  );
}
