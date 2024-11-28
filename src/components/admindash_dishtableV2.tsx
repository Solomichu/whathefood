'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Eye, Edit, Trash2, Search, Heart } from "lucide-react"
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
import CreatDishModal from './createdish_modal'
import { Separator } from './ui/separator'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useSession } from 'next-auth/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePointerEvents } from '@/hooks/usePointerEvents'

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

export default function AdmindashDishtableV2() {
  const { data: session } = useSession();

  const router = useRouter();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingDish, setDeletingDish] = useState<Dish | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [updatedDishName, setUpdatedDishName] = useState('');
  const [isApproveDrawerOpen, setIsApproveDrawerOpen] = useState(false);
  const [approvedDishInfo, setApprovedDishInfo] = useState<{
    name: string;
    creatorUsername: string;
    status: string;
  } | null>(null);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [deletedDishInfo, setDeletedDishInfo] = useState<{
    name: string;
    creatorUsername: string;
  } | null>(null);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [createdDishInfo, setCreatedDishInfo] = useState<{
    name: string;
    creatorUsername: string;
    status: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [favouriteDishes, setFavouriteDishes] = useState<string[]>([]);

  usePointerEvents(isDeleteDialogOpen);

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

  useEffect(() => {
    const fetchFavourites = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/dishes/favorites?userId=${session.user.id}`);
        if (!response.ok) throw new Error('Error al obtener los platos favoritos');
        const data = await response.json();
        setFavouriteDishes(data.dishes.map((dish: Dish) => dish.id));
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchFavourites();
  }, [session?.user?.id]);

  useEffect(() => {
    const filtered = dishes.filter(dish => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        dish.name?.toLowerCase().includes(searchLower) ||
        dish.id?.toLowerCase().includes(searchLower) ||
        dish.instructions?.toLowerCase().includes(searchLower) ||
        dish.creatorUsername?.toLowerCase().includes(searchLower) ||
        dish.createdById?.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'ALL' || dish.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
    setFilteredDishes(filtered);
  }, [searchTerm, dishes, statusFilter]);

  const handleView = (id: string) => {
    router.push(`/dishes/${id}`);
  };

  const handleEdit = (dish: Dish) => {
    setEditingDish(dish);
  };

  const handleDelete = async (id: string) => {
    try {
      const dishToDelete = dishes.find(dish => dish.id === id);
      if (!dishToDelete) return;

      // Asegurarse de que pointer-events se elimine antes de la operación
      document.body.style.removeProperty('pointer-events');

      const response = await fetch(`/api/dishes?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDishes(prevDishes => prevDishes.filter(dish => dish.id !== id));
        setIsDeleteDialogOpen(false);
        setDeletingDish(null);

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
        }, 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el plato');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Error al eliminar el plato');
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeletingDish(null);
  };

  const handleDishUpdated = (updatedDish: Dish) => {
    setDishes(prevDishes => prevDishes.map(d =>
      d.id === updatedDish.id ? {
        ...updatedDish,
        creatorUsername: updatedDish.creatorUsername || 'Usuario desconocido',
        creatorImage: updatedDish.creatorImage || '/ruta/a/imagen/por/defecto.jpg',
      } : d
    ));
    setUpdatedDishName(updatedDish.name);
    setIsDrawerOpen(true);
    setTimeout(() => setIsDrawerOpen(false), 2000);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleDishCreated = async (newDish: Dish) => {
    try {
      // Asegurarse de que el nuevo plato tiene todos los campos necesarios
      const completeDish: Dish = {
        ...newDish,
        creatorUsername: newDish.creatorUsername || session?.user?.name || 'Usuario desconocido',
        creatorImage: newDish.creatorImage || session?.user?.image || '/ruta/a/imagen/por/defecto.jpg',
        createdById: newDish.createdById || session?.user?.id,
      };

      // Actualizar el estado con el plato completo
      setDishes(prevDishes => [...prevDishes, completeDish]);
      handleCloseCreateModal();

      // Configurar información para el drawer
      setCreatedDishInfo({
        name: completeDish.name,
        creatorUsername: completeDish.creatorUsername,
        status: completeDish.status
      });
      setIsCreateDrawerOpen(true);

      // Actualizar la lista completa de platos
      const response = await fetch('/api/dishes');
      if (response.ok) {
        const data = await response.json();
        setDishes(data.dishes);
      }

      // Cerrar el drawer después de 3 segundos
      setTimeout(() => {
        setIsCreateDrawerOpen(false);
        setCreatedDishInfo(null);
      }, 3000);
    } catch (error) {
      console.error('Error al manejar el plato creado:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const currentDish = dishes.find(dish => dish.id === id);
      if (!currentDish) return;

      const formData = new FormData();
      formData.append('name', currentDish.name);
      formData.append('instructions', currentDish.instructions || '');
      formData.append('prepTime', currentDish.prepTime || '');
      formData.append('status', 'APPROVED');

      if (currentDish.createdById) {
        formData.append('createdById', currentDish.createdById);
      }

      const response = await fetch(`/api/dishes?id=${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el estado del plato');
      }

      const updatedDish = await response.json();

      setDishes(prevDishes => prevDishes.map(dish =>
        dish.id === id ? {
          ...updatedDish,
          creatorUsername: updatedDish.creatorUsername || 'Usuario desconocido',
          creatorImage: updatedDish.creatorImage || '/ruta/a/imagen/por/defecto.jpg',
        } : dish
      ));

      setApprovedDishInfo({
        name: updatedDish.name,
        creatorUsername: updatedDish.creatorUsername || 'Usuario desconocido',
        status: 'APPROVED'
      });
      setIsApproveDrawerOpen(true);

      setTimeout(() => {
        setIsApproveDrawerOpen(false);
        setApprovedDishInfo(null);
      }, 3000);

    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Error al aprobar el plato');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const currentDish = dishes.find(dish => dish.id === id);
      if (!currentDish) return;

      const formData = new FormData();
      formData.append('name', currentDish.name);
      formData.append('instructions', currentDish.instructions || '');
      formData.append('prepTime', currentDish.prepTime || '');
      formData.append('status', 'REJECTED');

      if (currentDish.createdById) {
        formData.append('createdById', currentDish.createdById);
      }

      const response = await fetch(`/api/dishes?id=${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el estado del plato');
      }

      const updatedDish = await response.json();

      setDishes(prevDishes => prevDishes.map(dish =>
        dish.id === id ? {
          ...updatedDish,
          creatorUsername: updatedDish.creatorUsername || 'Usuario desconocido',
          creatorImage: updatedDish.creatorImage || '/ruta/a/imagen/por/defecto.jpg',
        } : dish
      ));

    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Error al rechazar el plato');
    }
  };

  const handleAddToFavorites = async (dishId: string) => {
    if (!session?.user?.id) {
      alert('Debes iniciar sesión para agregar platos a favoritos.');
      return;
    }

    const action = favouriteDishes.includes(dishId) ? 'remove' : 'add';

    try {
      const response = await fetch('/api/dishes/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          dishId: dishId,
          action: action,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al modificar favoritos');
      }

      setFavouriteDishes(prev =>
        action === 'add'
          ? [...prev, dishId]
          : prev.filter(id => id !== dishId)
      );
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo modificar el plato en favoritos');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Recetas</h1>
        <Button onClick={handleOpenCreateModal}>Crear Plato</Button>
      </div>
      <Separator className="mb-4" />

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre, ID, descripción o creador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md bg-background text-foreground"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>
        <Select onValueChange={setStatusFilter} defaultValue="ALL">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem value="APPROVED">Aceptado</SelectItem>
            <SelectItem value="PENDING">Pendiente</SelectItem>
            <SelectItem value="REJECTED">Rechazado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDishes.map((dish) => (
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
                <div className="flex justify-between items-start mb-2 items-center">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold truncate">{dish.name}</CardTitle>
                    <p className="text-sm text-gray-500 line-clamp-2">{dish.instructions}</p>
                  </div>
                  <Badge variant="secondary" className="ml-2 whitespace-nowrap">
                    {dish.prepTime}'
                  </Badge>
                  <Button
                    variant={favouriteDishes.includes(dish.id) ? "filled" : "ghost"}
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToFavorites(dish.id);
                    }}
                  >
                    <Heart className={`h-4 w-4 ${favouriteDishes.includes(dish.id) ? 'text-red-500' : ''}`} />
                  </Button>
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
                            <DialogContent className="sm:max-w-[900px] !h-fit">
                              <EditDishDialog
                                dish={dish}
                                onDishUpdated={handleDishUpdated}
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

                  {dish.status === 'PENDING' && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-600">Este plato está pendiente de revisión</p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprove(dish.id)}
                          className="bg-green-500 hover:bg-green-600 text-white flex-1"
                        >
                          Aceptar
                        </Button>
                        <Button
                          onClick={() => handleReject(dish.id)}
                          variant="destructive"
                          className="bg-red-500 hover:bg-red-600 text-white flex-1"
                        >
                          Rechazar
                        </Button>
                      </div>
                    </div>
                  )}
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
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} >
        <DrawerContent className='flex w-fit m-auto px-10'>
          <DrawerHeader>
            <DrawerTitle className='bg-primary text-secondary px-2 py-3 rounded-lg text-center'>Plato Actualizado</DrawerTitle>
            <DrawerDescription>
              Se ha actualizado el plato: {updatedDishName}
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[900px] !h-fit">
          <CreatDishModal
            onDishCreated={handleDishCreated}
            userImage={session?.user?.image}
            username={session?.user?.name}
            userId={session?.user?.id}
            statusOptions={['PENDING', 'APPROVED', 'REJECTED']}
          />
        </DialogContent>
      </Dialog>
      <Drawer open={isApproveDrawerOpen} onOpenChange={setIsApproveDrawerOpen}>
        <DrawerContent className="flex w-fit mx-auto px-10">
          <DrawerHeader className="text-center">
            <DrawerTitle className="bg-green-500 text-white px-4 py-2 rounded-lg mb-2">
              ¡Plato Aprobado!
            </DrawerTitle>
            <DrawerDescription className="space-y-2">
              <p className="font-medium text-lg">{approvedDishInfo?.name}</p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  {approvedDishInfo?.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                Creado por: {approvedDishInfo?.creatorUsername}
              </p>
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
      <Drawer
        open={isDeleteDrawerOpen}
        onOpenChange={(open) => {
          setIsDeleteDrawerOpen(open);
          // Asegurarse de que pointer-events se elimine al cerrar el drawer
          if (!open) {
            document.body.style.removeProperty('pointer-events');
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
      </Drawer>
      <Drawer open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
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
      </Drawer>
    </div>
  )
}