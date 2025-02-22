'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import MainNavbar from '@/components/main_navbar';

interface Dish {
  id: string;
  name: string;
  instructions: string | null;
  prepTime: string | null;
  status: string;
  image: string | null;
  creatorUsername: string;
  creatorImage: string;
  createdById: string;
}

export default function DishPage() {
  const { id } = useParams();
  const [dish, setDish] = useState<Dish | null>(null);
  const [relatedDishes, setRelatedDishes] = useState<Dish[]>([]);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const response = await fetch(`/api/dishes?id=${id}`);
        if (response.ok) {
          const dishData = await response.json();
          setDish({
            ...dishData,
            creatorUsername: dishData.creatorUsername || 'Usuario desconocido',
            creatorImage: dishData.creatorImage || '/placeholder.jpg'
          });
          fetchRelatedDishes();
        } else {
          console.error('Error al obtener los datos del plato');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchRelatedDishes = async () => {
      try {
        const response = await fetch(`/api/dishes?status=APPROVED`);
        if (response.ok) {
          const data = await response.json();
          const availableDishes = data.dishes.filter((d: Dish) => 
            d.id !== id && d.status === 'APPROVED'
          );
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const randomDishes: any[] | ((prevState: Dish[]) => Dish[]) = [];
          const maxDishes = Math.min(3, availableDishes.length);
          
          while (randomDishes.length < maxDishes) {
            const randomIndex = Math.floor(Math.random() * availableDishes.length);
            const randomDish = availableDishes[randomIndex];
            
            if (!randomDishes.some(dish => dish.id === randomDish.id)) {
              randomDishes.push(randomDish);
            }
          }
          
          setRelatedDishes(randomDishes);
        } else {
          console.error('Error al obtener platos relacionados');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (id) {
      fetchDish();
    }
  }, [id]);

  if (!dish) {
    return <div>Cargando...</div>;
  }

  return (
    <main className="flex flex-col min-h-screen  bg-gray-100">
      <MainNavbar />
      <div className="w-full h-64 bg-cover bg-center" style={{backgroundImage: `url(${dish.image || '/placeholder.jpg'})`}}></div>
      <div className="container mx-auto px-4 h-m">
        <div className="bg-white rounded-lg shadow-lg -mt-16 p-6 mb-8 max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">{dish.name}</h1>
              <p className="text-gray-500">{dish.prepTime}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={dish.creatorImage} alt={dish.creatorUsername} />
                <AvatarFallback>{(dish.creatorUsername || 'U').charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{dish.creatorUsername}</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Descripción</h2>
          <p className="mb-8">{dish.instructions || 'No hay instrucciones disponibles'}</p>
          
          <h2 className="text-2xl font-bold mb-4">Igual le interesa</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedDishes.map((relatedDish) => (
              <Link 
                href={`/dishes/${relatedDish.id}`} 
                key={relatedDish.id}
                className="block transition-transform hover:scale-105"
              >
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div 
                    className="h-40 bg-cover bg-center" 
                    style={{backgroundImage: `url(${relatedDish.image || '/placeholder.jpg'})`}}
                  ></div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{relatedDish.name}</h3>
                    <p className="text-sm text-gray-500 mb-2 truncate">
                      {relatedDish.instructions}
                    </p>
                    <div className="flex justify-between items-center">
                      <Button variant="default" size="sm">Ver plato</Button>
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage 
                            src={relatedDish.creatorImage} 
                            alt={relatedDish.creatorUsername} 
                          />
                          <AvatarFallback>
                            {(relatedDish.creatorUsername || 'U').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {relatedDish.creatorUsername}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}