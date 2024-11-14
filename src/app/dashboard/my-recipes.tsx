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
import { DialogWrapper } from "@/components/ui/dialog-wrapper"
import { DialogContent , DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import EditDishDialog from '@/components/editdish_dialog'
import CreatDishModal from '@/components/createdish_modal'
import { Separator } from '@/components/ui/separator'
import { useSession } from 'next-auth/react'
import { DrawerWrapper } from "@/components/ui/drawer-wrapper"

interface Dish {
  id: string;
  image: string | null;
  name: string;
  instructions: string | null;
  prepTime: string | null;
  status: string;
  creatorUsername: string;
  creatorImage: string;
  createdById?: string;
}

export default function MyRecipes() {
  const { data: session } = useSession();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState<Dish | null>(null);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [createdDishInfo, setCreatedDishInfo] = useState<{
    name: string;
    creatorUsername: string;
    status: string;
  } | null>(null);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [deletedDishInfo, setDeletedDishInfo] = useState<{
    name: string;
    creatorUsername: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserDishes = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/dishes?userId=${session.user.id}`);
        if (!response.ok) {
          throw new Error('Error al obtener los platos');
        }
        const data = await response.json();
        setDishes(data.dishes);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserDishes();
  }, [session?.user?.id]);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleDishCreated = async (newDish: Dish) => {
    try {
      const formData = new FormData();
      formData.append('name', newDish.name);
      formData.append('instructions', newDish.instructions || '');
      formData.append('prepTime', newDish.prepTime || '');
      formData.append('status', 'PENDING');
      formData.append('createdById', session?.user?.id || '');

      if (newDish.image) {
        formData.append('image', newDish.image);
      }

      const response = await fetch('/api/dishes', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al crear el plato');
      }

      const createdDish = await response.json();
      
      setDishes(prevDishes => [...prevDishes, {
        ...createdDish,
        creatorUsername: session?.user?.name || 'Usuario desconocido',
        creatorImage: session?.user?.image || '/ruta/a/imagen/por/defecto.jpg',
      }]);

      setIsCreateModalOpen(false);
      
      // Configurar información para el drawer
      setCreatedDishInfo({
        name: createdDish.name,
        creatorUsername: session?.user?.name || 'Usuario desconocido',
        status: createdDish.status
      });
      setIsCreateDrawerOpen(true);

      // Cerrar el drawer después de 3 segundos
      setTimeout(() => {
        setIsCreateDrawerOpen(false);
        setCreatedDishInfo(null);
      }, 3000);
    } catch (error) {
      console.error('Error al crear el plato:', error);
    }
  };

  const handleDeleteDish = async (id: string) => {
    try {
      const dishToDelete = dishes.find(dish => dish.id === id);
      if (!dishToDelete) return;

      const response = await fetch(`/api/dishes?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el plato');
      }

      setDishes(prevDishes => prevDishes.filter(dish => dish.id !== id));
      setIsDeleteDialogOpen(false);
      setDishToDelete(null);
      
      // Configurar información para el drawer
      setDeletedDishInfo({
        name: dishToDelete.name,
        creatorUsername: dishToDelete.creatorUsername || 'Usuario desconocido'
      });
      setIsDeleteDrawerOpen(true);

      // Cerrar el drawer después de 3 segundos
      setTimeout(() => {
        setIsDeleteDrawerOpen(false);
        setDeletedDishInfo(null);
        document.body.style.removeProperty('pointer-events');
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Error al eliminar el plato');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mis Recetas</h1>
        <Button onClick={handleOpenCreateModal}>Crear Nueva Receta</Button>
      </div>
      <Separator className='mb-10' />

      {dishes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Aún no has creado ninguna receta</p>
          <Button onClick={handleOpenCreateModal}>Crear Mi Primera Receta</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dishes.map((dish) => (
            <Card key={dish.id} className="flex flex-col">
              <CardHeader className="p-0">
                <div className="relative h-40 w-full bg-green-600">
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
              <CardContent className="p-4 flex-1">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold truncate">{dish.name}</CardTitle>
                      <p className="text-sm text-gray-500 line-clamp-2">{dish.instructions}</p>
                    </div>
                    <Badge variant="secondary" className="ml-2 whitespace-nowrap">
                      {dish.prepTime}'
                    </Badge>
                  </div>
                  <div className="mt-auto">
                    <div className="flex justify-between items-center mt-4">
                      <Badge variant="outline" className={
                        dish.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        dish.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {dish.status}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={dish.creatorImage} alt={dish.creatorUsername || 'Usuario'} />
                          <AvatarFallback>{(dish.creatorUsername || 'U').charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate max-w-[100px]">{dish.creatorUsername || 'Usuario'}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/dishes/${dish.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Ver</span>
                            </DropdownMenuItem>
                            <DialogWrapper>
                              <DialogContent className="sm:max-w-[900px] !h-fit">
                                <EditDishDialog
                                  dish={dish}
                                  onDishUpdated={handleDishCreated} // Cambia esto si es necesario
                                />
                              </DialogContent>
                            </DialogWrapper>
                            <DropdownMenuItem onClick={() => {
                              setDishToDelete(dish);
                              setIsDeleteDialogOpen(true);
                            }} className='bg-red-500 text-white hover:!bg-red-700 hover:!text-white'>
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Eliminar</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DialogWrapper open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[900px] !h-fit">
          <CreatDishModal 
            onDishCreated={handleDishCreated} 
            userImage={session?.user?.image} 
            username={session?.user?.name}
            userId={session?.user?.id}
          />
        </DialogContent>
      </DialogWrapper>

      <DrawerWrapper open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
        <DrawerContent className="flex w-fit mx-auto px-10">
          <DrawerHeader className="text-center">
            <DrawerTitle className="bg-primary text-secondary px-4 py-2 rounded-lg mb-2">
              ¡Plato Creado!
            </DrawerTitle>
            <DrawerDescription className="space-y-2">
              <p className="font-medium text-lg">{createdDishInfo?.name}</p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline" className={
                  createdDishInfo?.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  createdDishInfo?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }>
                  {createdDishInfo?.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                Creado por: {createdDishInfo?.creatorUsername}
              </p>
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </DrawerWrapper>

      <DialogWrapper open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar el plato "{dishToDelete?.name}"?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => dishToDelete && handleDeleteDish(dishToDelete.id)}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </DialogWrapper>

      <DrawerWrapper 
        open={isDeleteDrawerOpen} 
        onOpenChange={(open) => {
          setIsDeleteDrawerOpen(open);
          if (!open) {
            setTimeout(() => {
              document.body.style.removeProperty('pointer-events');
            }, 100);
          }
        }}
      >
        <DrawerContent className="flex w-fit mx-auto px-10">
          <DrawerHeader className="text-center">
            <DrawerTitle className="bg-red-500 text-white px-4 py-2 rounded-lg mb-2">
              Plato Eliminado
            </DrawerTitle>
            <DrawerDescription className="space-y-2">
              <p className="font-medium text-lg">{deletedDishInfo?.name}</p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  ELIMINADO
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                Creado por: {deletedDishInfo?.creatorUsername}
              </p>
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </DrawerWrapper>
    </div>
  )
}
