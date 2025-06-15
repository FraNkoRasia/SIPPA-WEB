"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  TrendingUp,
  Clock,
  Calendar,
  Award,
  AlertTriangle,
  ArrowLeft,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Operario {
  legajo: number;
  nombre: string;
  apellido: string;
  fechaIngreso: string;
  categoria: string;
  estado: string;
  historial?: {
    ausencias?: Array<{ fecha: string; motivo: string; duracion: string }>;
    ascensos?: Array<{ fecha: string; cargo: string }>;
    horasExtras?: Array<{ fecha: string; cantidad: string }>;
  };
}

interface EstadisticasPersonal {
  totalOperarios: number;
  operariosActivos: number;
  operariosInactivos: number;
  categorias: { [key: string]: number };
  promedioAntiguedad: number;
  ausenciasUltimoMes: number;
  horasExtrasTotal: number;
  ascensosSemestre: number;
}

interface HistorialLocalStorage {
  [legajo: number]: {
    ausencias?: Array<{ fecha: string; motivo: string; duracion: string }>;
    ascensos?: Array<{ fecha: string; cargo: string }>;
    horasExtras?: Array<{ fecha: string; cantidad: string }>;
  };
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Reportes() {
  const router = useRouter();
  const [operarios, setOperarios] = useState<Operario[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasPersonal>({
    totalOperarios: 0,
    operariosActivos: 0,
    operariosInactivos: 0,
    categorias: {},
    promedioAntiguedad: 0,
    ausenciasUltimoMes: 0,
    horasExtrasTotal: 0,
    ascensosSemestre: 0,
  });

  // Función para cargar los datos de operarios
  const cargarOperarios = async () => {
    try {
      const response = await fetch('/api/operarios');
      if (!response.ok) {
        throw new Error('Error al cargar los datos');
      }
      const data = await response.json();
      
      // Obtener operarios del localStorage
      let operariosLocalStorage = [];
      try {
        const localStorageData = localStorage.getItem('operarios');
        if (localStorageData) {
          operariosLocalStorage = JSON.parse(localStorageData);
        }
      } catch (error) {
        console.error('Error al leer localStorage:', error);
      }

      // Crear un mapa de operarios base usando el legajo como clave
      const operariosMap = new Map(
        data.baseOperarios.map((op: Operario) => [op.legajo, { ...op }])
      );

      // Agregar solo los operarios del localStorage que no existen en el JSON base
      operariosLocalStorage.forEach((op: Operario) => {
        if (!operariosMap.has(op.legajo)) {
          operariosMap.set(op.legajo, { ...op });
        }
      });

      // Obtener todos los historiales del localStorage
      const historiales = new Map<number, any>();
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('historial_')) {
          try {
            const legajo = parseInt(key.split('_')[1]);
            const historialData = JSON.parse(localStorage.getItem(key) || '{}');
            historiales.set(legajo, historialData);
          } catch (error) {
            console.error('Error al procesar historial:', error);
          }
        }
      }

      // Actualizar el historial de cada operario
      const operariosActualizados = Array.from(operariosMap.values()).map((value: unknown) => {
        const operario = value as Operario;
        const historialLocal = historiales.get(operario.legajo);
        
        // Inicializar el historial si no existe
        if (!operario.historial) {
          operario.historial = {
            ausencias: [],
            ascensos: [],
            horasExtras: []
          };
        }

        if (historialLocal) {
          // Combinar ausencias
          const ausenciasBase = operario.historial.ausencias || [];
          const ausenciasLocal = historialLocal.ausencias || [];
          const todasAusencias = [...ausenciasBase, ...ausenciasLocal];

          // Combinar ascensos
          const ascensosBase = operario.historial.ascensos || [];
          const ascensosLocal = historialLocal.ascensos || [];
          const todosAscensos = [...ascensosBase, ...ascensosLocal];

          // Combinar horas extras
          const horasExtrasBase = operario.historial.horasExtras || [];
          const horasExtrasLocal = historialLocal.horasExtras || [];
          const todasHorasExtras = [...horasExtrasBase, ...horasExtrasLocal];

          return {
            ...operario,
            historial: {
              ausencias: todasAusencias,
              ascensos: todosAscensos,
              horasExtras: todasHorasExtras
            }
          };
        }

        return operario;
      });

      setOperarios(operariosActualizados);
    } catch (error) {
      console.error('Error al cargar operarios:', error);
    }
  };

  useEffect(() => {
    cargarOperarios();
  }, []);

  useEffect(() => {
    const calcularEstadisticas = () => {
      const fechaActual = new Date();

      // Estadísticas básicas
      const activos = operarios.filter(op => op.estado === "activo").length;
      const categorias = operarios.reduce((acc: { [key: string]: number }, op) => {
        acc[op.categoria] = (acc[op.categoria] || 0) + 1;
        return acc;
      }, {});

      // Calcular antigüedad promedio
      const antiguedadTotal = operarios.reduce((total, op) => {
        let fechaIngreso;
        try {
          // Intentar primero el formato DD/MM/YYYY
          const [day, month, year] = op.fechaIngreso.split('/');
          if (day && month && year) {
            fechaIngreso = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          } else {
            // Si no es DD/MM/YYYY, intentar parsear directamente
            fechaIngreso = new Date(op.fechaIngreso);
          }

          if (isNaN(fechaIngreso.getTime())) {
            console.error('Fecha inválida para operario:', op.legajo);
            return total;
          }

          const antiguedadAnios = (fechaActual.getTime() - fechaIngreso.getTime()) / (1000 * 60 * 60 * 24 * 365);
          return total + antiguedadAnios;
        } catch (error) {
          console.error('Error al procesar fecha para operario:', op.legajo, error);
          return total;
        }
      }, 0);

      // Contar ausencias del último mes
      const unMesAtras = new Date();
      unMesAtras.setMonth(unMesAtras.getMonth() - 1);
      const ausencias = operarios.reduce((total, op) => {
        const ausenciasOperario = op.historial?.ausencias || [];
        return total + ausenciasOperario.reduce((count, ausencia) => {
          try {
            let fechaAusencia;
            if (ausencia.fecha.includes('-')) {
              fechaAusencia = new Date(ausencia.fecha);
            } else {
              const [day, month, year] = ausencia.fecha.split('/');
              fechaAusencia = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            }
            
            return (!isNaN(fechaAusencia.getTime()) && fechaAusencia >= unMesAtras) ? count + 1 : count;
          } catch (error) {
            console.error('Error al procesar fecha de ausencia:', ausencia.fecha);
            return count;
          }
        }, 0);
      }, 0);

      // Contar horas extras totales
      const horasExtras = operarios.reduce((total, op) => {
        return total + (op.historial?.horasExtras || [])
          .reduce((sum, h) => {
            const cantidad = parseInt(h.cantidad.split(' ')[0]);
            return sum + (isNaN(cantidad) ? 0 : cantidad);
          }, 0);
      }, 0);

      // Contar ascensos del último semestre
      const seisMesesAtras = new Date();
      seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);
      const ascensos = operarios.reduce((total, op) => {
        const ascensosOperario = op.historial?.ascensos || [];
        return total + ascensosOperario.reduce((count, ascenso) => {
          try {
            let fechaAscenso;
            if (ascenso.fecha.includes('-')) {
              fechaAscenso = new Date(ascenso.fecha);
            } else {
              const [day, month, year] = ascenso.fecha.split('/');
              fechaAscenso = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            }
            
            return (!isNaN(fechaAscenso.getTime()) && fechaAscenso >= seisMesesAtras) ? count + 1 : count;
          } catch (error) {
            console.error('Error al procesar fecha de ascenso:', ascenso.fecha);
            return count;
          }
        }, 0);
      }, 0);

      setEstadisticas({
        totalOperarios: operarios.length,
        operariosActivos: activos,
        operariosInactivos: operarios.length - activos,
        categorias,
        promedioAntiguedad: operarios.length > 0 ? parseFloat((antiguedadTotal / operarios.length).toFixed(1)) : 0,
        ausenciasUltimoMes: ausencias,
        horasExtrasTotal: horasExtras,
        ascensosSemestre: ascensos,
      });
    };

    if (operarios.length > 0) {
      calcularEstadisticas();
    }
  }, [operarios]);

  const distribucionCategorias = Object.entries(estadisticas.categorias).map(([categoria, cantidad]) => ({
    categoria,
    porcentaje: (cantidad / estadisticas.totalOperarios) * 100,
    cantidad,
  }));

  return (
    <motion.div className="reportes-container min-h-screen bg-gradient-to-b from-gray-50 to-gray-100" initial="initial" animate="animate" variants={fadeIn}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center ">
            <h1 className="mt-[40px] text-center text-[24px] md:text-[30px] font-bold text-gray-900 mb-4 sm:mb-0">
              Reportes y Análisis
            </h1>
          </div>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">
                Total Operarios
              </CardTitle>
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{estadisticas.totalOperarios}</div>
              <p className="text-xs text-gray-500">
                {estadisticas.operariosActivos} activos, {estadisticas.operariosInactivos} inactivos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">
                Antigüedad Promedio
              </CardTitle>
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {estadisticas.promedioAntiguedad.toFixed(1)} años
              </div>
              <p className="text-xs text-gray-500">Promedio general</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">
                Ausencias Último Mes
              </CardTitle>
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{estadisticas.ausenciasUltimoMes}</div>
              <p className="text-xs text-gray-500">Total registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">
                Ascensos Semestre
              </CardTitle>
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{estadisticas.ascensosSemestre}</div>
              <p className="text-xs text-gray-500">Últimos 6 meses</p>
            </CardContent>
          </Card>
        </div>

        {/* Distribución por Categorías */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="space-y-1 sm:space-y-2">
            <CardTitle className="text-lg sm:text-xl">Distribución por Categorías</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Porcentaje de operarios por categoría laboral
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {distribucionCategorias.map(({ categoria, porcentaje, cantidad }) => (
                <div key={categoria}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs sm:text-sm font-medium">{categoria}</span>
                    <span className="text-xs sm:text-sm text-gray-500">{cantidad} operarios</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Métricas Adicionales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pb-10">
          <Card>
            <CardHeader className="space-y-1 sm:space-y-2">
              <CardTitle className="text-lg sm:text-xl">Horas Extras</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Total de horas extras registradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 sm:gap-4">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                <div>
                  <div className="text-2xl sm:text-3xl font-bold">{estadisticas.horasExtrasTotal}</div>
                  <p className="text-xs sm:text-sm text-gray-500">Horas totales</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alertas y Notificaciones</CardTitle>
              <CardDescription>
                Resumen de situaciones que requieren atención
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-amber-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm">
                    {estadisticas.ausenciasUltimoMes} ausencias registradas este mes
                  </span>
                </div>
                {estadisticas.operariosInactivos > 0 && (
                  <div className="flex items-center gap-3 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="text-sm">
                      {estadisticas.operariosInactivos} operarios inactivos
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
} 