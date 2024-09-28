'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface Dish {
  id: string;
  name: string;
  instructions: string | null;
  prepTime: string | null;
  status: string;
  image: string | null;
  createdBy: {
    id: string;
    username: string | null;
  };
  likedBy: {
    id: string;
    username: string | null;
  }[];
  savedBy: {
    id: string;
    username: string | null;
  }[];
}

export default function DishPage() {
  const { id } = useParams();
  const [dish, setDish] = useState<Dish | null>(null);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const response = await fetch(`/api/dishes?id=${id}`);
        if (response.ok) {
          const dishData = await response.json();
          setDish(dishData);
        } else {
          console.error('Error al obtener los datos del plato');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (id) {
      fetchDish();
    }
  }, [id]);

  if (!dish) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{dish.name}</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {dish.image && (
          <div className="mb-4">
            <Image
              src={dish.image}
              alt={dish.name}
              width={300}
              height={300}
              className="rounded-lg"
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Instrucciones:</label>
          <p>{dish.instructions || 'No hay instrucciones disponibles'}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Tiempo de preparación:</label>
          <p>{dish.prepTime || 'No especificado'}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Estado:</label>
          <p>{dish.status}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Creado por:</label>
          <p>{dish.createdBy.username || 'Usuario desconocido'}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Gustado por:</label>
          <p>{dish.likedBy.length} usuarios</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Guardado por:</label>
          <p>{dish.savedBy.length} usuarios</p>
        </div>
      </div>
    </div>
  );
}