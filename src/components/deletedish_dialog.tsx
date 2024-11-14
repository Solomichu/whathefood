'use client'
import React from 'react'
import { DialogHeader, DialogTitle, DialogContent, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from 'next/image'

interface Dish {
  id: string;
  image: string | null;
  name: string;
  instructions: string | null;
  prepTime: string | null;
  status: string;
  creatorUsername: string;
  creatorImage: string;
}

interface DeleteDishDialogProps {
  dish: Dish;
  onConfirmDelete: (id: string) => void;
  onClose: () => void; // Añadimos esta prop
}

export default function DeleteDishDialog({ dish, onConfirmDelete, onClose }: DeleteDishDialogProps) {
  const handleConfirmDelete = () => {
    onConfirmDelete(dish.id);
    onClose?.();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogDescription>
          ¿Estás seguro de que quieres eliminar este plato? Esta acción no se puede deshacer.
        </DialogDescription>
      </DialogHeader>
      
      <Card className="overflow-hidden mt-4">
        <CardHeader className="p-0">
          <div className="relative h-40 bg-green-600">
            {dish.image ? (
              <Image
                src={dish.image}
                alt={dish.name}
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                Sin imagen
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold">{dish.name}</h3>
              <p className="text-sm text-gray-500 truncate">{dish.instructions}</p>
            </div>
            <Badge variant="secondary">{dish.prepTime}'</Badge>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Badge variant="outline" className={
              dish.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
              dish.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }>
              {dish.status}
            </Badge>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={dish.creatorImage} alt={dish.creatorUsername || 'Usuario'} />
                <AvatarFallback>{(dish.creatorUsername || 'U').charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{dish.creatorUsername || 'Usuario desconocido'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button 
            variant="outline" 
            onClick={() => {
              onClose();
            }}
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
