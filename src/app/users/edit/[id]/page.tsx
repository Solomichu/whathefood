'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  image: string | null;
}

export default function EditUser_Page() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '' as 'ADMIN' | 'USER',
    image: null as File | null,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users?id=${id}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setFormData({
            username: userData.username,
            email: userData.email,
            password: '',
            image: null,
            role: userData.role
          });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === 'image' && e.target instanceof HTMLInputElement) {
      setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();
    form.append('username', formData.username);
    form.append('email', formData.email);
    form.append('role', formData.role);
    if (formData.password) {
      form.append('password', formData.password);
    }
    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
      const response = await fetch(`/api/users?id=${id}`, {
        method: 'PUT',
        body: form,
      });
      if (response.ok) {
        alert('Usuario actualizado exitosamente');
        router.push('/users');
      } else {
        alert('Error al actualizar el usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el usuario');
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Editar Usuario</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1">Nombre de usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Nueva contraseña (dejar en blanco para no cambiar)</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="role" className="block mb-1">Rol</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="USER">Usuario</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
        <div>
          <label htmlFor="image" className="block mb-1">Nueva imagen de perfil</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            accept="image/*"
          />
        </div>
        {user.image && (
          <div>
            <p>Imagen actual:</p>
            <Image src={user.image} alt="Perfil del usuario" width={100} height={100} className="rounded-full" />
          </div>
        )}
        <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
          Actualizar Usuario
        </button>
      </form>
    </div>
  );
}
