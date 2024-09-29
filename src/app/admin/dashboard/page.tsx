"use client"

import AdminNavbar from '@/components/admin-navbar'
import React, { ReactNode, useState } from 'react'

// Importa los componentes de las páginas que crearás en el futuro
import FuturePage1 from './usertable'
import FuturePage2 from './foodtable'
// ... importa más páginas según sea necesario

// @ts-expect-error: Ignorando error de tipo en la exportación de Page para Next.js App Router
expectsString(123);
export default function Page({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<ReactNode>(<FuturePage1 />)

  const handleNavClick = (page: string) => {
    switch (page) {
      case 'users':
        setCurrentPage(<FuturePage1 />)
        break
      case 'dashboard':
        setCurrentPage(<FuturePage2 />)
        break
      // ... agrega más casos según sea necesario
    }
  }

  return (
    <main className="flex flex-row">
      <AdminNavbar onNavClick={handleNavClick} />
      <main className="w-full p-10">
        {currentPage}
        {children} {/* Renderiza children si es necesario */}
      </main>
    </main>
  );
}


