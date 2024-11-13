'use client'
import React, { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
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

export default function LoginForm() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
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

		try {
			const result = await signIn('credentials', {
				email,
				password,
				redirect: false,
			})

			if (result?.error) {
				setError('Credenciales inválidas')
			} else {
				const session = await getSession()
				if (session?.user?.role === 'ADMIN') {
					router.push('/admin/dashboard')
				} else {
					router.push('/dashboard')
				}
			}
		} catch (error) {
			setError('Ocurrió un error al iniciar sesión')
			console.log(error)
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
								/>
							</div>
							{error && <p className="text-red-500 text-sm">{error}</p>}
							<Button type="submit" className="w-full">
								Iniciar sesión
							</Button>
						</form>
						<label className="text-sm font-medium">
							No tiene cuenta? <Link href="/register" className='text-primary'>Cree una</Link>
						</label>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}