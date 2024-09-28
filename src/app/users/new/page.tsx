'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function NewUser_Page() {
    const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'image') {
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
    form.append('password', formData.password);
    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: form,
      });
      if (response.ok) {
        alert('Usuario creado exitosamente');
        router.push('/users');
        // Aquí puedes redirigir al usuario o limpiar el formulario
      } else {
        alert('Error al crear el usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el usuario');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
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
          <label htmlFor="password" className="block mb-1">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="image" className="block mb-1">Imagen de perfil</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            accept="image/*"
          />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
          Crear Usuario
        </button>
      </form>
    </div>
  );
}
