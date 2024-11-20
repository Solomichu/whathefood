import Link from "next/link";
import React, { useState } from 'react'
import { ModeToggle } from './theme-toggle-button'
import { signOut } from "next-auth/react"
import { Button } from "./ui/button";
import { useRouter } from "next/navigation"

interface AdminNavbarProps {
  onNavClick: (page: string) => void;
  activePage: string;
}

export default function AdminNavbar({ onNavClick, activePage }: AdminNavbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter()

  const handleNavClick = (page: string) => {
    onNavClick(page);
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false })
      router.push('/')
    } catch (error) {
      console.error('Error durante el logout:', error)
    }
  }

  return (
    <aside 
      className={`inset-y-0 left-0 z-10 flex-col border-r border-primary hidden sm:flex justify-between h-[100vh] bg-primary transition-all duration-300 ${isExpanded ? 'w-48' : 'w-14'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <Link href="/" className={`flex w-full justify-center mt-5 py-5 transition-transform duration-300 ${isExpanded ? '-rotate-90' : ''}`}>          
          <h1 className="[writing-mode:vertical-lr] text-secondary text-xl font-bold">WHATHEFOOD+</h1>
      </Link>

      <nav className="flex flex-col justify-center items-center gap-8 py-5 px-2">
        {/* Sección de Administrador */}
        <div className="w-full">
          {isExpanded && (
            <h2 className="text-secondary/70 text-xs uppercase mb-2 px-3">Administrador</h2>
          )}
          <div className="flex flex-col gap-2">
            <NavButton onClick={() => handleNavClick('dashboard')} icon={<HomeIcon />} label="Dashboard" expanded={isExpanded} active={activePage === 'dashboard'} />
            <NavButton onClick={() => handleNavClick('users')} icon={<UsersIcon />} label="Panel de usuarios" expanded={isExpanded} active={activePage === 'users'} />
            <NavButton onClick={() => handleNavClick('recipes')} icon={<RecipesIcon />} label="Recetas" expanded={isExpanded} active={activePage === 'recipes'} />
          </div>
        </div>

        {/* Sección Personal */}
        <div className="w-full">
          {isExpanded && (
            <h2 className="text-secondary/70 text-xs uppercase mb-2 px-3">Personal</h2>
          )}
          <div className="flex flex-col gap-2">
            <NavButton onClick={() => handleNavClick('my-recipes')} icon={<MyRecipesIcon />} label="Mis Recetas" expanded={isExpanded} active={activePage === 'my-recipes'} />
            <NavButton onClick={() => handleNavClick('favourites')} icon={<HeartIcon />} label="Favoritos" expanded={isExpanded} active={activePage === 'favourites'} />
            <NavButton onClick={() => handleNavClick('tasks')} icon={<TasksIcon />} label="Tareas" expanded={isExpanded} active={activePage === 'tasks'} />
          </div>
        </div>
      </nav>

      <nav className="flex flex-col items-center gap-4 px-2 py-5 w-full">
        <div className="flex items-center gap-2">
          <div className="bg-secondary rounded-lg p-1 justify-between">
            <ModeToggle/>
          </div>
          {isExpanded && (
            <Button
              onClick={handleSignOut}
              className="bg-secondary text-primary rounded-lg p-1 hover:bg-red-700 hover:text-white transition-colors"
            >
              <LogoutIcon />
            </Button>
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
          ? 'bg-secondary text-primary before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:rounded-r-lg' 
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

// Definir los componentes de iconos aquí (HomeIcon, UsersIcon, etc.)
function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
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

function TasksIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
    </svg>
  )
}

// Agregar nuevos iconos
function MyRecipesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <line x1="10" y1="9" x2="8" y2="9"></line>
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  )
}

// Definir los demás iconos de manera similar...

