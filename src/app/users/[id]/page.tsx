'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  image: string | null;
  creationDate: string;
  modificationDate: string;
}

export default function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users?id=${id}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error('Error al obtener los datos del usuario');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Perfil de Usuario</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {user.image && (
          <div className="mb-4">
            <Image
              src={user.image}
              alt={`Perfil de ${user.username}`}
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-black text-2xl font-bold mb-2">Nombre de usuario:</label>
          <p>{user.username}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 text-xl font-bold mb-2">Id de usuario:</label>
          <p>{user.id}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <p>{user.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Rol:</label>
          <p>{user.role}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Fecha de creación:</label>
          <p>{new Date(user.creationDate).toLocaleDateString()}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Última modificación:</label>
          <p>{new Date(user.modificationDate).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
