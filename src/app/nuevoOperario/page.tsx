"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import operariosData from '@/data/operariosConHistorial.json';
import { defaultPDFs } from "@/utils/defaultPDFs";
import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function NuevoOperarioPage() {
  const router = useRouter();
  // Extraer sectores y categorías únicos
  const sectores = Array.from(new Set(operariosData.operarios.map((op: any) => op.sector))).sort();
  const categorias = Array.from(new Set(operariosData.operarios.map((op: any) => op.categoria))).sort();
  const [formData, setFormData] = useState({
    nombre: '',
    segundoNombre: '',
    apellido: '',
    dni: '',
    cuil: '',
    fechaNacimiento: '',
    fechaIngreso: new Date().toISOString().split('T')[0],
    sector: '',
    categoria: 'Operario Calificado',
    obraSocial: 'OSPACA',
    afiliadoSindicato: true,
    tipoContratacion: 'Permanente',
    sueldoPorHora: 2500,
    valorHoraNoRem: 0,
    estado: 'activo' as const,
    titulo: '',
    tituloPdf: null,
    tituloPdfName: '',
    curriculumPdf: null,
    curriculumPdfName: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Obtener operarios existentes
    const operariosGuardados = localStorage.getItem('operarios');
    const operarios = operariosGuardados ? JSON.parse(operariosGuardados) : [];
    
    // Generar nuevo legajo (último legajo + 1)
    const ultimoLegajo = operarios.reduce((max: number, op: any) => 
      op.legajo > max ? op.legajo : max, 1000);
    const nuevoLegajo = ultimoLegajo + 1;

    // Crear nuevo operario
    const nuevoOperario = {
      legajo: nuevoLegajo,
      ...formData,
      imagenPerfil: '/default-avatar.svg',
      curriculum: formData.curriculumPdf ? formData.curriculumPdf : defaultPDFs.curriculum,
      titulo: formData.tituloPdf ? formData.tituloPdf : defaultPDFs.titulo,
      ultimaActividad: new Date().toLocaleDateString('es-AR'),
      historial: {
        ausencias: [],
        suspensiones: [],
        vacaciones: [],
        ascensos: [],
        horasExtras: []
      }
    };

    // Guardar en localStorage
    operarios.push(nuevoOperario);
    localStorage.setItem('operarios', JSON.stringify(operarios));

    // Disparar evento de actualización
    window.dispatchEvent(new Event('operarioActualizado'));
    
    router.push(`/operarios/perfilOperario/${nuevoLegajo}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Formatear CUIL automáticamente
  const handleCuilChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 2) value = value.slice(0, 2) + '-' + value.slice(2);
    if (value.length > 11) value = value.slice(0, 11) + '-' + value.slice(11, 12);
    if (value.length > 14) value = value.slice(0, 14);
    setFormData(prev => ({ ...prev, cuil: value }));
  };

  // Manejar carga de PDF
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData(prev => ({
          ...prev,
          [name]: ev.target?.result,
          [`${name}Name`]: files[0].name
        }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <motion.div className="container mx-auto px-4 py-8" initial="initial" animate="animate" variants={fadeIn}>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100">
        <div className="p-6">
          <div className="border-b border-gray-100 pb-4 mb-5">
            <h2 className="text-center pb-4 text-[24px] md:text-[30px] font-bold text-gray-800">Nuevo Operario</h2>
            <p className="text-sm text-gray-500 mt-1">Complete los datos del nuevo operario</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-center pb-2 text-[18px] md:text-[20px] font-medium text-gray-700 mb-4">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    required
                    className="block w-full rounded-lg text-sm border-gray-200 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3.5 py-2 bg-white"
                    value={formData.nombre}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Segundo Nombre</label>
                  <input
                    type="text"
                    name="segundoNombre"
                    placeholder="Segundo Nombre"
                    className="block w-full rounded-lg text-sm border-gray-200 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3.5 py-2 bg-white"
                    value={formData.segundoNombre}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Apellido *</label>
                  <input
                    type="text"
                    name="apellido"
                    required
                    placeholder="Apellido"
                    className="block w-full rounded-lg text-sm border-gray-200 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3.5 py-2 bg-white"
                    value={formData.apellido}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">DNI *</label>
                  <input
                    type="text"
                    name="dni"
                    required
                    placeholder="DNI"
                    pattern="[0-9]{8}"
                    title="El DNI debe tener 8 números"
                    className="block w-full rounded-lg text-sm border-gray-200 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3.5 py-2 bg-white"
                    value={formData.dni}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">CUIL *</label>
                  <input
                    type="text"
                    name="cuil"
                    required
                    pattern="[0-9]{2}-[0-9]{8}-[0-9]{1}"
                    title="El CUIL debe tener el formato XX-XXXXXXXX-X"
                    placeholder="XX-XXXXXXXX-X"
                    className="block w-full rounded-lg text-sm border-gray-200 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3.5 py-2 bg-white"
                    value={formData.cuil}
                    onChange={handleCuilChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Nacimiento *</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    required
                    className="block w-full rounded-lg text-sm border-gray-200 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3.5 py-2 bg-white"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Información Laboral */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-center pb-2 text-[18px] md:text-[20px] font-medium text-gray-700 mb-4">Información Laboral</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Ingreso *</label>
                  <input
                    type="date"
                    name="fechaIngreso"
                    required
                    className="block w-full rounded-lg text-sm border-gray-200 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3.5 py-2 bg-white"
                    value={formData.fechaIngreso}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sector *</label>
                  <select
                    name="sector"
                    required
                    className="block w-full rounded-lg text-sm border-gray-200 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3.5 py-2 bg-white"
                    value={formData.sector}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione un sector</option>
                    {sectores.map((sector) => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoría *</label>
                  <select
                    name="categoria"
                    required
                    className="block w-full rounded-lg text-sm border-gray-200 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3.5 py-2 bg-white"
                    value={formData.categoria}
                    onChange={handleChange}
                  >
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Contratación *</label>
                  <select
                    name="tipoContratacion"
                    required
                    className="block w-full rounded-lg text-sm border-gray-200 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3.5 py-2 bg-white"
                    value={formData.tipoContratacion}
                    onChange={handleChange}
                  >
                    <option value="Permanente">Permanente</option>
                    <option value="Temporal">Temporal</option>
                    <option value="Contrato">Contrato</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sueldo por Hora *</label>
                  <input
                    type="number"
                    name="sueldoPorHora"
                    required
                    min="0"
                    step="0.01"
                    className="block w-full rounded-lg text-sm border-gray-200 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3.5 py-2 bg-white"
                    value={formData.sueldoPorHora}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Valor Hora No Remunerativa</label>
                  <input
                    type="number"
                    name="valorHoraNoRem"
                    min="0"
                    step="0.01"
                    className="block w-full rounded-lg text-sm border-gray-200 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3.5 py-2 bg-white"
                    value={formData.valorHoraNoRem}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Información Adicional */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-center pb-2 text-[18px] md:text-[20px] font-medium text-gray-700 mb-4">Información Adicional</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Obra Social *</label>
                  <input
                    type="text"
                    name="obraSocial"
                    required
                    className="block w-full rounded-lg text-sm border-gray-200 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3.5 py-2 bg-white"
                    value={formData.obraSocial}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Título (PDF)</label>
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => document.getElementById('tituloPdfInput')?.click()}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 w-full text-left"
                    >
                      Seleccionar archivo PDF
                    </button>
                    <input
                      id="tituloPdfInput"
                      type="file"
                      name="tituloPdf"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <span className="text-xs text-gray-600 truncate">
                      {formData.tituloPdfName ? formData.tituloPdfName : 'No hay archivo cargado'}
                    </span>
                    <span className="text-xs text-gray-400">Solo archivos PDF. Máx 5MB.</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Currículum (PDF)</label>
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => document.getElementById('curriculumPdfInput')?.click()}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 w-full text-left"
                    >
                      Seleccionar archivo PDF
                    </button>
                    <input
                      id="curriculumPdfInput"
                      type="file"
                      name="curriculumPdf"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <span className="text-xs text-gray-600 truncate">
                      {formData.curriculumPdfName ? formData.curriculumPdfName : 'No hay archivo cargado'}
                    </span>
                    <span className="text-xs text-gray-400">Solo archivos PDF. Máx 5MB.</span>
                  </div>
                </div>
                <div className="flex items-center md:col-span-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="afiliadoSindicato"
                      className="sr-only peer"
                      checked={formData.afiliadoSindicato}
                      onChange={handleChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Afiliado al Sindicato</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 mt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.push('/operarios')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Crear Operario
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
} 