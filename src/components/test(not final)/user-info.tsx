'use client'
import { useSession } from 'next-auth/react'
import Image from 'next/image';

export default function UserInfo() {
  const { data: session } = useSession();
  const imgroute = session?.user.image;
  if (session?.user) {
    return (
      <h1>
        Bienvenido '<strong>{session.user.name}</strong>' con rol '<strong>{session.user.role}</strong>'
        <br />
        Email: {session.user.email}
        <br />
        ID: {session.user.id}
        <br />
        Role: {session.user.role}
        <br />        
        <Image 
          src={imgroute ?? '/ruta/a/imagen/por/defecto.jpg'} 
          alt="Imagen de perfil" 
          width={80} 
          height={80} 
          className="rounded-full"
        />
        
      </h1>
    )
  }
  return <h1>No has iniciado sesión</h1>
}
