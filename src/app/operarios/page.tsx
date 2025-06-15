"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Person as PersonIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import operariosDataImport from "@/data/operariosConHistorial.json";
import { motion } from "framer-motion";

interface Operario {
  legajo: number;
  nombre: string;
  apellido: string;
  segundoNombre?: string;
  sector?: string;
  estado?: 'activo' | 'inactivo';
  categoria?: 'Operario Calificado' | 'Operario Calificado A' | 'Operario Especializado';
  ultimaActividad?: string;
  fechaIngreso?: string;
  dni?: string;
  fechaNacimiento?: string;
  imagenPerfil?: string;
  curriculum?: string;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function OperariosPage() {
  const router = useRouter();
  const [operarios, setOperarios] = useState<Operario[]>([]);
  const [operariosFiltrados, setOperariosFiltrados] = useState<Operario[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const cargarOperarios = () => {
    // Intentar obtener los operarios del localStorage primero
    const operariosGuardados = localStorage.getItem('operarios');
    let datosOperarios;
    
    if (operariosGuardados) {
      datosOperarios = JSON.parse(operariosGuardados);
    } else {
      // Si no hay datos en localStorage, usar los datos por defecto
      datosOperarios = operariosDataImport.operarios;
      // Guardar los datos por defecto en localStorage
      localStorage.setItem('operarios', JSON.stringify(datosOperarios));
    }

    const operariosConDatos = datosOperarios.map((op: Operario) => ({
      ...op,
      ultimaActividad: new Date().toLocaleDateString(),
      estado: op.estado as 'activo' | 'inactivo',
      categoria: op.categoria as 'Operario Calificado' | 'Operario Calificado A' | 'Operario Especializado'
    }));
    
    setOperarios(operariosConDatos);
    setOperariosFiltrados(operariosConDatos);
  };

  useEffect(() => {
    cargarOperarios();

    // Escuchar el evento personalizado
    const handleOperarioActualizado = () => {
      cargarOperarios();
    };

    window.addEventListener('operarioActualizado', handleOperarioActualizado);

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('operarioActualizado', handleOperarioActualizado);
    };
  }, []);

  useEffect(() => {
    const filtrarOperarios = () => {
      const busquedaLower = busqueda.toLowerCase();
      const filtrados = operarios.filter(
        (operario) =>
          (operario.legajo.toString().includes(busqueda) ||
          operario.nombre.toLowerCase().includes(busquedaLower) ||
          operario.apellido.toLowerCase().includes(busquedaLower)) &&
          (filtroEstado === "todos" || operario.estado === filtroEstado)
      );
      setOperariosFiltrados(filtrados);
    };

    filtrarOperarios();
  }, [busqueda, operarios, filtroEstado]);

  const handleVerPerfil = (legajo: number) => {
    try {
      console.log('Navegando al perfil:', legajo);
      router.push(`/operarios/perfilOperario/${legajo}`);
    } catch (error) {
      console.error('Error al navegar:', error);
    }
  };

  const renderMobileView = () => (
    <div className="operarios-mobile">
      {operariosFiltrados.map((operario) => (
        <div key={operario.legajo} className="operarios-mobile-card">
          <div className="operarios-mobile-header">
            <div className="operarios-mobile-info">
              <div className="operarios-mobile-avatar">
                <PersonIcon className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h3 className="operarios-mobile-nombre">
                  {`${operario.nombre} ${operario.apellido}`}
                </h3>
                <p className="operarios-mobile-legajo">Legajo: {operario.legajo}</p>
              </div>
            </div>
            <span className={`operarios-estado ${
              operario.estado === 'activo' ? 'operarios-estado-activo' : 'operarios-estado-inactivo'
            }`}>
              {operario.estado}
            </span>
          </div>
          <div className="operarios-mobile-grid">
            <div>
              <p className="operarios-mobile-label">Sector</p>
              <p>{operario.sector}</p>
            </div>
            <div>
              <p className="operarios-mobile-label">Categoría</p>
              <p>{operario.categoria}</p>
            </div>
            <div>
              <p className="operarios-mobile-label">Última Actividad</p>
              <p>{operario.ultimaActividad}</p>
            </div>
          </div>
          <button
            onClick={() => handleVerPerfil(operario.legajo)}
            className="operarios-boton"
          >
            <PersonIcon />
            Ver Perfil
          </button>
        </div>
      ))}
    </div>
  );

  const renderDesktopView = () => (
    <div className="operarios-tabla">
      <table className="w-full">
        <thead className="operarios-tabla-header">
          <tr>
            <th>Legajo</th>
            <th>Operario</th>
            <th>Sector</th>
            <th>Estado</th>
            <th>Última Actividad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className="operarios-tabla-body">
          {operariosFiltrados.map((operario) => (
            <tr key={operario.legajo} className="operarios-tabla-fila">
              <td className="operarios-tabla-celda">
                <div className="operarios-legajo">
                  <span className="operarios-legajo-avatar">
                    {operario.legajo.toString().slice(-2)}
                  </span>
                  <span className="operarios-legajo-numero">{operario.legajo}</span>
                </div>
              </td>
              <td className="operarios-tabla-celda">
                <div className="operarios-info">
                  <div className="operarios-info-avatar">
                    <PersonIcon className="text-blue-600" />
                  </div>
                  <div>
                    <p className="operarios-info-nombre">{`${operario.nombre} ${operario.apellido}`}</p>
                    <p className="operarios-info-categoria">{operario.categoria}</p>
                  </div>
                </div>
              </td>
              <td className="operarios-tabla-celda text-gray-600">{operario.sector}</td>
              <td className="operarios-tabla-celda">
                <span className={`operarios-estado ${
                  operario.estado === 'activo' ? 'operarios-estado-activo' : 'operarios-estado-inactivo'
                }`}>
                  {operario.estado}
                </span>
              </td>
              <td className="operarios-tabla-celda text-gray-600">{operario.ultimaActividad}</td>
              <td className="operarios-tabla-celda">
                <button
                  onClick={() => handleVerPerfil(operario.legajo)}
                  className="operarios-boton"
                >
                  <PersonIcon />
                  Ver Perfil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <motion.div className="operarios-container" initial="initial" animate="animate" variants={fadeIn}>
      <div className="">
        <div className="mb-6 flex justify-center">
          <h2 className="text-[24px] md:text-[30px] font-bold text-gray-800">Lista de Operarios</h2>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por legajo, nombre o apellido..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>

        <div className="hidden md:block">
          {renderDesktopView()}
        </div>
        <div className="md:hidden">
          {renderMobileView()}
        </div>
      </div>
    </motion.div>
  );
}
