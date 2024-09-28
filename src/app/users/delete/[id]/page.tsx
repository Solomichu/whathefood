'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function DeleteUser_Page() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users?id=${id}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error('Error fetching user data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const response = await fetch(`/api/users?id=${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          alert('Usuario eliminado exitosamente');
          router.push('/users');
        } else {
          const errorData = await response.json();
          alert(`Error al eliminar el usuario: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el usuario');
      }
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Eliminar Usuario</h1>
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        {user.image && (
          <Image
            src={user.image}
            alt={`${user.username}'s profile`}
            width={100}
            height={100}
            className="rounded-full mx-auto mb-4"
          />
        )}
        <p><strong>Nombre de usuario:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.role}</p>
        <p><strong>Fecha de creación:</strong> {new Date(user.creationDate).toLocaleDateString()}</p>
        <p><strong>Última modificación:</strong> {new Date(user.modificationDate).toLocaleDateString()}</p>
      </div>
      <button 
        onClick={handleDelete}
        className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Eliminar Usuario
      </button>
    </div>
  );
}