'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import MainNavbar from '@/components/main_navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, Star, ChefHat, Users, Utensils, Search, ArrowRight, Instagram, Twitter, Facebook } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Dish {
  id: string;
  name: string;
  image: string | null;
  instructions: string | null;
  prepTime: string | null;
  status: string;
  creatorUsername: string;
}

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredDishes, setFeaturedDishes] = useState<Dish[]>([]);
  
  useEffect(() => {
    const fetchFeaturedDishes = async () => {
      try {
        const response = await fetch('/api/dishes?status=APPROVED');
        if (!response.ok) throw new Error('Error al obtener los platos');
        const data = await response.json();
        setFeaturedDishes(data.dishes.slice(0, 6));
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchFeaturedDishes();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (session) {
      // Redirigir a dashboard con el término de búsqueda como parámetro
      router.push(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
    } else {
      // Redirigir al login
      router.push('/login');
    }
  };

  return (
    <main className="min-h-screen">
      <MainNavbar />
      
      {/* Hero Section con Buscador */}
      <section className="relative h-[90vh] bg-black bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: 'url("/images/static/dishes/cabonara04.jpg")',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-0" />

        <div className="relative z-10 container mx-auto h-full flex items-center p-20">
          <div className="max-w-3xl">
            <h1 className="text-7xl font-bold text-secondary mb-6">
              Descubre el arte de la <span className="text-primary">cocina</span>
            </h1>
            <p className="text-xl text-secondary/80 mb-8">
              Explora recetas únicas creadas por chefs apasionados y comparte tus propias creaciones culinarias.
            </p>
            <form onSubmit={handleSearch} className="flex gap-4 mb-8">
              <div className="flex-1 relative">
                <Input 
                  placeholder="Buscar recetas..." 
                  className="w-full h-14 pl-12 pr-4 rounded-lg bg-secondary/90"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
              <Button type="submit" size="lg" className="h-14 bg-primary hover:bg-primary/90 text-black px-8">
                Buscar
              </Button>
            </form>
            <div className="flex gap-8 text-secondary/80">
              <div className="flex items-center gap-2">
                <ChefHat className="h-6 w-6" />
                <span>1000+ Chefs</span>
              </div>
              <div className="flex items-center gap-2">
                <Utensils className="h-6 w-6" />
                <span>5000+ Recetas</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                <span>10000+ Usuarios</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Populares */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Categorías Populares</h2>
          <p className="text-gray-600 text-center mb-12">Explora nuestras categorías más populares</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {['Desayunos', 'Comidas', 'Cenas', 'Postres'].map((category) => (
              <Card key={category} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                    <Utensils className="h-10 w-10 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{category}</h3>
                  <p className="text-gray-600">20+ recetas</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platos Destacados */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Platos Destacados</h2>
              <p className="text-gray-600">Las mejores recetas de nuestra comunidad</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              Ver Todos <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDishes.map((dish) => (
              <div key={dish.id} className="group relative overflow-hidden rounded-xl">
                <div className="relative h-[300px] w-full">
                  <Image
                    src={dish.image || '/images/static/default-dish.jpg'}
                    alt={dish.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-semibold text-secondary mb-2">{dish.name}</h3>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {dish.prepTime} min
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      4.5
                    </Badge>
                  </div>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-4 right-4 bg-secondary/10 hover:bg-secondary/20 text-secondary"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                <ChefHat className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Chefs Profesionales</h3>
              <p className="text-gray-600">Aprende de los mejores chefs y sus técnicas culinarias</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Comunidad Activa</h3>
              <p className="text-gray-600">Comparte tus recetas y aprende de otros apasionados</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                <Utensils className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Recetas Verificadas</h3>
              <p className="text-gray-600">Todas nuestras recetas son probadas y verificadas</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-black text-secondary">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/static/cta-bg.jpg"
            alt="CTA background"
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">¿Listo para compartir tus recetas?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad y comparte tus creaciones culinarias con el mundo
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-black px-8">
            Empezar Ahora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-secondary py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Sobre Nosotros</h3>
              <p className="text-gray-400">
                Plataforma líder en compartir recetas y experiencias culinarias
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Inicio</li>
                <li>Explorar Recetas</li>
                <li>Categorías</li>
                <li>Chefs</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>info@tucocina.com</li>
                <li>+34 123 456 789</li>
                <li>Madrid, España</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Síguenos</h3>
              <div className="flex gap-4">
                <Instagram className="h-6 w-6" />
                <Twitter className="h-6 w-6" />
                <Facebook className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TuCocina. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

