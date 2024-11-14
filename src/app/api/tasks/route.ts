import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
        try {
            const task = await prisma.task.findUnique({
                where: { id },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                },
            });

            if (!task) {
                return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 });
            }

            return NextResponse.json(task);
        } catch (error) {
            console.error('Error al obtener la tarea:', error);
            return NextResponse.json({ error: 'Error al obtener la tarea' }, { status: 500 });
        }
    } else {
        try {
            const tasks = await prisma.task.findMany({
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                },
            });
            return NextResponse.json(tasks);
        } catch (error) {
            console.error('Error al obtener las tareas:', error);
            return NextResponse.json({ error: 'Error al obtener las tareas' }, { status: 500 });
        }
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        
        // Obtener los campos del FormData
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const priority = formData.get('priority') as string;
        const createdById = formData.get('createdById') as string;

        if (!name || !createdById) {
            return NextResponse.json({ 
                error: 'Nombre y creador son requeridos' 
            }, { status: 400 });
        }

        // Crear la tarea usando los campos correctos según el schema
        const newTask = await prisma.task.create({
            data: {
                name,
                description: description || null,
                priority,
                createdById,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        username: true,
                        image: true,
                    }
                }
            }
        });

        // Transformar la respuesta similar a como se hace con los platos
        const transformedTask = {
            ...newTask,
            creatorUsername: newTask.createdBy?.username || 'Usuario desconocido',
            creatorImage: newTask.createdBy?.image || '/ruta/a/imagen/por/defecto.jpg',
            createdBy: undefined, // Eliminar el objeto createdBy original
        };

        return NextResponse.json({ 
            message: 'Tarea creada exitosamente', 
            task: transformedTask 
        }, { status: 201 });
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : 'Error al crear la tarea' 
        }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Se requiere un ID de tarea' }, { status: 400 });
    }

    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const priority = formData.get('priority') as string;
        const createdById = formData.get('createdById') as string;

        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                name,
                description,
                priority,
                createdById,
            },
        });

        return NextResponse.json({ message: 'Tarea actualizada exitosamente', task: updatedTask }, { status: 200 });
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        return NextResponse.json({ error: 'Error al actualizar la tarea' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Se requiere un ID de tarea' }, { status: 400 });
    }

    try {
        await prisma.task.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Tarea eliminada exitosamente' }, { status: 200 });
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        return NextResponse.json({ error: 'Error al eliminar la tarea' }, { status: 500 });
    }
}