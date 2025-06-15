"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Receipt,
  FileText,
  BookOpen,
  TrendingUp,
  Info,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ListaOperariosRecibos from "@/components/ListaOperariosRecibos/ListaOperariosRecibos";
import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Home() {
  const router = useRouter();
  const [mostrarListaOperarios, setMostrarListaOperarios] = useState(false);

  const features = [
    {
      title: "Gestión de Operarios",
      description: "Administra la información personal y laboral de tus empleados de manera eficiente.",
      icon: <Users className="w-12 h-12 text-blue-500" />,
      link: "/operarios",
      stats: "30+ Operarios",
    },
    {
      title: "Recibos de Sueldo",
      description: "Genera y gestiona recibos de sueldo de forma rápida y segura.",
      icon: <DollarSign className="w-12 h-12 text-green-500" />,
      link: "/form",
      stats: "100+ Recibos",
      className: "hover:border-green-200",
      iconBg: "bg-green-50",
    },
    {
      title: "Leyes Laborales",
      description: "Accede a información actualizada sobre normativas y regulaciones laborales.",
      icon: <BookOpen className="w-12 h-12 text-purple-500" />,
      link: "/leyeslaborales",
      stats: "Actualizado 2024",
    },
    {
      title: "Reportes y Análisis",
      description: "Visualiza estadísticas y genera informes detallados del personal.",
      icon: <TrendingUp className="w-12 h-12 text-orange-500" />,
      link: "/reportes",
      stats: "Datos en tiempo real",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <motion.div initial="initial" animate="animate" variants={fadeIn}>
        {/* Hero Section */}
        <section className="relative py-12 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-blue-50/50 z-0" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
                Sistema Integral de{" "}
                <span className="text-blue-600">Personal de Planta y Administrativo</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
                Simplifica la gestión de tu personal y automatiza la generación de recibos de sueldo con nuestra plataforma integral.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                <Button
                  onClick={() => router.push("/operarios")}
                  size="lg"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all text-sm sm:text-base"
                >
                  Ver Operarios
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  onClick={() => router.push("/form")}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all text-sm sm:text-base"
                >
                  Generar Recibo
                  <Receipt className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Lista de Operarios Modal/Section */}
        {mostrarListaOperarios && (
          <section className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Seleccionar Operario</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMostrarListaOperarios(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
              <ListaOperariosRecibos />
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-12 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Características Principales
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
                Descubre todas las herramientas que tenemos para hacer tu gestión más eficiente.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`border-2 hover:shadow-lg cursor-pointer transition-all transform hover:-translate-y-1 ${
                    feature.className || "hover:border-blue-200"
                  }`}
                  onClick={() => feature.link && router.push(feature.link)}
                >
                  <CardHeader>
                    <div className={`mb-4 p-3 rounded-xl inline-block ${feature.iconBg || "bg-blue-50"}`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        {feature.stats}
                      </span>
                      <ArrowRight className={`h-5 w-5 ${
                        feature.title === "Recibos de Sueldo" ? "text-green-500" : "text-blue-500"
                      }`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-20 bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Operarios Activos</h3>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">28</p>
                <p className="text-sm sm:text-base text-gray-600">Gestionados en el sistema</p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <Receipt className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Recibos Generados</h3>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">150+</p>
                <p className="text-sm sm:text-base text-gray-600">En el último mes</p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Documentos</h3>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">95%</p>
                <p className="text-sm sm:text-base text-gray-600">Digitalización completada</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl overflow-hidden">
              <div className="px-6 py-12 sm:px-16 lg:px-24 sm:py-16 relative">
                <div className="relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
                    <div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
                        ¿Necesitas ayuda con el sistema?
                      </h2>
                      <p className="text-blue-100 text-base sm:text-lg mb-6 sm:mb-8">
                        Nuestro equipo está disponible para asistirte en cualquier momento. Contáctanos para resolver tus dudas.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          onClick={() => router.push("/acercade")}
                          variant="secondary"
                          size="lg"
                          className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all text-sm sm:text-base"
                        >
                          Contactar Soporte
                          <Info className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </div>
                    </div>
                    <div className="hidden lg:block">
                      <div className="relative">
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500 rounded-full opacity-20" />
                        <div className="absolute -right-10 -bottom-20 w-48 h-48 bg-blue-400 rounded-full opacity-20" />
                        <div className="relative z-10 text-white text-center">
                          <div className="flex flex-col items-center gap-6">
                            <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center">
                              <Users className="w-12 h-12 text-white" />
                            </div>
                            <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center">
                              <Info className="w-12 h-12 text-white" />
                            </div>
                            <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center">
                              <FileText className="w-12 h-12 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-transparent to-transparent" />
                <div className="absolute right-0 bottom-0 w-1/3 h-1/2 bg-gradient-to-t from-blue-700/50 to-transparent" />
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </main>
  );
}
