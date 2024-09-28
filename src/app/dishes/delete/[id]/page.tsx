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
}

export default function DeleteDish_Page() {
    const { id } = useParams();
    const router = useRouter();
    const [dish, setDish] = useState<Dish | null>(null);

    useEffect(() => {
        const fetchDish = async () => {
            try {
                const response = await fetch(`/api/dishes?id=${id}`);
                if (response.ok) {
                    const dishData = await response.json();
                    setDish(dishData);
                } else {
                    console.error('Error fetching dish data');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        if (id) {
            fetchDish();
        }
    }, [id]);

    const handleDelete = async () => {
        if (confirm('¿Estás seguro de que quieres eliminar este plato?')) {
            try {
                const response = await fetch(`/api/dishes?id=${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Plato eliminado exitosamente');
                    router.push('/dishes');
                } else {
                    const errorData = await response.json();
                    alert(`Error al eliminar el plato: ${errorData.error}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al eliminar el plato');
            }
        }
    };

    if (!dish) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Eliminar Plato</h1>
            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                {dish.image && (
                    <Image
                        src={dish.image}
                        alt={`${dish.name}`}
                        width={100}
                        height={100}
                        className="rounded-full mx-auto mb-4"
                    />
                )}
                <p><strong>Id del plato:</strong> {dish.id}</p>
                <p><strong>Nombre del plato:</strong> {dish.name}</p>
                <p><strong>Instrucciones:</strong> {dish.instructions}</p>
                <p><strong>Tiempo de preparación:</strong> {dish.prepTime}</p>
                <p><strong>Estado:</strong> {dish.status}</p>
            </div>
            <button
                onClick={handleDelete}
                className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Eliminar Plato
            </button>
        </div>
    );
}