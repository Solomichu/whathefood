// @typescript-eslint/no-explicit-any

import { NextResponse } from 'next/server';
import { PrismaClient, Status } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';
import { unlink } from 'fs/promises';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// GET todos los platos o un plato específico
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search');
    const status = searchParams.get('status') as Status | null;
    const userId = searchParams.get('userId');

    if (id) {
        // Código existente para obtener un plato específico
        // ...
        // GET plato por ID
        
        try {
            const dish = await prisma.dish.findUnique({
                where: { id },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                    likedBy: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                    savedBy: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                },
            });

            if (!dish) {
                return NextResponse.json({ error: 'Plato no encontrado' }, { status: 404 });
            }

            return NextResponse.json(dish);
        } catch (error) {
            console.error('Error al obtener el plato:', error);
            return NextResponse.json({ error: 'Error al obtener el plato' }, { status: 500 });
        }
    } else {
        // GET todos los platos con filtros opcionales
        try {
            const whereClause: Prisma.DishWhereInput = {};

            if (search) {
                whereClause.name = { contains: search, mode: 'insensitive' };
            }

            if (status) {
                whereClause.status = status;
            }

            if (userId) {
                whereClause.createdById = userId;
            }

            const dishes = await prisma.dish.findMany({
                where: whereClause,
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            username: true,
                            image: true,
                        },
                    },
                },
            });

            // Transformar los datos para incluir el username y la imagen del creador
            const transformedDishes = dishes.map(dish => ({
                ...dish,
                creatorUsername: dish.createdBy?.username || 'Usuario desconocido',
                creatorImage: dish.createdBy?.image || '/ruta/a/imagen/por/defecto.jpg',
                createdBy: undefined, // Eliminar el objeto createdBy original
                createdById: undefined, // Eliminar el createdById
            }));

            const availableStatuses = await prisma.dish.groupBy({
                by: ['status'],
                _count: {
                    status: true,
                },
            });

            const usersWithDishes = await prisma.user.findMany({
                where: {
                    createdDishes: {
                        some: {},
                    },
                },
                select: {
                    id: true,
                    username: true,
                    _count: {
                        select: {
                            createdDishes: true,
                        },
                    },
                },
            });

            return NextResponse.json({ dishes: transformedDishes, availableStatuses, usersWithDishes });
        } catch (error) {
            console.error('Error al obtener los platos:', error);
            return NextResponse.json({ error: 'Error al obtener los platos' }, { status: 500 });
        }
    }
}

// POST nuevo plato
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const instructions = formData.get('instructions') as string;
        const prepTime = formData.get('prepTime') as string;
        const createdById = formData.get('createdById') as string;
        const imageFile = formData.get('image') as File | null;

        // Crear el nuevo plato sin la imagen primero
        const newDish = await prisma.dish.create({
            data: {
                name,
                instructions,
                prepTime,
                createdById,
            },
        });

        // Manejar la carga de la imagen si existe
        if (imageFile) {
            const imagePath = await saveDishImage(imageFile, newDish.id);
            await prisma.dish.update({
                where: { id: newDish.id },
                data: { image: imagePath },
            });
        }

        return NextResponse.json({ message: 'Plato creado exitosamente', dish: newDish }, { status: 201 });
    } catch (error) {
        console.error('Error al crear el plato:', error);
        return NextResponse.json({ error: 'Error al crear el plato' }, { status: 500 });
    }
}

// PUT actualizar plato
export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Se requiere un ID de plato' }, { status: 400 });
    }

    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const instructions = formData.get('instructions') as string;
        const prepTime = formData.get('prepTime') as string;
        const status = formData.get('status') as string;
        const createdById = formData.get('createdById') as string;
        const imageFile = formData.get('image') as File | null;

        const updateData: any = {
            name,
            instructions,
            prepTime,
            status,
        };

        // Solo actualiza la relación con el usuario si se proporciona createdById
        if (createdById) {
            updateData.createdBy = { connect: { id: createdById } };
        }

        // Manejar la actualización de la imagen
        if (imageFile) {
            const imagePath = await saveDishImage(imageFile, id);
            updateData.image = imagePath;
        }

        const updatedDish = await prisma.dish.update({
            where: { id },
            data: updateData,
            include: { 
                createdBy: {
                    select: {
                        id: true,
                        username: true,
                        image: true,
                    }
                }
            },
        });

        // Transforma los datos antes de enviarlos al cliente
        const transformedDish = {
            ...updatedDish,
            creatorUsername: updatedDish.createdBy?.username || 'Usuario desconocido',
            creatorImage: updatedDish.createdBy?.image || '/ruta/a/imagen/por/defecto.jpg',
            createdBy: undefined, // Elimina el objeto createdBy original
        };

        return NextResponse.json(transformedDish);
    } catch (error: any) {
        console.error('Error al actualizar el plato:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE plato
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Se requiere un ID de plato' }, { status: 400 });
    }

    try {
        const dish = await prisma.dish.findUnique({
            where: { id },
            select: { image: true }
        });

        if (!dish) {
            return NextResponse.json({ error: 'Plato no encontrado' }, { status: 404 });
        }

        if (dish.image) {
            await deleteDishImage(dish.image);
        }

        await prisma.dish.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Plato eliminado exitosamente' }, { status: 200 });
    } catch (error) {
        console.error('Error al eliminar el plato:', error);
        return NextResponse.json({ error: 'Error al eliminar el plato' }, { status: 500 });
    }
}

// Función auxiliar para guardar imágenes de platos
async function saveDishImage(imageFile: File, dishId: string): Promise<string> {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExtension = path.extname(imageFile.name);
    const fileName = `${dishId}${fileExtension}`;

    const imagePath = path.join(process.cwd(), 'public', 'images', 'dishes', fileName);

    await writeFile(imagePath, buffer);

    return `/images/dishes/${fileName}`;
}

// Función auxiliar para eliminar imágenes de platos
async function deleteDishImage(imagePath: string): Promise<void> {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    try {
        await unlink(fullPath);
    } catch (error) {
        console.error('Error al eliminar la imagen del plato:', error);
    }
}