import Link from "next/link";
import React, { useState } from 'react'
import { ModeToggle } from './theme-toggle-button'
import { signOut } from "next-auth/react"
import { Button } from "./ui/button";

interface AdminNavbarProps {
  onNavClick: (page: string) => void
}

export default function AdminNavbar({ onNavClick }: AdminNavbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside 
      className={`inset-y-0 left-0 z-10 flex-col border-r border-primary hidden sm:flex justify-between h-[100vh] bg-primary transition-all duration-300 ${isExpanded ? 'w-48' : 'w-14'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <Link href="/" className="flex w-full justify-center mt-5 py-5">          
          <h1 className="[writing-mode:vertical-lr] text-secondary text-xl font-bold">WHATHEFOOD.</h1>
        </Link>
      <nav className="flex flex-col justify-center items-center gap-8 py-5">
        
        <NavButton onClick={() => onNavClick('dashboard')} icon={<HomeIcon />} label="Dashboard" expanded={isExpanded} />
        <NavButton onClick={() => onNavClick('users')} icon={<UsersIcon />} label="Usuarios" expanded={isExpanded} />
        <NavButton onClick={() => onNavClick('recipes')} icon={<RecipesIcon />} label="Recetas" expanded={isExpanded} />
        <NavButton onClick={() => onNavClick('menus')} icon={<MenusIcon />} label="Menús" expanded={isExpanded} />
        <NavButton onClick={() => onNavClick('tasks')} icon={<TasksIcon />} label="Tareas" expanded={isExpanded} />
      </nav>
      <nav className="flex flex-col items-center gap-4 px-2 py-5 w-full">
        <div className="flex items-center gap-2">
          <div className="bg-secondary rounded-lg p-1 justify-between">
            <ModeToggle/>
          </div>
          {isExpanded && (
            <Button
              onClick={() => signOut()}
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
}

function NavButton({ onClick, icon, label, expanded }: NavButtonProps) {
  return (
    <button 
      onClick={onClick} 
      className={`flex transition duration-150 ease-in-out items-center justify-center rounded-lg text-secondary hover:justify-start text-secondary  w-full ${expanded ? 'px-3 py-2' : 'h-9 w-9 md:h-8 md:w-8'}`}
    >
      {icon}
      {expanded && <span className="ml-3 text-sm">{label}</span>}
      {!expanded && <span className="sr-only">{label}</span>}
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

function MenusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
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

// Definir los demás iconos de manera similar...