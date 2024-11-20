'use client'
import React, { useState } from 'react'
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Image from 'next/image'
import { useSession } from 'next-auth/react'

interface Dish {
  id: string;
  name: string;
  instructions: string | null;
  prepTime: string | null;
  status: string;
  image: string | null;
  creatorUsername: string;
  creatorImage: string;
}

interface CreatDishModalProps {
  onDishCreated: (newDish: Dish) => void;
  userImage?: string;
  username?: string;
  userId?: string;
}

export default function CreatDishModal({ 
  onDishCreated, 
  userImage, 
  username,
  userId
}: CreatDishModalProps) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    instructions: '',
    prepTime: '',
    status: 'PENDING',
    image: null as File | null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const isAdmin = session?.user?.role === 'admin';

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

  const handleSubmit = async (e: React.FormEvent) => {
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

    if (userId) {
      form.append('createdById', userId);
    }

    try {
      const response = await fetch('/api/dishes', {
        method: 'POST',
        body: form,
      });
      if (response.ok) {
        const { dish } = await response.json();
        onDishCreated(dish);
      } else {
        throw new Error('Error al crear el plato');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col justify-around'>
      <DialogHeader>
        <DialogTitle className='text-2xl ml-5'>Crear Nuevo Plato</DialogTitle>
      </DialogHeader>
      <Separator className='my-6'/>

      <div className="flex gap-4">
        <div className="w-3/5 p-2">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Nombre
              </label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="instructions" className="text-right">
                Instrucciones
              </label>
              <Textarea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                className="col-span-3 min-h-[100px] max-h-[200px] resize-none overflow-y-auto"
                placeholder="Escribe las instrucciones del plato..."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="prepTime" className="text-right">
                Tiempo de preparación
              </label>
              <Input id="prepTime" name="prepTime" value={formData.prepTime} onChange={handleChange} className="col-span-3" />
            </div>
            {isAdmin && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="status" className="text-right">
                  Estado
                </label>
                <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pendiente</SelectItem>
                    <SelectItem value="APPROVED">Aprobado</SelectItem>
                    <SelectItem value="REJECTED">Rechazado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="image" className="text-right">
                Imagen
              </label>
              <Input id="image" name="image" type="file" onChange={handleImageChange} className="col-span-3" />
            </div>
          </div>
        </div>
        <div className="w-2/5">
          <Card className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative h-40 bg-green-600">
                {previewImage ? (
                  <Image
                    src={previewImage}
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
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate">{formData.name || 'Nombre del plato'}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 overflow-hidden">
                      {formData.instructions || 'Instrucciones del plato'}
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-2 shrink-0">
                    {formData.prepTime || '0'}′
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <Badge 
                    variant="outline" 
                    className={
                      formData.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      formData.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }
                  >
                    {formData.status}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      {userImage ? (
                        <Image src={userImage} alt={username} layout="fill" />
                      ) : (
                        <AvatarFallback>{username?.[0]}</AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-sm truncate max-w-[100px]">{session?.user?.name}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <Button type="submit" className='p-6 text-lg'>Crear plato</Button>
      </div>
    </form>
  )
}