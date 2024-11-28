"use client"

import AdminNavbar from '@/components/admin-navbar'
import React, { ReactNode, useState } from 'react'
import Usertable from '@/components/admindash_usertable'
import AdmindashDishtableV2 from '@/components/admindash_dishtableV2'
import AdmindashTasktable from '@/components/admindash_tasktable'
import DashboardDefault from '@/components/admindash-default'
import MyRecipes from '@/app/dashboard/my-recipes'
import Favourites from '@/app/dashboard/favourites'

export default function Page({ children }: { children: ReactNode }) {
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [currentPage, setCurrentPage] = useState<ReactNode>(
    <DashboardDefault onViewChange={handleViewChange} />
  )

  function handleViewChange(view: string) {
    handleNavClick(view);
  }

  const handleNavClick = (page: string) => {
    setActiveNavItem(page);
    document.body.style.removeProperty('pointer-events');
    
    switch (page) {
      case 'dashboard':
        setCurrentPage(<DashboardDefault onViewChange={handleViewChange} />)
        break
      case 'users':
        setCurrentPage(<Usertable />)
        break
      case 'recipes':
        setCurrentPage(<AdmindashDishtableV2 />)
        break
      case 'tasks':
        setCurrentPage(<AdmindashTasktable />)
        break
      case 'my-recipes':
        setCurrentPage(<MyRecipes />)
        break
      case 'favourites':
        setCurrentPage(<Favourites />)
        break
      default:
        setCurrentPage(<DashboardDefault onViewChange={handleViewChange} />)
    }
  }

  return (
    <main className="flex flex-row bg-secondary">
      <AdminNavbar onNavClick={handleNavClick} activePage={activeNavItem} />
      <main className="w-full p-10 ml-14">
        {currentPage}
        {children}
      </main>
    </main>
  )
}


