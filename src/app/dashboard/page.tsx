"use client"

import UserNavbar from '@/components/user-navbar'
import React, { ReactNode, useState } from 'react'
import Usertable from '@/components/admindash_usertable'
import AdmindashDishtableV2 from '@/components/admindash_dishtableV2'
import AdmindashTasktable from '@/components/admindash_tasktable'
import Default from './default'
import MyRecipes from './my-recipes'
import Favourites from './favourites'

export default function Page({ children }: { children: ReactNode }) {
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
        {children}
      </main>
    </main>
  )
}

