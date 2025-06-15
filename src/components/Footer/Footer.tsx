import React from "react";
import Link from "next/link";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  BookOpen,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const enlaces = [
    {
      title: "Gestión",
      items: [
        { label: "Operarios", href: "/operarios", icon: <Users className="h-4 w-4" /> },
        { label: "Recibos", href: "/form", icon: <FileText className="h-4 w-4" /> },
        { label: "Reportes", href: "/reportes", icon: <TrendingUp className="h-4 w-4" /> },
      ],
    },
    {
      title: "Recursos",
      items: [
        { label: "Leyes Laborales", href: "/leyeslaborales", icon: <BookOpen className="h-4 w-4" /> },
        { label: "Acerca de", href: "/acercade", icon: <FileText className="h-4 w-4" /> },
      ],
    },
    {
      title: "Contacto",
      items: [
        { label: "soporte@recibo.com", href: "mailto:soporte@recibo.com", icon: <Mail className="h-4 w-4" /> },
        { label: "+54 (11) 1234-5678", href: "tel:+541112345678", icon: <Phone className="h-4 w-4" /> },
        { label: "Buenos Aires, Argentina", href: "#", icon: <MapPin className="h-4 w-4" /> },
      ],
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="py-8 sm:py-12 lg:py-16">
          {/* Contenedor principal */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Columna izquierda: Logo y redes sociales */}
            <div className="lg:w-1/4">
              <div className="flex items-center justify-between px-4 sm:mb-6">
                <Link href="/" className="block w-50 sm:w-60 hover:opacity-85 transition-opacity">
                  <Image
                    src="/Img/sippalogo.webp"
                    alt="Logo"
                    width={150}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </Link>
                {/* Redes sociales en móvil junto al logo */}
                <div className="flex flex-col gap-7 lg:hidden">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    asChild
                  >
                    <Link href="https://github.com" target="_blank">
                      <Github className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    asChild
                  >
                    <Link href="https://linkedin.com" target="_blank">
                      <Linkedin className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              {/* Descripción solo visible en desktop */}
              <p className="hidden lg:block text-sm leading-relaxed text-gray-600 mb-6">
                Sistema integral para la gestión de personal y generación de recibos de sueldo.
              </p>
              {/* Redes sociales en desktop */}
              <div className="hidden lg:flex space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  asChild
                >
                  <Link href="https://github.com" target="_blank">
                    <Github className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  asChild
                >
                  <Link href="https://linkedin.com" target="_blank">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Enlaces con fondo degradado */}
            <div className="lg:w-3/4 bg-gradient-to-br from-blue-50 via-blue-50/50 to-transparent rounded-xl p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
                {enlaces.map((seccion) => (
                  <div key={seccion.title} className="relative">
                    <h3 className="text-xs sm:text-sm font-bold text-blue-950 mb-3 sm:mb-4 uppercase tracking-wider">
                      {seccion.title}
                    </h3>
                    <ul className="space-y-2.5 sm:space-y-3">
                      {seccion.items.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 flex items-center gap-2 transition-colors duration-200"
                          >
                            {item.icon}
                            <span className="break-words">{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer inferior */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-center items-center">
              <p className="text-xs sm:text-sm text-gray-500">
                © {currentYear} SIPPA. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 