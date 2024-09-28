'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface Dish {
  id: string;
  name: string;
  instructions: string | null;
  prepTime: string | null;
  status: string;
  image: string | null;
  createdById: string;
}

interface User {
  id: string;
  name: string;
}

export default function EditDish_Page() {
  const { id } = useParams();
  const router = useRouter();
  const [dish, setDish] = useState<Dish | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    instructions: '',
    prepTime: '',
    status: '',
    image: null as File | null,
    createdById: '',
  });

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const response = await fetch(`/api/dishes?id=${id}`);
        if (response.ok) {
          const dishData = await response.json();
          setDish(dishData);
          setFormData({
            name: dishData.name,
            instructions: dishData.instructions || '',
            prepTime: dishData.prepTime || '',
            status: dishData.status,
            image: null,
            createdById: dishData.createdById,
          });
        } else {
          console.error('Error fetching dish data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const userData = await response.json();
          setUsers(userData);
        } else {
          console.error('Error al obtener usuarios');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (id) {
      fetchDish();
    }
    fetchUsers();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (e.target.name === 'image' && e.target instanceof HTMLInputElement) {
      setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append('instructions', formData.instructions);
    form.append('prepTime', formData.prepTime);
    form.append('status', formData.status);
    if (formData.image) {
      form.append('image', formData.image);
    }
    form.append('createdById',formData.createdById)

    try {
      const response = await fetch(`/api/dishes?id=${id}`, {
        method: 'PUT',
        body: form,
      });
      if (response.ok) {
        alert('Plato actualizado exitosamente');
        router.push('/dishes');
      } else {
        alert('Error al actualizar el plato');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el plato');
    }
  };

  if (!dish) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Editar Plato</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Nombre del plato</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="instructions" className="block mb-1">Instrucciones</label>
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
          <label htmlFor="prepTime" className="block mb-1">Tiempo de preparación</label>
          <input
            type="text"
            id="prepTime"
            name="prepTime"
            value={formData.prepTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="status" className="block mb-1">Estado</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="PENDING">Pendiente</option>
            <option value="APPROVED">Aprobado</option>
            <option value="REJECTED">Rechazado</option>
          </select>
        </div>
        <div>
          <label htmlFor="image" className="block mb-1">Nueva imagen del plato</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            accept="image/*"
          />
        </div>
        <div>
          <label htmlFor="createdById" className="block mb-1">Creador del plato</label>
          <select
            id="createdById"
            name="createdById"
            value={formData.createdById}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Selecciona un usuario</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.id})
              </option>
            ))}
          </select>
        </div>
        {dish.image && (
          <div>
            <p>Imagen actual:</p>
            <Image src={dish.image} alt="Imagen del plato" width={100} height={100} className="rounded-lg" />
          </div>
        )}
        <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
          Actualizar Plato
        </button>
      </form>
    </div>
  );
}