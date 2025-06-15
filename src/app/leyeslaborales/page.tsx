"use client";
import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { laws } from "@/utils/laws";
import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function LaborLawsPage() {
  const [query, setQuery] = useState("");

  const filteredLaws = laws.filter(
    (law) =>
      law.title.toLowerCase().includes(query.toLowerCase()) ||
      law.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div className="leyes-laborales-container" initial="initial" animate="animate" variants={fadeIn}>
      <h1 className="titulo-principal">Leyes Laborales Argentinas</h1>
      <Input
        type="text"
        placeholder="Buscar por palabra clave, ej: vacaciones"
        value={query}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        className="leyes-laborales-busqueda"
      />
      <div className="leyes-laborales-lista">
        {filteredLaws.map((law) => (
          <Card key={law.id} className="leyes-laborales-card">
            <CardContent className="leyes-laborales-card-contenido">
              <h2 className="subtitulo">{law.title}</h2>
              <p className="leyes-laborales-texto">{law.content}</p>
              <div className="leyes-laborales-boton-container">
                <Button asChild className="bg-black/90">
                  <a
                    href={law.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver en sitio oficial
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredLaws.length === 0 && (
          <p className="leyes-laborales-sin-resultados">
            No se encontraron leyes relacionadas.
          </p>
        )}
      </div>
    </motion.div>
  );
}
