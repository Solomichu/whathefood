'use client';
import React from 'react';
import MainNavbar from '@/components/main_navbar';
import { Cookie } from 'lucide-react';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function CookiesPolicyPage() {
  const policies = [
    {
      title: "1. ¿Qué son las cookies?",
      content: "Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo cuando los visitas. En WHATHEFOOD las utilizamos para mejorar tu experiencia de navegación y ofrecerte un servicio más personalizado."
    },
    
    {
      title: "2. Tipos de cookies que utilizamos",
      content: `En WHATHEFOOD utilizamos diferentes tipos de cookies:
        • Cookies técnicas: Necesarias para el funcionamiento del sitio
        • Cookies de preferencias: Guardan tus preferencias de navegación
        • Cookies analíticas: Nos ayudan a entender cómo usas el sitio
        • Cookies de sesión: Mantienen tu sesión activa mientras navegas
        • Cookies de publicidad: Personalizan los anuncios que ves`
    },
    {
      title: "3. Gestión de cookies",
      content: "Puedes gestionar las cookies a través de la configuración de tu navegador. Puedes permitir, bloquear o eliminar las cookies instaladas en tu dispositivo. Ten en cuenta que desactivar ciertas cookies puede afectar al funcionamiento correcto de algunas funciones de la web."
    },
    {
      title: "4. Cookies de terceros",
      content: `Algunos servicios de terceros que utilizamos pueden instalar cookies:
        • Google Analytics: Análisis de uso del sitio
        • Redes sociales: Botones de compartir y contenido
        • Servicios de publicidad: Anuncios personalizados
        • Servicios de pago: Procesamiento de transacciones`
    },
    {
      title: "5. Duración de las cookies",
      content: `Según su duración, nuestras cookies pueden ser:
        • Cookies de sesión: Se eliminan al cerrar el navegador
        • Cookies persistentes: Permanecen por un tiempo determinado
        • Cookies de análisis: Duración máxima de 2 años
        • Cookies técnicas: Varían según su función específica`
    },
    {
      title: "6. Actualizaciones de la política",
      content: "Esta política de cookies puede actualizarse en cualquier momento para adaptarse a cambios en la legislación o en nuestros servicios. Te recomendamos revisarla periódicamente."
    },
    {
      title: "7. Tus derechos",
      content: `Respecto al uso de cookies, tienes derecho a:
        • Ser informado sobre su uso
        • Aceptar o rechazar su instalación
        • Configurar tus preferencias
        • Retirar tu consentimiento en cualquier momento`
    },
    {
      title: "8. Contacto",
      content: `Para cualquier consulta sobre nuestra política de cookies:
        • Email: cookies@whathefood.es
        • Teléfono: +34 999 999 999
        • Dirección: Madrid, España`
    }
  ];

  return (
    <main className="min-h-screen">
      <MainNavbar />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] bg-black">
        <Image
          src="/images/static/dishes/burguer01.jpg"
          alt="Cookies Policy Hero"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative z-10 container mx-auto h-full flex items-center justify-center text-center p-8">
          <div>
            <h1 className="text-6xl font-bold text-secondary mb-6">
              Política de Cookies
            </h1>
            <p className="text-xl text-secondary/90 max-w-2xl mx-auto">
              Información sobre el uso de cookies en WHATHEFOOD
            </p>
          </div>
        </div>
      </section>

      {/* Contenido de la Política de Cookies */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-8 max-w-4xl">
          <div className="bg-card rounded-lg p-8 shadow-lg">
            <Accordion type="single" collapsible className="w-full">
              {policies.map((policy, index) => (
                <AccordionItem key={`policy-${index}`} value={`policy-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-3">
                      <Cookie className="h-5 w-5 text-primary" />
                      {policy.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-base whitespace-pre-line">
                    {policy.content}
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

