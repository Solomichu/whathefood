'use client'
import React from 'react'
import { DialogHeader, DialogTitle, DialogContent, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Task {
  id: string;
  name: string;
  description: string;
  priority: string;
  status: string;
}

interface DeleteTaskDialogProps {
  task: Task;
  onConfirmDelete: (id: string) => void;
  onClose: () => void;
}

export default function DeleteTaskDialog({ task, onConfirmDelete, onClose }: DeleteTaskDialogProps) {
  const handleConfirmDelete = () => {
    onConfirmDelete(task.id);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogDescription>
          ¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.
        </DialogDescription>
      </DialogHeader>
      
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{task.name}</h3>
              <p className="text-sm text-gray-500">{task.description}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className={
                task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                task.priority === 'NORMAL' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }>
                {task.priority}
              </Badge>
              <Badge variant="outline" className={
                task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }>
                {task.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancelar
          </Button>
        </DialogClose>
        <Button 
          variant="destructive" 
          onClick={handleConfirmDelete}
        >
          Eliminar
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
