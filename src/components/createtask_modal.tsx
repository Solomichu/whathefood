'use client'
import React, { useState } from 'react'
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Task {
  id: string;
  name: string;
  description: string;
  priority: string;
  status: string;
  createdById: string;
  creatorUsername?: string;
  creatorImage?: string;
}

interface CreateTaskModalProps {
  onTaskCreated: (task: Task) => void;
  userImage?: string | null;
  username?: string | null;
  userId?: string;
  statusOptions?: string[];
}

export default function CreateTaskModal({ 
  onTaskCreated, 
  userImage, 
  username,
  userId 
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('NORMAL');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    const formData = new FormData();
    formData.append('name', title);
    formData.append('description', description);
    formData.append('priority', priority);
    formData.append('createdById', userId);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al crear la tarea');
      }

      const data = await response.json();
      onTaskCreated(data.task);
      
      // Limpiar el formulario
      setTitle('');
      setDescription('');
      setPriority('NORMAL');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Crear Nueva Tarea</DialogTitle>
        <DialogDescription>
          Añade una nueva tarea al sistema
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Título de la tarea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <Textarea
            placeholder="Descripción de la tarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
            required
          />
        </div>

        <div>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona la prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Baja</SelectItem>
              <SelectItem value="NORMAL">Normal</SelectItem>
              <SelectItem value="HIGH">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Avatar>
            <AvatarImage src={userImage || undefined} />
            <AvatarFallback>{username?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{username || 'Usuario'}</p>
            <p className="text-sm text-gray-500">Creador de la tarea</p>
          </div>
          <Button type="submit">Crear Tarea</Button>
        </div>
      </form>
    </div>
  )
}
