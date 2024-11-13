"use client"

import AdminNavbar from '@/components/admin-navbar'
import React, { ReactNode, useState } from 'react'
import Usertable from '@/components/admindash_usertable'
import AdmindashDishtableV2 from '@/components/admindash_dishtableV2'
import AdmindashTasktable from '@/components/admindash_tasktable'
import DashboardDefault from '@/components/admindash-default' 

export default function Page({ children }: { children: ReactNode }) {
  const [activeNavItem, setActiveNavItem] = useState('dashboard');

  const handleViewChange = (view: string) => {
    switch (view) {
      case 'recipes':
        setCurrentPage(<AdmindashDishtableV2 />)
        setActiveNavItem('recipes')
        break
      case 'users':
        setCurrentPage(<Usertable />)
        setActiveNavItem('users')
        break
      default:
        setCurrentPage(<DashboardDefault onViewChange={handleViewChange} />)
        setActiveNavItem('dashboard')
    }
  }

  const [currentPage, setCurrentPage] = useState<ReactNode>(
    <DashboardDefault onViewChange={handleViewChange} />
  )

  const handleNavClick = (page: string) => {
    setActiveNavItem(page);
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
      default:
        setCurrentPage(<DashboardDefault onViewChange={handleViewChange} />)
    }
  }

  return (
    <main className="flex flex-row">
      <AdminNavbar onNavClick={handleNavClick} activePage={activeNavItem} />
      <main className="w-full p-10">
        {currentPage}
        {children}
      </main>
    </main>
  )
}


