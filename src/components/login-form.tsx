'use client'
import React, { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Session } from 'next-auth'

export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })
            console.log(`Components/login-form.tsx:29 user role: 23`)

            if (result?.error) {
                console.log(`Components/login-form.tsx:29 user role: 26`)
                setError('Credenciales inválidas')
            } else {
                // Obtener la sesión actual
                const session = await getSession()
                console.log(`Components/login-form.tsx:31 user role: ${session?.user?.role}`)
                if (session?.user?.role === 'ADMIN') {
                    console.log(` if Components/login-form.tsx:33 user role: ${session?.user?.role}`)
                    router.push('/admin/dashboard')
                } else {
                    console.log(` else Components/login-form.tsx:38 user role: ${session?.user?.role}`)
                    router.push('/')
                }
            }
        } catch (error) {
            setError('Ocurrió un error al iniciar sesión')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                    Correo electrónico
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                />
            </div>
            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                    Contraseña
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
                Iniciar sesión
            </button>
        </form>
    )
}
