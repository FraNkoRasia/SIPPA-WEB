"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Code2,
  Database,
  Server,
  Terminal,
  Package,
  Briefcase,
  GraduationCap,
  Sparkles,
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

import { Layers, Paintbrush } from "lucide-react"; // Asegúrate de importar estos íconos también

const skills = [
  {
    icon: Code2,
    name: "React",
    category: "Frontend",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Layers,
    name: "Next.js",
    category: "Framework",
    color: "from-purple-500 to-pink-500",
  }, // reemplazado
  {
    icon: Terminal,
    name: "TypeScript",
    category: "Lenguaje",
    color: "from-blue-600 to-indigo-600",
  },
  {
    icon: Server,
    name: "Node.js",
    category: "Backend",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Package,
    name: "Tailwind CSS",
    category: "Estilos",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Database,
    name: "MySQL",
    category: "Base de datos",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Code2,
    name: "JavaScript",
    category: "Lenguaje",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Paintbrush,
    name: "Figma",
    category: "Diseño",
    color: "from-pink-500 to-purple-500",
  }, // reemplazado
  {
    icon: Terminal,
    name: "Postman",
    category: "API Testing",
    color: "from-orange-600 to-red-500",
  },
];

export default function AcercaDe() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <div className="container relative mx-auto py-10 px-4">
        <motion.div
          className="max-w-6xl mx-auto space-y-8 md:space-y-12 lg:space-y-16"
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center">
            <motion.div className="relative" variants={fadeIn}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-primary/30 to-primary/20 blur-3xl rounded-full animate-pulse" />
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-primary/30 to-primary/20 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient"></div>
                <div className="hidden relative p-1 rounded-full bg-gradient-to-r from-primary/60 via-primary/40 to-primary/20 shadow-2xl">
                  <Avatar className="h-32 w-32 md:h-40 md:w-40 lg:h-52 lg:w-52 ring-2 ring-background/80 relative">
                    <AvatarImage
                      src="https://portafolio-rho-gules.vercel.app/image/perfil/FraNko-3.png"
                      alt="FraNko Rasia"
                      className=""
                    />
                    <AvatarFallback className="text-2xl md:text-3xl lg:text-4xl">
                      CS
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </motion.div>

            <motion.div className="" variants={fadeIn}>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight pb-4 px-4">
                FraNko Rasia
              </h1>
              <div className="flex items-center justify-center  text-lg md:text-xl text-muted-foreground">
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                <span>Desarrollador Full Stack</span>
              </div>
              <p className="text-base md:text-lg text-muted-foreground/80 max-w-xs md:max-w-md lg:max-w-2xl mx-auto  p-4">
                +3 años de Formacion. De Rio Cuarto, Argentina. Especializado en el desarrollo de aplicaciones web únicas y Responsivas.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-row justify-center gap-2 px-2"
              variants={fadeIn}
            >
              <a
                href="https://github.com/FraNkoRasia?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-300 text-sm"
              >
                <Github className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/francorasia/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-300 text-sm"
              >
                <Linkedin className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://portafolio-rho-gules.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-300 text-sm"
              >
                <Sparkles className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Portafolio</span>
              </a>
            </motion.div>
          </div>

          {/* Skills Section */}
          <motion.div variants={fadeIn}>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
              Habilidades Técnicas
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-6">
              {skills.map((skill, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                  <CardContent className="p-3 md:p-6">
                    <div className="flex items-center gap-2 md:gap-4">
                      <div
                        className={`p-1.5 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br ${skill.color} text-white`}
                      >
                        <skill.icon className="h-4 w-4 md:h-6 md:w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm md:text-lg">
                          {skill.name}
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {skill.category}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Experience & Education */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <motion.div variants={fadeIn} className="h-full">
              <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="p-4 md:p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Briefcase className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg md:text-xl">
                        Experiencia
                      </CardTitle>
                      <CardDescription className="text-sm md:text-base">
                        Mi trayectoria profesional
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 flex-grow">
                  <div className="space-y-2">
                    <h4 className="font-medium text-base md:text-lg">
                      Desarrollador Full Stack
                    </h4>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Especializado en el desarrollo de aplicaciones web
                      modernas y escalables. Experiencia en la implementación de
                      soluciones empresariales y proyectos personales utilizando
                      las últimas tecnologías del mercado.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} className="h-full">
              <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="p-4 md:p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <GraduationCap className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg md:text-xl">
                        Educación
                      </CardTitle>
                      <CardDescription className="text-sm md:text-base">
                        Formación y certificaciones
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 flex-grow">
                  <div className="space-y-2">
                    <h4 className="font-medium text-base md:text-lg">
                      Desarrollo Web
                    </h4>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Formación continua en desarrollo web y nuevas tecnologías.
                      Certificaciones en React, Node.js y bases de datos.
                      Comprometido con el aprendizaje constante y la mejora
                      continua.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
