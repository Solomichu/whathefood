'use client'
import React, { useState, useEffect } from 'react'
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from 'next/image'
import { Separator } from './ui/separator'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Label } from './ui/label'
import { useSession } from "next-auth/react";

interface Dish {
  id: string;
  name: string;
  instructions: string | null;
  prepTime: string | null;
  status: string;
  image: string | null;
  createdById: string;
}

interface EditDishDialogProps {
  dish: Dish;
  onDishUpdated: (updatedDish: Dish) => void;
}

interface User {
  id: string;
  username: string;
}

export default function EditDishDialog({ dish, onDishUpdated }: EditDishDialogProps) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: dish.name,
    instructions: dish.instructions || '',
    prepTime: dish.prepTime || '',
    status: dish.status,
    image: null as File | null,
    createdById: dish.createdById,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(dish.image);
  const [users, setUsers] = useState<User[]>([]);
  const isAdmin = session?.user?.role === 'ADMIN';

  useEffect(() => {
    const fetchUsers = async () => {
      if (isAdmin) {
        try {
          const response = await fetch('/api/users');
          if (response.ok) {
            const data = await response.json();
            setUsers(data);
          }
        } catch (error) {
          console.error('Error al cargar usuarios:', error);
        }
      }
    };

    fetchUsers();
  }, [isAdmin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'image' && value instanceof File) {
          form.append(key, value);
        } else if (typeof value === 'string') {
          form.append(key, value);
        }
      }
    });

    if (dish.createdById) {
      form.append('createdById', dish.createdById);
    }

    try {
      const response = await fetch(`/api/dishes?id=${dish.id}`, {
        method: 'PUT',
        body: form,
      });
      if (response.ok) {
        const updatedDish = await response.json();
        onDishUpdated(updatedDish);
      } else {
        const errorData = await response.json();
        alert(`Error al actualizar el plato: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el plato');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instructions">Instrucciones</Label>
          <Textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prepTime">Tiempo de preparación</Label>
          <Input
            id="prepTime"
            name="prepTime"
            value={formData.prepTime}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pendiente</SelectItem>
              <SelectItem value="APPROVED">Aprobado</SelectItem>
              <SelectItem value="REJECTED">Rechazado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Nueva imagen</Label>
          <Input
            id="image"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        {isAdmin && (
          <div className="space-y-2">
            <Label htmlFor="createdById">Creado por</Label>
            <Select 
              name="createdById" 
              value={formData.createdById} 
              onValueChange={(value) => handleSelectChange('createdById', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar usuario" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button onClick={handleSubmit}>Guardar cambios</Button>
      </div>

      {/* Panel derecho con vista previa */}
      <div className="relative">
        <Card className="w-full">
          <CardHeader className="p-0">
            <div className="relative h-[200px] bg-green-600">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt={formData.name}
                  layout="fill"
                  objectFit="cover"
                />
              ) : dish.image ? (
                <Image
                  src={dish.image}
                  alt={formData.name}
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
            <div className="space-y-2">
              <h3 className="font-semibold">{formData.name || "Nombre del plato"}</h3>
              <p className="text-sm text-gray-600">{formData.instructions || "Instrucciones del plato"}</p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{formData.prepTime || "0"}′</Badge>
                <Badge variant="outline" className={
                  formData.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  formData.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }>
                  {formData.status}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Avatar>
                  <AvatarImage src={dish.creatorImage} />
                  <AvatarFallback>{dish.creatorUsername?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{dish.creatorUsername || "Usuario actual"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}