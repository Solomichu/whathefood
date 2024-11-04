'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
}

export default function AdmindashTasktable() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          throw new Error('Error al obtener las tareas');
        }
        const data = await response.json();
        setTasks(data.tasks);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleView = (id: string) => {
    router.push(`/tasks/${id}`);
  };

  

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tareas</h1>
        <Button onClick={() => {/* lógica para crear tarea */}}>Crear</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative h-40 bg-blue-600">
                <div className="flex items-center justify-center h-full text-white">
                  {task.title}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
              <p className="text-sm text-gray-500 truncate">{task.description}</p>
              <p className="text-sm">{task.status}</p>
              <Button onClick={() => handleView(task.id)}>Ver Detalles</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
