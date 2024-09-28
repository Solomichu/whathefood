'use client'
import { useSession } from 'next-auth/react'
import { Session } from 'next-auth'

export default function UserInfo() {
  const { data: session } = useSession();
  const imgroute = session?.user.image;
  if (session?.user) {
    return (
      <h1>
        Bienvenido "<strong>{session.user.name}</strong>" con rol "<strong>{session.user.role}</strong>"
        <br />
        Email: {session.user.email}
        <br />
        ID: {session.user.id}
        <br />
        Role: {session.user.role}
        <br />        
        <img src={imgroute ?? 'none'} alt="Imagen de perfil" className="w-20 h-20 rounded-full" />

        
      </h1>
    )
  }
  return <h1>No has iniciado sesión</h1>
}
