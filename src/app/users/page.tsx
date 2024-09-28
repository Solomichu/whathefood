'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface User {
  id: string;
  username: string | null;
  email: string;
  role: string;
  image: string | null;
  creationDate: string;
  modificationDate: string;
}

export default function UserList_Page() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Error al obtener los usuarios');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Usuarios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white shadow-md rounded-lg p-4">
            <div className="flex items-center mb-4">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={`${user.username}'s profile`}
                  width={50}
                  height={50}
                  className="rounded-full mr-4"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              )}
              <h1 className="text-2xl font-bold">{user.username || 'Sin nombre'} </h1>
            </div>
            <h2 className='text-xl font-semibold'>Id: {user.id}</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rol:</strong> {user.role}</p>
            <p><strong>Fecha de creación:</strong> {new Date(user.creationDate).toLocaleDateString()}</p>
            <p><strong>Última modificación:</strong> {new Date(user.modificationDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
