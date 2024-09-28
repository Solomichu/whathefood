"use client"
import AdminNavbar from '@/components/admin-navbar'
import React, { ReactNode, useState } from 'react'

// Importa los componentes de las páginas que crearás en el futuro
import FuturePage1 from './usertable'
import FuturePage2 from './foodtable'
import { PageProps } from '../../../../.next/types/app/layout'
// ... importa más páginas según sea necesario

export default function Page({ children }: PageProps) {
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


