'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import EditDishDialog from './editdish_dialog'
import DeleteDishDialog from './deletedish_dialog'
import { useRouter } from 'next/navigation'

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

export default function AdmindashDishtableV2() {
  const router = useRouter();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingDish, setDeletingDish] = useState<Dish | null>(null);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch('/api/dishes');
        if (!response.ok) {
          throw new Error('Error al obtener los platos');
        }
        const data = await response.json();
        setDishes(data.dishes);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchDishes();
  }, []);

  const handleView = (id: string) => {
    router.push(`/dishes/${id}`);
  };

  const handleEdit = (dish: Dish) => {
    setEditingDish(dish);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/dishes?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setDishes(prevDishes => prevDishes.filter(dish => dish.id !== id));
        setIsDeleteDialogOpen(false);
        setDeletingDish(null);
        alert('Plato eliminado exitosamente');
      } else {
        const errorData = await response.json();
        alert(`Error al eliminar el plato: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el plato');
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeletingDish(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Recetas</h1>
        <Button>Crear</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dishes.map((dish) => (
          <Card key={dish.id} className="overflow-hidden">
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
                  <CardTitle className="text-lg font-semibold">{dish.name}</CardTitle>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(dish.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Ver</span>
                      </DropdownMenuItem>
                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] !h-[50vh]">
                          <EditDishDialog 
                            dish={dish} 
                            onDishUpdated={(updatedDish) => {
                              setDishes(prevDishes => prevDishes.map(d => 
                                d.id === updatedDish.id ? {
                                  ...updatedDish,
                                  creatorUsername: updatedDish.creatorUsername || 'Usuario desconocido',
                                  creatorImage: updatedDish.creatorImage || '/ruta/a/imagen/por/defecto.jpg',
                                } : d
                              ));
                            }} 
                          />
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault();
                            setDeletingDish(dish);
                            setIsDeleteDialogOpen(true);
                          }}
                          className='bg-red-500 text-white hover:!bg-red-700 hover:!text-white'
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Eliminar</span>
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          {deletingDish && (
                            <DeleteDishDialog
                              dish={deletingDish}
                              onConfirmDelete={handleDelete}
                              onClose={handleCloseDeleteDialog}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        {deletingDish && (
          <DeleteDishDialog
            dish={deletingDish}
            onConfirmDelete={handleDelete}
            onClose={handleCloseDeleteDialog}
          />
        )}
      </Dialog>
    </div>
  )
}