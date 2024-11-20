'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Eye, Heart } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from '@/components/ui/separator'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Dish {
  id: string;
  image: string | null;
  name: string;
  instructions: string | null;
  prepTime: string | null;
  status: string;
  creatorUsername: string;
  creatorImage: string;
}

export default function Favourites() {
  const { data: session } = useSession();
  const router = useRouter();
  const [dishes, setDishes] = useState<Dish[]>([]);

  useEffect(() => {
    const fetchFavoriteDishes = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/dishes/favorites?userId=${session.user.id}`);
        if (!response.ok) {
          throw new Error('Error al obtener los platos favoritos');
        }
        const data = await response.json();
        setDishes(data.dishes);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchFavoriteDishes();
  }, [session?.user?.id]);

  const handleView = (id: string) => {
    router.push(`/dishes/${id}`);
  };

  const handleRemoveFavorite = async (dishId: string) => {
    try {
      const response = await fetch('/api/dishes/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          dishId: dishId,
          action: 'remove'
        }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar de favoritos');
      }

      setDishes(prevDishes => prevDishes.filter(dish => dish.id !== dishId));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mis Favoritos</h1>
      </div>
      <Separator className='mb-10' />

      {dishes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Aún no has guardado ningún plato como favorito</p>
          <Button onClick={() => router.push('/dishes')}>Explorar Platos</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dishes.map((dish) => (
            <Card key={dish.id} className="flex flex-col">
              <CardHeader className="p-0">
                <div className="relative h-40 w-full bg-green-600">
                  {dish.image ? (
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      Sin imagen
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-1">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold truncate">{dish.name}</CardTitle>
                      <p className="text-sm text-gray-500 line-clamp-2">{dish.instructions}</p>
                    </div>
                    <Badge variant="secondary" className="ml-2 whitespace-nowrap">
                      {dish.prepTime}'
                    </Badge>
                  </div>
                  <div className="mt-auto">
                    <div className="flex justify-between items-center mt-4">
                      <Badge variant="outline" className={
                        dish.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        dish.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {dish.status}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={dish.creatorImage} alt={dish.creatorUsername} />
                          <AvatarFallback>{dish.creatorUsername.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate max-w-[100px]">{dish.creatorUsername}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(dish.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Ver</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRemoveFavorite(dish.id)} 
                              className='bg-red-500 text-white hover:!bg-red-700 hover:!text-white'>
                              <Heart className="mr-2 h-4 w-4" />
                              <span>Eliminar de favoritos</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}