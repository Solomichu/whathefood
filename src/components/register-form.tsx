'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'

interface Dish {
    id: string;
    image: string | null;
    name: string;
    instructions: string | null;
    prepTime: string | null;
    status: string;
    creatorUsername: string;
    creatorImage: string;
}

export default function RegisterForm() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [dishes, setDishes] = useState<Dish[]>([])
    const [currentDish, setCurrentDish] = useState(0)
    const router = useRouter()

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const response = await fetch('/api/dishes');
                if (!response.ok) {
                    throw new Error('Error al obtener los platos');
                }
                const data = await response.json();
                setDishes(data.dishes);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchDishes();
    }, []);

    useEffect(() => {
        if (dishes.length > 0) {
            const interval = setInterval(() => {
                setCurrentDish((prev) => (prev + 1) % dishes.length)
            }, 5000) // Cambia el plato cada 5 segundos

            return () => clearInterval(interval)
        }
    }, [dishes])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        // Validar longitud mínima de contraseña
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            return
        }

        try {
            const formData = new FormData()
            formData.append('username', username)
            formData.append('email', email)
            formData.append('password', password)

            const response = await fetch('/api/users', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Error al registrar usuario')
                return
            }

            router.push('/login')
        } catch (error) {
            setError('Ocurrió un error al registrar el usuario')
            console.error(error)
        }
    }

    return (
        <div className="flex h-screen">
            <div className="w-1/2 relative">
                {dishes.length > 0 && (
                    <div 
                        className="w-full h-full bg-cover bg-center transition-all duration-500 ease-in-out"
                        style={{ backgroundImage: `url(${dishes[currentDish].image || '/placeholder.jpg'})` }}
                    >
                        <div className="absolute bottom-4 left-4 bg-white bg-opacity-80 rounded-lg p-2 flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={dishes[currentDish].creatorImage} alt={dishes[currentDish].creatorUsername} />
                                <AvatarFallback>{dishes[currentDish].creatorUsername[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-semibold">{dishes[currentDish].name}</p>
                                <p className="text-xs">{dishes[currentDish].creatorUsername}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="w-1/2 flex items-center justify-center bg-gray-100">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">WHATHEFOOD.</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="username" className="text-sm font-medium">
                                    Nombre de usuario
                                </label>
                                <Input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium">
                                    Contraseña
                                </label>
                                <Input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium">
                                    Confirmar Contraseña
                                </label>
                                <Input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <Button type="submit" className="w-full">
                                Registrarse
                            </Button>
                        </form>
                        <label className="text-sm font-medium">
                            ¿Ya tiene cuenta? <Link href="/login" className='text-primary'>Inicie sesión</Link>
                        </label>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
