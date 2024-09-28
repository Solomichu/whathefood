'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

// Definimos una interfaz para el usuario
interface User {
    id: string;
    name: string; // Asumimos que el usuario tiene un nombre
}

export default function NewDish_Page() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        instructions: '',
        prepTime: '',
        image: null as File | null,
        createdById: '',
    });

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        // Función para obtener los usuarios
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users'); // Asumimos que tienes un endpoint para obtener usuarios
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        form.append('createdById',formData.createdById)
        // Aquí deberías incluir el ID del usuario que está creando el plato
        if (formData.image) {
            form.append('image', formData.image);
        }

        try {
            const response = await fetch('/api/dishes', {
                method: 'POST',
                body: form,
            });
            if (response.ok) {
                alert('Plato creado exitosamente');
                router.push('/dishes');
            } else {
                alert('Error al crear el plato');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al crear el plato');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Crear Nuevo Plato</h1>
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
                        required
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
                        required
                    />
                </div>
                <div>
                    <label htmlFor="image" className="block mb-1">Imagen del plato</label>
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
                    <label htmlFor="createdById" className="block mb-1">Usuario creador</label>
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
                    Crear Plato
                </button>
            </form>
        </div>
    );
}