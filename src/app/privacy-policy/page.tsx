'use client';
import React from 'react';
import MainNavbar from '@/components/main_navbar';
import { Shield } from 'lucide-react';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function PrivacyPolicyPage() {
  const policies = [
    {
      title: "1. Introducción",
      content: "WHATHEFOOD respeta tu privacidad y se compromete a proteger tus datos personales. Esta política de privacidad te informará sobre cómo cuidamos tus datos personales cuando visitas nuestra web y te informará sobre tus derechos de privacidad y cómo la ley te protege."
    },
    {
      title: "2. Menores de 16 años",
      content: "Nuestra web no está destinada a menores de 16 años y no recopilamos datos de menores de forma consciente. Si eres menor de 16 años, no utilices ni proporciones ninguna información en esta web. Si descubrimos que hemos recopilado datos de un menor de 16 años, eliminaremos dicha información inmediatamente."
    },
    {
      title: "3. Información que recopilamos",
      content: `Recopilamos varios tipos de información, incluyendo:
        • Información de identificación personal (nombre, email, etc.)
        • Información sobre tus recetas y contribuciones
        • Información técnica sobre tu dispositivo y conexión
        • Información sobre tu uso de la plataforma
        • Preferencias y configuraciones de usuario`
    },
    {
      title: "4. Uso de la información",
      content: `Utilizamos tu información para:
        • Proporcionar y mantener nuestros servicios
        • Mejorar y personalizar tu experiencia
        • Comunicarnos contigo sobre actualizaciones o cambios
        • Proteger la seguridad de la plataforma
        • Cumplir con obligaciones legales`
    },
    {
      title: "5. Compartir información",
      content: `No vendemos ni compartimos tu información personal con terceros, excepto cuando:
        • Das tu consentimiento explícito
        • Es necesario para proporcionar el servicio
        • Lo requiere la ley
        • Es necesario para proteger nuestros derechos`
    },
    {
      title: "6. Seguridad de datos",
      content: "Implementamos medidas de seguridad apropiadas para proteger tus datos contra pérdida, acceso no autorizado, divulgación o alteración. Estas medidas incluyen encriptación, firewalls y protocolos de seguridad actualizados."
    },
    {
      title: "7. Tus derechos",
      content: `Tienes derecho a:
        • Acceder a tus datos personales
        • Corregir datos inexactos
        • Solicitar la eliminación de tus datos
        • Oponerte al procesamiento de tus datos
        • Retirar tu consentimiento en cualquier momento`
    },
    {
      title: "8. Contacto",
      content: `Para cualquier pregunta sobre esta política de privacidad o sobre tus datos personales, puedes contactarnos en:
        • Email: privacy@whathefood.es
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
          alt="Privacy Policy Hero"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative z-10 container mx-auto h-full flex items-center justify-center text-center p-8">
          <div>
            <h1 className="text-6xl font-bold text-secondary mb-6">
              Política de Privacidad
            </h1>
            <p className="text-xl text-secondary/90 max-w-2xl mx-auto">
              Tu privacidad es importante para nosotros
            </p>
          </div>
        </div>
      </section>

      {/* Contenido de la Política de Privacidad */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-8 max-w-4xl">
          <div className="bg-card rounded-lg p-8 shadow-lg">
            <Accordion type="single" collapsible className="w-full">
              {policies.map((policy, index) => (
                <AccordionItem key={`policy-${index}`} value={`policy-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary" />
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