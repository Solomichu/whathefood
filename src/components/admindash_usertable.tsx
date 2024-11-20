'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
    id: string;
    username: string;
    email: string;
    role: 'ADMIN' | 'USER';
    image: string | null;
    creationDate: string;
    modificationDate: string;
}

type SortKey = keyof User;

const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
};

export default function UserTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [dialogType, setDialogType] = useState<'create' | 'edit' | 'view' | 'delete'>('create');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'USER' as 'ADMIN' | 'USER',
        image: null as File | null,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const response = await fetch('/api/users');
        if (response.ok) {
            const data = await response.json();
            setUsers(data);
        }
    };

    const handleAction = (user: User, action: 'view' | 'edit' | 'delete') => {
        setSelectedUser(user);
        setDialogType(action);
        if (action === 'edit') {
            setFormData({
                username: user.username,
                email: user.email,
                password: '',
                role: user.role,
                image: null,
            });
        }
        setIsDialogOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (value: string) => {
        setFormData(prev => ({ ...prev, role: value as 'ADMIN' | 'USER' }));
    };

    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedUser) return;
    
        const form = new FormData();
        form.append('username', formData.username);
        form.append('email', formData.email);
        form.append('role', formData.role);
        if (formData.password) {
            form.append('password', formData.password);
        }
        if (formData.image instanceof File) {
            form.append('image', formData.image);
        }
    
        try {
            const response = await fetch(`/api/users?id=${selectedUser.id}`, {
                method: 'PUT',
                body: form,
            });
            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                fetchUsers();
                handleCloseDialog();
            } else {
                const errorData = await response.json();
                alert(`Error al actualizar el usuario: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar el usuario');
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;

        try {
            const response = await fetch(`/api/users?id=${selectedUser.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al eliminar el usuario');
            }

            // Actualizar la lista de usuarios
            setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id));
            
            // Cerrar el diálogo y limpiar el estado
            handleCloseDialog();
            setSelectedUser(null);
            
            // Opcional: Mostrar mensaje de éxito
            alert('Usuario eliminado exitosamente');
        } catch (error) {
            console.error('Error:', error);
            alert(error instanceof Error ? error.message : 'Error al eliminar el usuario');
        }
    };

    const sortData = (key: SortKey) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedUsers = [...users].sort((a, b) => {
            if (a[key] == null || b[key] == null) return 0;
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        });

        setUsers(sortedUsers);
    };

    const getSortDirection = (key: SortKey) => {
        if (!sortConfig || sortConfig.key !== key) {
            return '';
        }
        return sortConfig.direction === 'ascending' ? '↑' : '↓';
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toString().includes(searchTerm)
    );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData();
        form.append('username', formData.username);
        form.append('email', formData.email);
        form.append('password', formData.password);
        form.append('role', formData.role); // Asegúrate de incluir el rol
        if (formData.image instanceof File) {
            form.append('image', formData.image); 
        }

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                body: form,
            });
            if (response.ok) {
                fetchUsers(); // Actualizar la lista de usuarios
                handleCloseDialog();
            } else {
                const errorData = await response.json();
                alert(`Error al crear el usuario: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al crear el usuario');
        }
    };

    const openCreateDialog = () => {
        setDialogType('create');
        setFormData({
            username: '',
            email: '',
            password: '',
            role: 'USER',
            image: null,
        });
        setIsDialogOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, image: e.target.files![0] }));
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setTimeout(() => {
            document.body.style.removeProperty('pointer-events');
        }, 100);
    };

    return (
        <div className="w-full">
            
            <div className="flex flex-col space-y-1.5 mb-7">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Usuarios</h3>
                <p className="text-sm text-muted-foreground">Gestiona los usuarios de la plataforma.</p>
            </div>
            <hr className='my-6'/>
            <div className="flex justify-between items-center mb-4">
                <Input
                    type="text"
                    placeholder="Buscar por nombre o ID"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="max-w-sm"
                />
                <Button onClick={openCreateDialog}>
                    Crear Usuario
                </Button>
            </div>
            <div className="w-full overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">Imagen</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer" onClick={() => sortData('username')}>
                                Nombre de usuario {getSortDirection('username')}
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer" onClick={() => sortData('email')}>
                                Email {getSortDirection('email')}
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer" onClick={() => sortData('role')}>
                                Rol {getSortDirection('role')}
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer" onClick={() => sortData('creationDate')}>
                                Fecha de creación {getSortDirection('creationDate')}
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer" onClick={() => sortData('modificationDate')}>
                                Última modificación {getSortDirection('modificationDate')}
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 align-middle">
                                    {user.image ? (
                                        <Image
                                            src={user.image}
                                            alt={`${user.username}'s avatar`}
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                            <span className="text-gray-500 text-xl">{user.username[0].toUpperCase()}</span>
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 align-middle font-medium">{user.username}</td>
                                <td className="p-4 align-middle">{user.email}</td>
                                <td className="p-4 align-middle">
                                    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {user.role}
                                    </div>
                                </td>
                                <td className="p-4 align-middle">{formatDate(user.creationDate)}</td>
                                <td className="p-4 align-middle">{formatDate(user.modificationDate)}</td>
                                <td className="p-4 align-middle">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Abrir menú</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                                    <circle cx="12" cy="12" r="1"></circle>
                                                    <circle cx="19" cy="12" r="1"></circle>
                                                    <circle cx="5" cy="12" r="1"></circle>
                                                </svg>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleAction(user, 'view')}>Ver usuario</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleAction(user, 'edit')}>Editar usuario</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleAction(user, 'delete')}>Eliminar usuario</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Dialog 
                open={isDialogOpen} 
                onOpenChange={(open) => {
                    if (!open) {
                        handleCloseDialog();
                    } else {
                        setIsDialogOpen(true);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {dialogType === 'create' ? 'Crear Usuario' : 
                             dialogType === 'edit' ? 'Editar Usuario' : 
                             dialogType === 'view' ? 'Ver Usuario' : 
                             dialogType === 'delete' ? 'Eliminar Usuario' : ''}
                        </DialogTitle>
                    </DialogHeader>
                    {dialogType === 'delete' ? (
                        <div>
                            <p>¿Estás seguro de que quieres eliminar este usuario?</p>
                            <DialogFooter>
                                <Button onClick={handleDelete} variant="destructive">Eliminar</Button>
                                <Button onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            </DialogFooter>
                        </div>
                    ) : dialogType === 'view' ? (
                        <div>
                            {/* Mostrar detalles del usuario */}
                            <p>Nombre de usuario: {selectedUser?.username}</p>
                            <p>Email: {selectedUser?.email}</p>
                            <p>Rol: {selectedUser?.role}</p>
                            {/* ... otros detalles ... */}
                        </div>
                    ) : (
                        <form onSubmit={dialogType === 'create' ? handleSubmit : handleEdit} className="space-y-4">
                            <div>
                                <Label htmlFor="username">Nombre de usuario</Label>
                                <Input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">{dialogType === 'create' ? 'Contraseña' : 'Nueva contraseña (dejar en blanco para no cambiar)'}</Label>
                                <Input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required={dialogType === 'create'}
                                />
                            </div>
                            <div>
                                <Label htmlFor="role">Rol</Label>
                                <Select 
                                    value={formData.role} 
                                    onValueChange={handleRoleChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                                        <SelectItem value="USER">USER</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="image">Imagen de perfil</Label>
                                <Input
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">
                                    {dialogType === 'create' ? 'Crear Usuario' : 'Actualizar Usuario'}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}