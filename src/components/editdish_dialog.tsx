'use client'
import React, { useState } from 'react'
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from 'next/image'
import { Separator } from './ui/separator'

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

export default function EditDishDialog({ dish, onDishUpdated }: EditDishDialogProps) {
  const [formData, setFormData] = useState({
    name: dish.name,
    instructions: dish.instructions || '',
    prepTime: dish.prepTime || '',
    status: dish.status,
    image: null as File | null,
    createdById: dish.createdById,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(dish.image);

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
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Editar Plato</DialogTitle>
      </DialogHeader>
      <Separator className='my-6'/>
      <div className="flex gap-4 py-4">
        <div className="w-1/2 just m-auto">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Nombre
              </label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="instructions" className="text-right">
                Instrucciones
              </label>
              <Textarea id="instructions" name="instructions" value={formData.instructions} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="prepTime" className="text-right">
                Tiempo de preparación
              </label>
              <Input id="prepTime" name="prepTime" value={formData.prepTime} onChange={handleChange} className="col-span-3" />
            </div>
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
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="image" className="text-right">
              Nueva imagen
            </label>
            <Input id="image" name="image" type="file" onChange={handleImageChange} className="col-span-3" />
          </div>
          </div>
        </div>
        <div className="w-1/2 m-auto ">
          <div className="relative h-64 bg-green-600 mb-4">
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
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <Button type="submit">Guardar cambios</Button>
      </div>
    </form>
  )
}