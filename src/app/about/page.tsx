'use client';
import React from 'react';
import MainNavbar from '@/components/main_navbar';
import { ChefHat, Users, Utensils, Heart } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <MainNavbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-black">
        <Image
          src="/images/static/dishes/cabonara02.jpg"
          alt="About Hero"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative z-10 container mx-auto h-full flex items-center justify-center text-center p-8">
          <div>
            <h1 className="text-6xl font-bold text-secondary mb-6">
              Sobre WHATHEFOOD
            </h1>
            <p className="text-xl text-secondary/90 max-w-2xl mx-auto">
              Una plataforma dedicada a unir personas a través del amor por la cocina
            </p>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Nuestra Misión</h2>
              <p className="text-gray-600 leading-relaxed">
                Crear una comunidad global de amantes de la cocina donde cada persona
                pueda compartir sus recetas, aprender de otros y descubrir nuevas
                experiencias culinarias. Nos esforzamos por hacer que la cocina sea
                accesible y divertida para todos.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Nuestra Visión</h2>
              <p className="text-gray-600 leading-relaxed">
                Ser la plataforma líder mundial en compartir recetas y experiencias
                culinarias, fomentando la conexión entre personas a través de la
                pasión por la cocina y la buena comida.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Pasión</h3>
              <p className="text-gray-600">
                Amamos lo que hacemos y lo transmitimos en cada aspecto
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                <ChefHat className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Calidad</h3>
              <p className="text-gray-600">
                Nos aseguramos de que cada receta cumpla altos estándares
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Comunidad</h3>
              <p className="text-gray-600">
                Fomentamos un ambiente inclusivo y colaborativo
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                <Utensils className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Innovación</h3>
              <p className="text-gray-600">
                Buscamos constantemente nuevas formas de mejorar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="bg-green-900 text-secondary py-8">
        <div className="container mx-auto px-8 text-center">
          <p>&copy; 2024 WHATHEFOOD. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
