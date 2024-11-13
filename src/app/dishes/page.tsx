'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Dish {
  id: string;
  name: string;
  image: string | null;
  prepTime: string | null;
  status: string;
  createdBy?: {
    id: string;
    username: string | null;
  };
}

interface StatusCount {
  status: string;
  _count: { status: number };
}

interface UserWithDishCount {
  id: string;
  username: string;
  _count: { dishes: number };
}

export default function DishList_Page() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [availableStatuses, setAvailableStatuses] = useState<StatusCount[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [usersWithDishes, setUsersWithDishes] = useState<UserWithDishCount[]>([]);
  const [selectedUser, setSelectedUser] = useState('');

  const fetchDishes = React.useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedStatus) params.append('status', selectedStatus);
      if (selectedUser) params.append('userId', selectedUser);

      const response = await fetch(`/api/dishes?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setDishes(data.dishes);
        setAvailableStatuses(data.availableStatuses);
        setUsersWithDishes(data.usersWithDishes);
      } else {
        console.error('Error al obtener los platos');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [search, selectedStatus, selectedUser]);

  useEffect(() => {
    fetchDishes();
  }, [search, selectedStatus, selectedUser, fetchDishes]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Platos</h1>
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Buscar platos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded"
        />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">Todos los estados</option>
          {availableStatuses.map((status) => (
            <option key={status.status} value={status.status}>
              {status.status} ({status._count.status})
            </option>
          ))}
        </select>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">Todos los usuarios</option>
          {usersWithDishes.map((user) => (
            <option key={user.id} value={user.id}>
              {user.id}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dishes.map((dish) => (
          <div key={dish.id} className="bg-white shadow-md rounded-lg p-4">
            <div className="flex items-center mb-4">
              {dish.image ? (
                <Image
                  src={dish.image}
                  alt={dish.name}
                  width={100}
                  height={100}
                  className="rounded-lg mr-4"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-300 rounded-lg mr-4"></div>
              )}
              <h2 className="text-xl font-bold">{dish.name}</h2>
            </div>
            <p><strong>Id:</strong> {dish.id || 'No especificado'}</p>
            <p><strong>Tiempo de preparación:</strong> {dish.prepTime || 'No especificado'}</p>
            <p><strong>Estado:</strong> {dish.status}</p>
            <p><strong>Creado por:</strong> {dish.createdBy?.username || 'Usuario desconocido'}</p>
            <p><strong>Creado por UserID:</strong> {dish.createdBy?.id || 'Usuario desconocido'}</p>
            <Link href={`/dishes/${dish.id}`} className="text-blue-500 hover:underline">
              Ver detalles
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}