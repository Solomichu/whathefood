'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Dish {
  id: string;
  name: string;
  instructions: string | null;
  prepTime: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  image: string | null;
  createdById: string | null;
  createdBy: {
    id: string;
    username: string | null;
  };
}

type SortKey = keyof Dish;

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

export default function DishTable() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [dialogType, setDialogType] = useState<'create' | 'edit' | 'view' | 'delete'>('create');
  const [formData, setFormData] = useState({
    name: '',
    instructions: '',
    prepTime: '',
    status: 'PENDING' as 'PENDING' | 'APPROVED' | 'REJECTED',
    image: null as File | null,
    createdById: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [users, setUsers] = useState<{ id: string; username: string }[]>([]);

  useEffect(() => {
    fetchDishes();
    fetchUsers();
  }, []);

  const fetchDishes = async () => {
    const response = await fetch('/api/dishes');
    if (response.ok) {
      const data = await response.json();
      setDishes(data.dishes);
    }
  };

  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    if (response.ok) {
      const data = await response.json();
      setUsers(data.map((user: any) => ({ id: user.id, username: user.username })));
    }
  };

  const handleAction = (dish: Dish, action: 'view' | 'edit' | 'delete') => {
    setSelectedDish(dish);
    setDialogType(action);
    if (action === 'edit') {
      setFormData({
        name: dish.name,
        instructions: dish.instructions || '',
        prepTime: dish.prepTime || '',
        status: dish.status,
        image: null,
        createdById: dish.createdById || '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as 'PENDING' | 'APPROVED' | 'REJECTED' }));
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDish) return;

    const form = new FormData();
    form.append('name', formData.name);
    form.append('instructions', formData.instructions);
    form.append('prepTime', formData.prepTime);
    form.append('status', formData.status);
    form.append('createdById', formData.createdById);
    if (formData.image instanceof File) {
      form.append('image', formData.image);
    }

    try {
      const response = await fetch(`/api/dishes?id=${selectedDish.id}`, {
        method: 'PUT',
        body: form,
      });
      if (response.ok) {
        fetchDishes();
        setIsDialogOpen(false);
      } else {
        console.error('Error al actualizar el plato');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async () => {
    if (selectedDish) {
      const response = await fetch(`/api/dishes?id=${selectedDish.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchDishes();
        setIsDialogOpen(false);
      } else {
        console.error('Error al eliminar el plato');
      }
    }
  };

  const sortData = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedDishes = [...dishes].sort((a, b) => {
      if (a[key] == null || b[key] == null) return 0;
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setDishes(sortedDishes);
  };

  const getSortDirection = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return '';
    }
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredDishes = dishes.filter(dish =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dish.id.toString().includes(searchTerm)
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append('instructions', formData.instructions);
    form.append('prepTime', formData.prepTime);
    form.append('status', formData.status);
    form.append('createdById', formData.createdById);
    if (formData.image instanceof File) {
      form.append('image', formData.image);
    }

    try {
      const response = await fetch('/api/dishes', {
        method: 'POST',
        body: form,
      });
      if (response.ok) {
        alert('Plato creado exitosamente');
        fetchDishes();
        setIsDialogOpen(false);
      } else {
        const errorData = await response.json();
        alert(`Error al crear el plato: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el plato');
    }
  };

  const openCreateDialog = () => {
    setDialogType('create');
    setFormData({
      name: '',
      instructions: '',
      prepTime: '',
      status: 'PENDING',
      image: null,
      createdById: '',
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-1.5 mb-7">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Platos</h3>
        <p className="text-sm text-muted-foreground">Gestiona los platos de la plataforma.</p>
      </div>
      <hr className='my-6' />
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Buscar por nombre o ID"
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
        <Button onClick={openCreateDialog}>
          Crear Plato
        </Button>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">Imagen</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">Imagen</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer" onClick={() => sortData('name')}>
                Nombre {getSortDirection('name')}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer" onClick={() => sortData('prepTime')}>
                Tiempo de preparación {getSortDirection('prepTime')}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer" onClick={() => sortData('status')}>
                Estado {getSortDirection('status')}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Creado por</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredDishes.map((dish) => (
              <tr key={dish.id} className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 align-middle">
                  {dish.image ? (
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-xl">{dish.name[0].toUpperCase()}</span>
                    </div>
                  )}
                </td>
                <td className="p-4 align-middle font-medium">{dish.name}</td>
                <td className="p-4 align-middle">{dish.prepTime || 'No especificado'}</td>
                <td className="p-4 align-middle">
                  <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${dish.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      dish.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                    {dish.status}
                  </div>
                </td>
                <td className="p-4 align-middle">{dish.createdBy?.username || 'No especificado'}</td>
                <td className="p-4 align-middle">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="19" cy="12" r="1"></circle>
                          <circle cx="5" cy="12" r="1"></circle>
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAction(dish, 'view')}>Ver plato</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction(dish, 'edit')}>Editar plato</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction(dish, 'delete')}>Eliminar plato</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'create' ? 'Crear Plato' :
                dialogType === 'edit' ? 'Editar Plato' :
                  dialogType === 'view' ? 'Ver Plato' :
                    dialogType === 'delete' ? 'Eliminar Plato' : ''}
            </DialogTitle>
          </DialogHeader>
          {dialogType === 'delete' ? (
            <div>
              <p>¿Estás seguro de que quieres eliminar este plato?</p>
              <DialogFooter>
                <Button onClick={handleDelete} variant="destructive">Eliminar</Button>
                <Button onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              </DialogFooter>
            </div>
          ) : dialogType === 'view' ? (
            <div>
              <p>Nombre del plato: {selectedDish?.name}</p>
              <p>Instrucciones: {selectedDish?.instructions}</p>
              <p>Tiempo de preparación: {selectedDish?.prepTime}</p>
              <p>Estado: {selectedDish?.status}</p>
              <p>Creado por: {selectedDish?.createdBy?.username}</p>
            </div>
          ) : (
            <form onSubmit={dialogType === 'create' ? handleSubmit : handleEdit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del plato</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="instructions">Instrucciones</Label>
                <textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  rows={4}
                ></textarea>
              </div>
              <div>
                <Label htmlFor="prepTime">Tiempo de preparación</Label>
                <Input
                  type="text"
                  id="prepTime"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="APPROVED">APPROVED</SelectItem>
                    <SelectItem value="REJECTED">REJECTED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="image">Imagen del plato</Label>
                <Input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleChange}
                  accept="image/"
                />
              </div>
              <div>
                <Label htmlFor="createdById">Creador del plato</Label>
                <Select
                  value={formData.createdById}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, createdById: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {dialogType === 'create' ? 'Crear Plato' : 'Actualizar Plato'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}