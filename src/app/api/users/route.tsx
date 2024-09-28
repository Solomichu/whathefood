import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { writeFile } from 'fs/promises';
import path from 'path';
import { unlink } from 'fs/promises';

const prisma = new PrismaClient();

// GET todos los usuarios
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
        // GET usuario por ID
        try {
            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                    image: true,
                    creationDate: true,
                    modificationDate: true,
                },
            });

            if (!user) {
                return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
            }

            return NextResponse.json(user);
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            return NextResponse.json({ error: 'Error al obtener el usuario' }, { status: 500 });
        }
    } else {
        // GET todos los usuarios
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                    image: true,
                    creationDate: true,
                    modificationDate: true,
                },
            });
            return NextResponse.json(users);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            return NextResponse.json({ error: 'Error al obtener los usuarios' }, { status: 500 });
        }
    }
}

// POST nuevo usuario
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const username = formData.get('username') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const imageFile = formData.get('image') as File | null;
        const role = formData.get('role') as 'ADMIN' | 'USER' || 'USER';

        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email },
                ],
            },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'El usuario o correo electrónico ya existe' }, { status: 400 });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario sin la imagen primero
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role,
            },
        });

        // Manejar la carga de la imagen si existe
        if (imageFile) {
            const imagePath = await saveUserImage(imageFile, newUser.id);
            await prisma.user.update({
                where: { id: newUser.id },
                data: { image: imagePath },
            });
        }

        return NextResponse.json({ message: 'Usuario creado exitosamente', user: newUser }, { status: 201 });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        return NextResponse.json({ error: 'Error al crear el usuario' }, { status: 500 });
    }
}

// PUT actualizar usuario
export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Se requiere un ID de usuario' }, { status: 400 });
    }

    try {
        const formData = await request.formData();
        const username = formData.get('username') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string | null;
        const role = formData.get('role') as 'ADMIN' | 'USER';
        const imageFile = formData.get('image');

        const updateData: any = { 
            username, 
            email, 
            role: role as 'ADMIN' | 'USER'  // Asegúrate de que role sea tratado como un enum
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (imageFile && typeof imageFile !== 'string') {
            const imagePath = await saveUserImage(imageFile, id);
            updateData.image = imagePath;
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ message: 'Usuario actualizado exitosamente', user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        return NextResponse.json({ error: 'Error al actualizar el usuario' }, { status: 500 });
    }
}

// DELETE usuario
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Se requiere un ID de usuario' }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: { image: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        if (user.image) {
            await deleteUserImage(user.image);
        }

        const deletedUser = await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Usuario eliminado exitosamente' }, { status: 200 });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        return NextResponse.json({ error: 'Error al eliminar el usuario' }, { status: 500 });
    }
}

// Función auxiliar para guardar imágenes de usuario
async function saveUserImage(imageFile: any, userId: string): Promise<string> {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExtension = path.extname(imageFile.name);
    const fileName = `${userId}${fileExtension}`;
    
    const imagePath = path.join(process.cwd(), 'public', 'images', 'user', fileName);
    
    await writeFile(imagePath, buffer);

    return `/images/user/${fileName}`;
}

// Función auxiliar para eliminar imágenes de usuario
async function deleteUserImage(imagePath: string): Promise<void> {
    
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    try {
        await unlink(fullPath);
    } catch (error) {
        console.error('Error al eliminar la imagen del usuario:', error);
    }
}