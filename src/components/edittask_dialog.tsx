'use client'
import React, { useState } from 'react'
import { DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
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

interface Task {
  id: string;
  name: string;
  description: string;
  priority: string;
  status: string;
  createdById: string;
}

interface EditTaskDialogProps {
  task: Task;
  onTaskUpdated: (task: Task) => void;
  onClose: () => void;
}

export default function EditTaskDialog({ task, onTaskUpdated, onClose }: EditTaskDialogProps) {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    document.body.style.removeProperty('pointer-events');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('priority', priority);
    formData.append('status', status);
    formData.append('createdById', task.createdById);

    try {
      const response = await fetch(`/api/tasks?id=${task.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la tarea');
      }

      const data = await response.json();
      onTaskUpdated(data.task);
      onClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>Editar Tarea</DialogTitle>
        <DialogDescription>
          Modifica los detalles de la tarea
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Título de la tarea"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

        <div className="grid grid-cols-2 gap-4">
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Baja</SelectItem>
              <SelectItem value="NORMAL">Normal</SelectItem>
              <SelectItem value="HIGH">Alta</SelectItem>
            </SelectContent>
          </Select>

          
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <DialogClose asChild>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                document.body.style.removeProperty('pointer-events');
                onClose();
              }}
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit">Guardar Cambios</Button>
        </div>
      </form>
    </div>
  )
}
