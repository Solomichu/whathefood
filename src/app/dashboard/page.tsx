"use client"

import { Suspense } from 'react'
import UserNavbar from '@/components/user-navbar'
import React, { ReactNode, useState } from 'react'
import AdmindashTasktable from '@/components/admindash_tasktable'
import Default from './default'
import MyRecipes from './my-recipes'
import Favourites from './favourites'

function DashboardContent() {
  const [currentPage, setCurrentPage] = useState<ReactNode>(<Default />)

  const handleNavClick = (page: string) => {
    document.body.style.removeProperty('pointer-events');
    
    switch (page) {
      default:
        setCurrentPage(<Default />)
        break

      case 'default':
        setCurrentPage(<Default />)
        break
      case 'favorites':
        setCurrentPage(<Favourites />)
        break
      case 'my-recipes':
        setCurrentPage(<MyRecipes />)
        break
      case 'my-menus':
        setCurrentPage(<AdmindashTasktable />)
        break
      case 'my-tasks':
        setCurrentPage(<AdmindashTasktable />)
        break
    }
  }

  return (
    <main className="flex flex-row bg-secondary">
      <UserNavbar onNavClick={handleNavClick} />
      <main className="w-full p-10">
        {currentPage}        
      </main>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}

