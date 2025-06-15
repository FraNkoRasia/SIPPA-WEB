import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, ArrowRight, Search } from "lucide-react";
import operariosData from "@/data/operariosConHistorial.json";

interface Operario {
  legajo: number;
  nombre: string;
  apellido: string;
  categoria: string;
}

interface ReciboGuardado {
  legajo: string;
  fecha: string;
  monto: number;
}

export default function ListaOperariosRecibos() {
  const router = useRouter();
  const [operarios, setOperarios] = useState<Operario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [recibosCount, setRecibosCount] = useState<{[key: number]: number}>({});

  useEffect(() => {
    // Cargar operarios
    const operariosList = operariosData.operarios.map(op => ({
      legajo: op.legajo,
      nombre: op.nombre,
      apellido: op.apellido,
      categoria: op.categoria
    }));
    setOperarios(operariosList);

    // Cargar conteo de recibos desde localStorage
    const recibosGuardados = JSON.parse(localStorage.getItem('historialRecibos') || '[]') as ReciboGuardado[];
    const conteoRecibos = operariosList.reduce((acc: {[key: number]: number}, op) => {
      acc[op.legajo] = recibosGuardados.filter((r) => r.legajo === op.legajo.toString()).length;
      return acc;
    }, {});
    setRecibosCount(conteoRecibos);
  }, []);

  const operariosFiltrados = operarios.filter(op => 
    op.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    op.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
    op.legajo.toString().includes(busqueda)
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o legajo..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {operariosFiltrados.map((operario) => (
          <Card key={operario.legajo} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {operario.apellido}, {operario.nombre}
              </CardTitle>
              <CardDescription>
                Legajo: {operario.legajo} | {operario.categoria}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    {recibosCount[operario.legajo] || 0} recibos generados
                  </span>
                </div>
                <Button
                  onClick={() => router.push(`/operarios/perfilOperario/${operario.legajo}`)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  Ver Recibos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 