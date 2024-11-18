'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Heart, Search } from 'lucide-react'
import { Tabs, TabsContent } from "@/components/ui/tabs"
import Link from 'next/link';

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
  const searchParams = useSearchParams()
  const [dishes, setDishes] = useState<Dish[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [favouriteDishes, setFavouriteDishes] = useState<string[]>([]);

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

  useEffect(() => {
    const fetchFavourites = async () => {
      if (!session) return;

      try {
        const response = await fetch(`/api/dishes?userId=${session.user.id}`);
        if (!response.ok) throw new Error('Error al obtener los platos favoritos');
        const data = await response.json();
        setFavouriteDishes(data.dishes.map((dish: Dish) => dish.id));
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchFavourites();
  }, [session]);

  useEffect(() => {
    const filtered = dishes.filter(dish => {
      const searchLower = searchTerm.toLowerCase();
      return dish.name?.toLowerCase().includes(searchLower) ||
             dish.instructions?.toLowerCase().includes(searchLower) ||
             dish.creatorUsername?.toLowerCase().includes(searchLower);
    });
    setFilteredDishes(filtered);
  }, [searchTerm, dishes]);

  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  const handleAddToFavorites = async (dishId: string) => {
    if (!session) {
      alert('Debes iniciar sesión para agregar platos a favoritos.');
      return;
    }

    const action = favouriteDishes.includes(dishId) ? 'remove' : 'add';

    try {
      const response = await fetch(`/api/dishes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dishId: dishId,
          userId: session.user.id,
          action: action,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al modificar favoritos');
      }

      const message = action === 'add' ? 'Plato agregado a favoritos' : 'Plato eliminado de favoritos';
      alert(message);
      setFavouriteDishes(prev => action === 'add' ? [...prev, dishId] : prev.filter(id => id !== dishId));
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo modificar el plato en favoritos');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="relative w-full max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Buscar por nombre de plato, descripción o creador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md bg-background text-foreground"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => (
              <Link href={`/dishes/${dish.id}`} key={dish.id} className="block transition-transform hover:scale-105">
                <Card className="overflow-hidden cursor-pointer">
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
                      <Button 
                        variant={favouriteDishes.includes(dish.id) ? "filled" : "ghost"} 
                        size="icon" 
                        onClick={(e) => { e.preventDefault(); handleAddToFavorites(dish.id); }}
                      >
                        <Heart className={`h-4 w-4 ${favouriteDishes.includes(dish.id) ? 'text-red-500' : ''}`} />
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
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}