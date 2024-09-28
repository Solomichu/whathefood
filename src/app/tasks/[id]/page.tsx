'use client';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

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

export default function TaskPage() {
  const { id } = useParams();
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

  if (!task) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{task.name}</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Descripción:</label>
          <p>{task.description || 'No hay descripción disponible'}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Prioridad:</label>
          <p>{task.priority}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Creado por:</label>
          <p>{task.createdBy.username || 'Usuario desconocido'}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Fecha de creación:</label>
          <p>{new Date(task.createdAt).toLocaleString()}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Última actualización:</label>
          <p>{new Date(task.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
