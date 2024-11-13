import Link from "next/link";
import React, { useState } from 'react'
import { ModeToggle } from './theme-toggle-button'
import { signOut, useSession } from "next-auth/react"
import { Button } from "./ui/button";
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

interface AdminNavbarProps {
  onNavClick: (page: string) => void
}

export default function AdminNavbar({ onNavClick }: AdminNavbarProps) {
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePage, setActivePage] = useState('recipes');
  const router = useRouter()

  const handleNavClick = (page: string) => {
    setActivePage(page);
    onNavClick(page);
  };

  return (
    <aside 
      className={`inset-y-0 left-0 z-10 flex-col border-r border-primary hidden sm:flex justify-between h-[100vh] bg-primary transition-all duration-300 ${isExpanded ? 'w-48' : 'w-14'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <Link href="/" className={`flex w-full justify-center mt-5 py-5 transition-transform duration-300 ${isExpanded ? '-rotate-90' : ''}`}>          
          <h1 className="[writing-mode:vertical-lr] text-secondary text-xl font-bold">WHATHEFOOD.</h1>
      </Link>

      <nav className="flex flex-col justify-center items-center gap-8 py-5 px-2">
        <NavButton onClick={() => handleNavClick('default')} icon={<RecipesIcon />} label="Recetas" expanded={isExpanded} active={activePage === 'recipes'} />
        <NavButton onClick={() => handleNavClick('favorites')} icon={<HeartIcon />} label="Favoritos" expanded={isExpanded} active={activePage === 'favorites'} />
        <NavButton onClick={() => handleNavClick('my-recipes')} icon={<ChefIcon />} label="Mis Recetas" expanded={isExpanded} active={activePage === 'my-recipes'} />
        <NavButton onClick={() => handleNavClick('my-menus')} icon={<MenusIcon />} label="Mis Menús" expanded={isExpanded} active={activePage === 'my-menus'} />
        <NavButton onClick={() => handleNavClick('my-tasks')} icon={<TasksIcon />} label="Mis Tareas" expanded={isExpanded} active={activePage === 'my-tasks'} />
      </nav>

      <nav className="flex flex-col items-center gap-4 px-2 py-5 w-full">
        <div className="flex items-center gap-2">
          <div className="bg-secondary rounded-lg p-1 justify-between">
            <ModeToggle/>
          </div>
          {isExpanded && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80">
                  <AvatarImage src={session?.user?.image || '/default-avatar.jpg'} alt="Perfil" />
                  <AvatarFallback>{session?.user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => router.push('/profile/details')} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Cuenta</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => signOut({ callbackUrl: '/' })} 
                  className="cursor-pointer text-red-600 hover:!text-red-600 hover:!bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </aside>
  )
}

interface NavButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    expanded: boolean;
    active: boolean;
  }
function NavButton({ onClick, icon, label, expanded, active }: NavButtonProps) {
    return (
      <button 
        onClick={onClick} 
        className={`
          flex transition-all duration-150 ease-in-out 
          items-center justify-center 
          rounded-lg w-full 
          relative
          ${expanded ? 'px-3 py-2' : 'h-9 w-9 md:h-8 md:w-8'}
          ${active 
            ? 'bg-secondary text-primary before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1  before:rounded-r-lg' 
            : 'text-secondary hover:bg-secondary/10'
          }
        `}
      >
        {icon}
        <span 
          className={`
            ml-3 text-m whitespace-nowrap
            transition-all duration-75 ease-in-out
            ${expanded 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-4 absolute'
            }
          `}
        >
          {label}
        </span>
      </button>
    )
  }
// Añadir nuevo icono para favoritos
function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  )
}

// Añadir icono para chef (mis recetas)
function ChefIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6V13.87Z"></path>
      <line x1="6" y1="17" x2="18" y2="17"></line>
    </svg>
  )
}
function MenusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M4 20h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"></path>
      <rect x="2" y="9" width="20" height="12" rx="2" ry="2"></rect>
    </svg>
  )
}
function TasksIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="h-5 w-5"
    >
      <path d="M9 11l3 3L22 4"></path>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>
  )
}   
function RecipesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
      <path d="M9 18h6"></path>
      <path d="M12 22v-4"></path>
    </svg>
  )
}   
// Mantener los demás iconos existentes...

