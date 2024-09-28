import Link from "next/link";
import React from 'react'
import { ModeToggle } from './theme-toggle-button'

interface AdminNavbarProps {
  onNavClick: (page: string) => void
}

export default function AdminNavbar({ onNavClick }: AdminNavbarProps) {
  return (
    <aside className="inset-y-0 left-0 z-10 w-14 flex-col border-r border-primary hidden sm:flex justify-between h-[100vh]">
      <nav className="flex flex-col items-center gap-4 px-2 py-5">
        <Link href="/" className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
          <svg className="h-3 w-3 transition-all group-hover:scale-110" aria-label="Logo" height="64" role="img" viewBox="0 0 74 64">
            <path d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z" fill="currentColor"></path>
          </svg>
          <span className="sr-only">WHATHEFOOD</span>
        </Link>
        <button onClick={() => onNavClick('dashboard')} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className="sr-only">Dashboard</span>
        </button>
        <button onClick={() => onNavClick('users')} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span className="sr-only">Usuarios</span>
        </button>
        <button onClick={() => onNavClick('recipes')} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span className="sr-only">Recipes</span>
        </button>
        <button onClick={() => onNavClick('menus')} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M3 3h18v18H3zM12 8v8m-4-4h8"></path>
          </svg>
          <span className="sr-only">Menus</span>
        </button>
        <button onClick={() => onNavClick('tasks')} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          <span className="sr-only">Tasks</span>
        </button>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
        <ModeToggle />
      </nav>
    </aside>
  )
}