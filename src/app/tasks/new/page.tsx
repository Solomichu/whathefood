'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
}

export default function NewTask_Page() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'low',
    createdById: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Error al obtener usuarios');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('priority', formData.priority);
    form.append('createdById', formData.createdById);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        body: form,
      });
      if (response.ok) {
        alert('Tarea creada exitosamente');
        router.push('/tasks');
      } else {
        alert('Error al crear la tarea');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la tarea');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Crear Nueva Tarea</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Nombre de la tarea</label>
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
          <label htmlFor="description" className="block mb-1">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            rows={4}
          ></textarea>
        </div>
        <div>
          <label htmlFor="priority" className="block mb-1">Prioridad</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>
        <div>
          <label htmlFor="createdById" className="block mb-1">Creador de la tarea</label>
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
        <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
          Crear Tarea
        </button>
      </form>
    </div>
  );
}