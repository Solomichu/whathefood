'use client';
import React from 'react';
import MainNavbar from '@/components/main_navbar';
import { HelpCircle } from 'lucide-react';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      question: "¿Cómo puedo empezar a compartir mis recetas?",
      answer: "Para compartir tus recetas, primero debes registrarte en la plataforma. Una vez iniciada sesión, ve a tu dashboard y haz clic en 'Mis Recetas'. Allí encontrarás un botón para crear una nueva receta."
    },
    {
      question: "¿Qué tipo de recetas puedo compartir?",
      answer: "Puedes compartir cualquier tipo de receta culinaria, desde platos tradicionales hasta creaciones innovadoras. Solo asegúrate de que las instrucciones sean claras y proporciones los ingredientes necesarios."
    },
    {
      question: "¿Cómo se verifican las recetas?",
      answer: "Todas las recetas pasan por un proceso de revisión por nuestro equipo de moderadores para asegurar la calidad y precisión de la información. Este proceso puede tomar entre 24-48 horas."
    },
    {
      question: "¿Puedo editar mis recetas después de publicarlas?",
      answer: "Sí, puedes editar tus recetas en cualquier momento desde la sección 'Mis Recetas' en tu dashboard. Sin embargo, los cambios significativos pueden requerir una nueva revisión."
    },
    {
      question: "¿Cómo funciona el sistema de favoritos?",
      answer: "Puedes marcar cualquier receta como favorita haciendo clic en el icono de corazón. Encontrarás todas tus recetas favoritas en la sección 'Favoritos' de tu dashboard."
    },
    {
      question: "¿Puedo compartir las recetas en redes sociales?",
      answer: "Sí, cada receta tiene botones de compartir para las principales redes sociales. Además, puedes copiar el enlace directo a la receta para compartirla donde quieras."
    }
  ];

  return (
    <main className="min-h-screen">
      <MainNavbar />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] bg-black">
        <Image
          src="/images/static/dishes/oats02.jpg"
          alt="FAQ Hero"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative z-10 container mx-auto h-full flex items-center justify-center text-center p-8">
          <div>
            <h1 className="text-6xl font-bold text-secondary mb-6">
              Preguntas Frecuentes
            </h1>
            <p className="text-xl text-secondary/90 max-w-2xl mx-auto">
              Encuentra respuestas a las preguntas más comunes sobre WHATHEFOOD
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary">
        h2
        <div className="container mx-auto px-8 max-w-3xl">
          <div className="bg-card rounded-lg p-6 shadow-lg">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      {faq.question}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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