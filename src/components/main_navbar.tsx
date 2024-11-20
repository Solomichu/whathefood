'use client'
import Link from "next/link";
import React from 'react';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react"; // Importar iconos
import { Button } from "./ui/button";

export default function UserNavbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleProfileClick = () => {
    router.push('/profile/details');
  };

  return (
    <nav className="fixed w-full top-0 z-50">
      <div className="mx-auto w-[80%] flex items-center justify-between py-4">
        {/* Logo - 1/3 */}
        <div className="w-1/3">
          <Link href="/" className="text-white text-xl font-bold">
            WHATHEFOOD.
          </Link>
        </div>

        {/* Espacio vacío - 1/3 */}
        <div className="w-1/3" />

        {/* Navegación y perfil - 1/3 */}
        <div className="w-1/3 flex items-center justify-end space-x-8">
          <Link href="/dashboard" className="text-white hover:text-gray-200">
            Explorar Recetas
          </Link>
          <Link href="/about" className="text-white hover:text-gray-200">
            Sobre Nosotros
          </Link>
          
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80">
                  <AvatarImage src={session.user.image || '/default-avatar.jpg'} alt="Perfil" />
                  <AvatarFallback>{session.user.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Cuenta</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => signOut()} 
                  className="cursor-pointer text-red-600 hover:!text-red-600 hover:!bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={handleLogin}
              className="text-white hover:text-gray-200"
              
            >
              Log in
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
