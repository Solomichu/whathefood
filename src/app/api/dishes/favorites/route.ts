import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET platos favoritos de un usuario
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'Se requiere un ID de usuario' }, { status: 400 });
    }

    try {
        const favoriteDishes = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                likedDishes: {
                    include: {
                        createdBy: {
                            select: {
                                id: true,
                                username: true,
                                image: true,
                            },
                        },
                    },
                },
            },
        });

        if (!favoriteDishes) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // Transformar los datos para mantener consistencia con el formato existente
        const transformedDishes = favoriteDishes.likedDishes.map(dish => ({
            ...dish,
            creatorUsername: dish.createdBy?.username || 'Usuario desconocido',
            creatorImage: dish.createdBy?.image || '/ruta/a/imagen/por/defecto.jpg',
            createdBy: undefined,
        }));

        return NextResponse.json({ dishes: transformedDishes });
    } catch (error) {
        console.error('Error al obtener platos favoritos:', error);
        return NextResponse.json({ error: 'Error al obtener platos favoritos' }, { status: 500 });
    }
}

// POST marcar/desmarcar plato como favorito
export async function POST(request: Request) {
    try {
        const { userId, dishId, action } = await request.json();

        if (!userId || !dishId) {
            return NextResponse.json({ 
                error: 'Se requieren userId y dishId' 
            }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                likedDishes: {
                    where: { id: dishId }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        let updatedUser;
        
        if (action === 'add') {
            // Añadir a favoritos
            updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    likedDishes: {
                        connect: { id: dishId }
                    }
                },
                include: {
                    likedDishes: true
                }
            });
        } else if (action === 'remove') {
            // Eliminar de favoritos
            updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    likedDishes: {
                        disconnect: { id: dishId }
                    }
                },
                include: {
                    likedDishes: true
                }
            });
        }

        return NextResponse.json({ 
            message: action === 'add' ? 'Plato añadido a favoritos' : 'Plato eliminado de favoritos',
            likedDishes: updatedUser?.likedDishes 
        }, { status: 200 });
    } catch (error) {
        console.error('Error al actualizar favoritos:', error);
        return NextResponse.json({ 
            error: 'Error al actualizar favoritos' 
        }, { status: 500 });
    }
}
