'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserNavbar from '@/components/user-navbar'
import { SidebarProvider } from '@/components/ui/sidebar'

interface Dish {
  id: string
  name: string
  instructions: string
  prepTime: string
  image: string | null
  status: string
  creatorUsername: string
  creatorImage: string
}

export default function Default() {
  const { data: session } = useSession()
  const [dishes, setDishes] = useState<Dish[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch('/api/dishes')
        if (!response.ok) throw new Error('Error al obtener los platos')
        const data = await response.json()
        setDishes(data.dishes.filter((dish: Dish) => dish.status === 'APPROVED'))
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchDishes()
  }, [])

  return (
    <div className="container mx-auto p-8">
        
      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="all">Todas las recetas</TabsTrigger>
            <TabsTrigger value="popular">Populares</TabsTrigger>
            <TabsTrigger value="new">Nuevas</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishes.map((dish) => (
              <Card key={dish.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  {dish.image ? (
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-muted">
                      Sin imagen
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{dish.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {dish.instructions}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={dish.creatorImage} />
                        <AvatarFallback>{dish.creatorUsername[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{dish.creatorUsername}</span>
                    </div>
                    <Badge variant="secondary">{dish.prepTime} min</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}