"use client"

import AdminNavbar from '@/components/admin-navbar'
import React, { ReactNode, useState } from 'react'

// Importa los componentes de las páginas que crearás en el futuro
import Usertable from '@/components/admindash_usertable'
import AdmindashDishtableV2 from '@/components/admindash_dishtableV2'
import AdmindashTasktable from '@/components/admindash_tasktable'
// ... importa más páginas según sea necesario

// @ts-expect-error: Ignorando error de tipo en la exportación de Page para Next.js App Router
console.log(123)
export default function Page({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<ReactNode>()

  const handleNavClick = (page: string) => {
    switch (page) {
      case 'users':
        setCurrentPage(<Usertable />)
        break
      case 'recipes':
        setCurrentPage(<AdmindashDishtableV2 />)
        break
      case 'tasks':
        setCurrentPage(<AdmindashTasktable />)
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


