"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Avatar,
  Button,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Event as EventIcon,
  Warning as WarningIcon,
  BeachAccess as BeachIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Receipt as ReceiptIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import operariosData from "@/data/operariosConHistorial.json";
import React from "react";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import { useFormContext, EmpleadoData } from "@/context/FormContext";
import FormularioRecibo from "@/components/FormularioRecibo/FormularioRecibo";
import { defaultPDFs } from "@/utils/defaultPDFs";
import { motion } from "framer-motion";

export interface OperarioDetalle {
  legajo: number;
  nombre: string;
  segundoNombre?: string;
  apellido: string;
  fechaIngreso: string;
  categoria:
    | "Operario Calificado"
    | "Operario Calificado A"
    | "Operario Especializado"
    | "Gerente"
    | "Supervisor"
    | "Jefe de RRHH"
    | "Coordinador de RRHH"
    | "Analista de RRHH"
    | "Asistente de RRHH";
  dni: string;
  cuil: string;
  obraSocial: string;
  afiliadoSindicato: boolean;
  tipoContratacion: string;
  sueldoPorHora: number;
  valorHoraNoRem: number;
  fechaNacimiento: string;
  imagenPerfil?: string;
  curriculum?: string;
  titulo?: string;
  sector?: string;
  estado?: "activo" | "inactivo";
  ultimaActividad?: string;
  historial?: {
    ausencias: Array<{
      fecha: string;
      motivo: string;
      duracion: string;
    }>;
    suspensiones: Array<{
      fecha: string;
      motivo: string;
      duracion: string;
    }>;
    vacaciones: Array<{
      fecha: string;
      duracion: string;
    }>;
    ascensos: Array<{
      fecha: string;
      cargo: string;
      departamento: string;
    }>;
    horasExtras: Array<{
      fecha: string;
      cantidad: string;
      motivo: string;
    }>;
  };
}

interface ReciboData extends EmpleadoData {
  totalNeto?: number;
  total?: number;
}

interface Recibo {
  id: number;
  fecha: string;
  monto: number;
  concepto: string;
  estado: string;
  periodo: string;
  datosCompletos: ReciboData;
  totalNeto?: number;
  total?: number;
  legajo?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ px: { xs: 0, md: 3 }, py: 3 }}>{children}</Box>
      )}
    </div>
  );
}

const IconWithColor = ({
  icon,
  type,
}: {
  icon: React.ReactNode;
  type: string;
}) => {
  const getColorClasses = () => {
    switch (type) {
      case "dni":
        return "bg-[#1976d2] text-white"; // Azul
      case "cuil":
        return "bg-[#1976d2] text-white"; // Azul
      case "fechaNacimiento":
        return "bg-[#2e7d32] text-white"; // Verde
      case "fechaIngreso":
        return "bg-[#ed6c02] text-white"; // Naranja
      case "categoria":
        return "bg-[#9c27b0] text-white"; // Púrpura
      case "departamento":
        return "bg-[#0288d1] text-white"; // Azul claro
      case "ultimaActividad":
        return "bg-[#d32f2f] text-white"; // Rojo
      case "obraSocial":
        return "bg-[#00796b] text-white"; // Verde azulado
      case "afiliadoSindicato":
        return "bg-[#c62828] text-white"; // Rojo oscuro
      case "tipoContratacion":
        return "bg-[#4527a0] text-white"; // Púrpura oscuro
      case "sueldoPorHora":
        return "bg-[#2e7d32] text-white"; // Verde
      case "estado":
        return React.isValidElement(icon) && icon.type === CheckCircleIcon
          ? "bg-[#2e7d32] text-white" // Verde para activo
          : "bg-[#d32f2f] text-white"; // Rojo para inactivo
      default:
        return "bg-[#1976d2] text-white"; // Azul por defecto
    }
  };

  return (
    <div
      className={`p-4 rounded flex items-center justify-center w-10 h-10 ${getColorClasses()}`}
    >
      {icon}
    </div>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
  type,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  type: string;
}) => (
  <div className="p-4 bg-white rounded-lg flex items-center gap-4 transition-all duration-200 hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-md">
    <IconWithColor icon={icon} type={type} />
    <div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-base">{value}</p>
    </div>
  </div>
);

const calcularTotal = (recibo: Recibo): string => {
  const montoTotal = 
    recibo.datosCompletos?.brutoTotal ||
    recibo.datosCompletos?.netoTotal ||
    recibo.totalNeto ||
    recibo.total ||
    recibo.monto ||
    0;

  return new Intl.NumberFormat('es-AR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
  }).format(montoTotal);
};

const EmptyStateBox = ({ icon: Icon, message }: { icon: any, message: string }) => (
  <Box
    sx={{
      gridColumn: "1 / -1",
      p: 4,
      borderRadius: "16px",
      backgroundColor: "white",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      border: "1px solid",
      borderColor: "rgba(0, 0, 0, 0.08)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
    }}
  >
    <Icon sx={{ fontSize: 48, color: "text.secondary" }} />
    <Typography variant="h6" sx={{ color: "text.secondary" }}>
      {message}
    </Typography>
  </Box>
);

interface Historial {
  ausencias: { fecha: string; motivo: string; duracion: string; }[];
  suspensiones: { fecha: string; motivo: string; duracion: string; }[];
  vacaciones: { fecha: string; duracion: string; }[];
  ascensos: { fecha: string; cargo: string; departamento: string; }[];
  horasExtras: { fecha: string; cantidad: string; motivo: string; }[];
}

const initializeHistorial = (): Historial => ({
  ausencias: [],
  suspensiones: [],
  vacaciones: [],
  ascensos: [],
  horasExtras: []
});

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function PerfilOperario() {
  const params = useParams();
  const router = useRouter();
  const { setEmpleado } = useFormContext();

  const [operario, setOperario] = useState<OperarioDetalle | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [openRecibo, setOpenRecibo] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [reciboToDelete, setReciboToDelete] = useState<number | null>(null);
  const [historialRecibos, setHistorialRecibos] = useState<Recibo[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAusenciaDialog, setOpenAusenciaDialog] = useState(false);
  const [openSuspensionDialog, setOpenSuspensionDialog] = useState(false);
  const [openVacacionesDialog, setOpenVacacionesDialog] = useState(false);
  const [openAscensoDialog, setOpenAscensoDialog] = useState(false);
  const [openDeleteHistorialDialog, setOpenDeleteHistorialDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'ausencia' | 'suspension' | 'vacacion' | 'ascenso';
    index: number;
  } | null>(null);
  const [ausenciaFormData, setAusenciaFormData] = useState({
    fecha: "",
    motivo: "",
    duracion: ""
  });
  const [suspensionFormData, setSuspensionFormData] = useState({
    fecha: "",
    motivo: "",
    duracion: ""
  });
  const [vacacionesFormData, setVacacionesFormData] = useState({
    fecha: "",
    duracion: ""
  });
  const [editFormData, setEditFormData] = useState<Partial<OperarioDetalle>>({
    nombre: operario?.nombre || "",
    segundoNombre: operario?.segundoNombre || "",
    apellido: operario?.apellido || "",
    dni: operario?.dni || "",
    cuil: operario?.cuil || "",
    fechaNacimiento: operario?.fechaNacimiento || "",
    fechaIngreso: operario?.fechaIngreso || "",
    categoria: operario?.categoria || "Operario Calificado",
    sector: operario?.sector || "",
    obraSocial: operario?.obraSocial || "",
    afiliadoSindicato: operario?.afiliadoSindicato || false,
    tipoContratacion: operario?.tipoContratacion || "",
    sueldoPorHora: operario?.sueldoPorHora || 0,
    valorHoraNoRem: operario?.valorHoraNoRem || 0,
    estado: operario?.estado || "activo"
  });
  const [ascensoFormData, setAscensoFormData] = useState({
    fecha: "",
    cargo: "",
    departamento: ""
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    try {
      console.log('Buscando operario con legajo:', params.legajo);
      
      // Primero intentar obtener del localStorage
      const operariosGuardados = JSON.parse(
        localStorage.getItem("operarios") || "[]"
      );
      
      let operarioEncontrado = operariosGuardados.find(
        (op: OperarioDetalle) => op.legajo.toString() === params.legajo
      );

      // Si no está en localStorage, buscarlo en los datos estáticos
      if (!operarioEncontrado) {
        operarioEncontrado = operariosData.operarios.find(
          (op) => op.legajo.toString() === params.legajo
        ) as OperarioDetalle;
      }

      console.log('Operario encontrado:', operarioEncontrado);

      if (operarioEncontrado) {
        const operarioConValores: OperarioDetalle = {
          ...operarioEncontrado,
          estado: operarioEncontrado.estado as "activo" | "inactivo",
          categoria: operarioEncontrado.categoria as
            | "Operario Calificado"
            | "Operario Calificado A"
            | "Operario Especializado"
            | "Gerente",
          ultimaActividad: new Date().toLocaleDateString(),
          fechaIngreso: operarioEncontrado.fechaIngreso || "No especificada",
          dni: operarioEncontrado.dni || "No especificado",
          fechaNacimiento: operarioEncontrado.fechaNacimiento || "No especificada",
          valorHoraNoRem: operarioEncontrado.valorHoraNoRem || 0,
          sueldoPorHora: operarioEncontrado.sueldoPorHora || 0,
          tipoContratacion: operarioEncontrado.tipoContratacion || "",
          afiliadoSindicato: operarioEncontrado.afiliadoSindicato || false,
          obraSocial: operarioEncontrado.obraSocial || "",
          cuil: operarioEncontrado.cuil || "",
          nombre: operarioEncontrado.nombre || "",
          apellido: operarioEncontrado.apellido || "",
          legajo: operarioEncontrado.legajo,
          curriculum: operarioEncontrado.curriculum || defaultPDFs.curriculum,
          titulo: operarioEncontrado.titulo || defaultPDFs.titulo,
        };
        
        setOperario(operarioConValores);

        // Si el operario venía de datos estáticos, guardarlo en localStorage
        if (!operariosGuardados.some((op: OperarioDetalle) => op.legajo.toString() === params.legajo)) {
          operariosGuardados.push(operarioConValores);
          localStorage.setItem("operarios", JSON.stringify(operariosGuardados));
        }
      } else {
        console.error('No se encontró el operario con legajo:', params.legajo);
      }
    } catch (error) {
      console.error('Error al cargar el operario:', error);
    }
  }, [params.legajo]);

  useEffect(() => {
    const recibosGuardados = JSON.parse(
      localStorage.getItem("historialRecibos") || "[]"
    );
    const recibosOperario = recibosGuardados.filter(
      (recibo: any) => recibo.legajo === operario?.legajo.toString()
    );
    setHistorialRecibos(recibosOperario);
  }, [operario?.legajo]);

  const handleReciboClick = (recibo: Recibo) => {
    setEmpleado(recibo.datosCompletos);
    router.push("/recibo");
  };

  const handleEliminarRecibo = (index: number) => {
    setReciboToDelete(index);
    setOpenDeleteDialog(true);
  };

  const confirmarEliminacion = () => {
    if (reciboToDelete !== null) {
      // Obtener todos los recibos del localStorage
      const todosLosRecibos = JSON.parse(
        localStorage.getItem("historialRecibos") || "[]"
      );

      // Encontrar el índice del recibo a eliminar en el array completo
      let reciboIndex = -1;
      let currentOperarioIndex = -1;

      todosLosRecibos.forEach((recibo: any, index: number) => {
        if (recibo.legajo === operario?.legajo.toString()) {
          currentOperarioIndex++;
          if (currentOperarioIndex === reciboToDelete) {
            reciboIndex = index;
          }
        }
      });

      if (reciboIndex !== -1) {
        // Eliminar el recibo del array
        todosLosRecibos.splice(reciboIndex, 1);

        // Actualizar el localStorage con los recibos restantes
        localStorage.setItem(
          "historialRecibos",
          JSON.stringify(todosLosRecibos)
        );

        // Actualizar el estado local
        setHistorialRecibos(
          todosLosRecibos.filter(
            (recibo: any) => recibo.legajo === operario?.legajo.toString()
          )
        );
      }
    }
    setOpenDeleteDialog(false);
    setReciboToDelete(null);
  };
  const handleEditClick = () => {
    setEditFormData({
      nombre: operario?.nombre || "",
      segundoNombre: operario?.segundoNombre || "",
      apellido: operario?.apellido || "",
      dni: operario?.dni || "",
      cuil: operario?.cuil || "",
      fechaNacimiento: operario?.fechaNacimiento || "",
      fechaIngreso: operario?.fechaIngreso || "",
      categoria: operario?.categoria || "Operario Calificado",
      sector: operario?.sector || "",
      obraSocial: operario?.obraSocial || "",
      afiliadoSindicato: operario?.afiliadoSindicato || false,
      tipoContratacion: operario?.tipoContratacion || "",
      sueldoPorHora: operario?.sueldoPorHora || 0,
      valorHoraNoRem: operario?.valorHoraNoRem || 0,
      estado: operario?.estado || "activo"
    });
    setOpenEditDialog(true);
  };

  const handleEditFormChange = (
    field: keyof OperarioDetalle,
    value: string | number | boolean
  ) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSave = () => {
    if (!operario) return;

    // Obtener todos los operarios del localStorage
    const operariosGuardados = JSON.parse(localStorage.getItem("operarios") || "[]");

    // Crear el operario actualizado
    const operarioActualizado = {
      ...operario,
      ...editFormData
    };

    // Actualizar el operario en la lista
    const operariosActualizados = operariosGuardados.map((op: OperarioDetalle) =>
      op.legajo === operario.legajo ? operarioActualizado : op
    );

    // Si el operario no existe en la lista, agregarlo
    if (!operariosGuardados.some((op: OperarioDetalle) => op.legajo === operario.legajo)) {
      operariosActualizados.push(operarioActualizado);
    }

    // Guardar la lista actualizada en localStorage
    localStorage.setItem("operarios", JSON.stringify(operariosActualizados));

    // Actualizar el estado local
    setOperario(operarioActualizado);
    setEditFormData({});
    setOpenEditDialog(false);

    // Disparar evento de actualización
    const event = new CustomEvent('operarioActualizado', { 
      detail: { legajo: operario.legajo } 
    });
    window.dispatchEvent(event);
  };

  const handleFileUpload = (type: 'curriculum' | 'titulo' | 'imagenPerfil') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        
        if (operario) {
          const updatedOperario = {
            ...operario,
            [type]: base64Data
          };
          setOperario(updatedOperario);

          // Actualizar en localStorage
          const operariosGuardados = JSON.parse(
            localStorage.getItem("operarios") || "[]"
          );

          const operariosActualizados = operariosGuardados.map((op: OperarioDetalle) =>
            op.legajo === operario.legajo ? updatedOperario : op
          );

          localStorage.setItem(
            "operarios",
            JSON.stringify(operariosActualizados)
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileView = (fileData: string | undefined, fileName: string) => {
    if (fileData && fileData.startsWith('data:application/pdf')) {
      // Convertir DataURL a Blob
      const arr = fileData.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }
  };

  const handleAusenciaFormChange = (field: string, value: string) => {
    setAusenciaFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAgregarAusencia = () => {
    if (!operario) return;

    // Obtener todos los operarios del localStorage
    const operariosGuardados = JSON.parse(localStorage.getItem("operarios") || "[]");

    // Crear la nueva ausencia
    const nuevaAusencia = {
      fecha: ausenciaFormData.fecha,
      motivo: ausenciaFormData.motivo,
      duracion: `${ausenciaFormData.duracion} días`
    };

    // Encontrar el operario actual y actualizar su historial
    const operarioActualizado = operariosGuardados.find(
      (op: OperarioDetalle) => op.legajo === operario.legajo
    );

    if (operarioActualizado) {
      if (!operarioActualizado.historial) {
        operarioActualizado.historial = initializeHistorial();
      }
      operarioActualizado.historial.ausencias.push(nuevaAusencia);

      // Actualizar el localStorage
      const operariosActualizados = operariosGuardados.map((op: OperarioDetalle) =>
        op.legajo === operario.legajo ? operarioActualizado : op
      );
      localStorage.setItem("operarios", JSON.stringify(operariosActualizados));

      // Actualizar el estado local
      setOperario({
        ...operario,
        historial: {
          ausencias: [...(operario.historial?.ausencias || []), nuevaAusencia],
          suspensiones: operario.historial?.suspensiones || [],
          vacaciones: operario.historial?.vacaciones || [],
          ascensos: operario.historial?.ascensos || [],
          horasExtras: operario.historial?.horasExtras || []
        }
      });
    }

    // Limpiar el formulario y cerrar el diálogo
    setAusenciaFormData({
      fecha: "",
      motivo: "",
      duracion: ""
    });
    setOpenAusenciaDialog(false);
  };

  const calcularDiasVacaciones = (fechaIngreso: string): number => {
    const inicio = new Date(fechaIngreso.split('/').reverse().join('-'));
    const hoy = new Date();
    const antiguedadAnios = hoy.getFullYear() - inicio.getFullYear();

    // Según la ley de contrato de trabajo en Argentina
    if (antiguedadAnios < 5) return 14;
    if (antiguedadAnios < 10) return 21;
    if (antiguedadAnios < 20) return 28;
    return 35;
  };

  const handleSuspensionFormChange = (field: string, value: string) => {
    setSuspensionFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVacacionesFormChange = (field: string, value: string) => {
    setVacacionesFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAgregarSuspension = () => {
    if (!operario) return;

    const operariosGuardados = JSON.parse(localStorage.getItem("operarios") || "[]");
    const nuevaSuspension = {
      fecha: suspensionFormData.fecha,
      motivo: suspensionFormData.motivo,
      duracion: `${suspensionFormData.duracion} días`
    };

    const operarioActualizado = operariosGuardados.find(
      (op: OperarioDetalle) => op.legajo === operario.legajo
    );

    if (operarioActualizado) {
      if (!operarioActualizado.historial) {
        operarioActualizado.historial = initializeHistorial();
      }
      operarioActualizado.historial.suspensiones.push(nuevaSuspension);

      const operariosActualizados = operariosGuardados.map((op: OperarioDetalle) =>
        op.legajo === operario.legajo ? operarioActualizado : op
      );
      localStorage.setItem("operarios", JSON.stringify(operariosActualizados));

      setOperario({
        ...operario,
        historial: {
          ausencias: operario.historial?.ausencias || [],
          suspensiones: [...(operario.historial?.suspensiones || []), nuevaSuspension],
          vacaciones: operario.historial?.vacaciones || [],
          ascensos: operario.historial?.ascensos || [],
          horasExtras: operario.historial?.horasExtras || []
        }
      });
    }

    setSuspensionFormData({
      fecha: "",
      motivo: "",
      duracion: ""
    });
    setOpenSuspensionDialog(false);
  };

  const handleAgregarVacaciones = () => {
    if (!operario) return;

    const operariosGuardados = JSON.parse(localStorage.getItem("operarios") || "[]");
    const nuevasVacaciones = {
      fecha: vacacionesFormData.fecha,
      duracion: `${vacacionesFormData.duracion} días`
    };

    const operarioActualizado = operariosGuardados.find(
      (op: OperarioDetalle) => op.legajo === operario.legajo
    );

    if (operarioActualizado) {
      if (!operarioActualizado.historial) {
        operarioActualizado.historial = initializeHistorial();
      }
      operarioActualizado.historial.vacaciones.push(nuevasVacaciones);

      const operariosActualizados = operariosGuardados.map((op: OperarioDetalle) =>
        op.legajo === operario.legajo ? operarioActualizado : op
      );
      localStorage.setItem("operarios", JSON.stringify(operariosActualizados));

      setOperario({
        ...operario,
        historial: {
          ausencias: operario.historial?.ausencias || [],
          suspensiones: operario.historial?.suspensiones || [],
          vacaciones: [...(operario.historial?.vacaciones || []), nuevasVacaciones],
          ascensos: operario.historial?.ascensos || [],
          horasExtras: operario.historial?.horasExtras || []
        }
      });
    }

    setVacacionesFormData({
      fecha: "",
      duracion: ""
    });
    setOpenVacacionesDialog(false);
  };

  const handleAscensoFormChange = (field: string, value: string) => {
    setAscensoFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAgregarAscenso = () => {
    if (!operario) return;

    const operariosGuardados = JSON.parse(localStorage.getItem("operarios") || "[]");
    const nuevoAscenso = {
      fecha: ascensoFormData.fecha,
      cargo: ascensoFormData.cargo,
      departamento: ascensoFormData.departamento
    };

    const operarioActualizado = operariosGuardados.find(
      (op: OperarioDetalle) => op.legajo === operario.legajo
    );

    if (operarioActualizado) {
      if (!operarioActualizado.historial) {
        operarioActualizado.historial = initializeHistorial();
      }
      operarioActualizado.historial.ascensos.push(nuevoAscenso);

      const operariosActualizados = operariosGuardados.map((op: OperarioDetalle) =>
        op.legajo === operario.legajo ? operarioActualizado : op
      );
      localStorage.setItem("operarios", JSON.stringify(operariosActualizados));

      setOperario({
        ...operario,
        historial: {
          ausencias: operario.historial?.ausencias || [],
          suspensiones: operario.historial?.suspensiones || [],
          vacaciones: operario.historial?.vacaciones || [],
          ascensos: [...(operario.historial?.ascensos || []), nuevoAscenso],
          horasExtras: operario.historial?.horasExtras || []
        }
      });
    }

    setAscensoFormData({
      fecha: "",
      cargo: "",
      departamento: ""
    });
    setOpenAscensoDialog(false);
  };

  const handleDeleteHistorialItem = () => {
    if (!operario || !itemToDelete) return;

    const operariosGuardados = JSON.parse(localStorage.getItem("operarios") || "[]");
    const operarioActualizado = operariosGuardados.find(
      (op: OperarioDetalle) => op.legajo === operario.legajo
    );

    if (operarioActualizado && operarioActualizado.historial) {
      const historialActualizado = {
        ausencias: [...(operarioActualizado.historial.ausencias || [])],
        suspensiones: [...(operarioActualizado.historial.suspensiones || [])],
        vacaciones: [...(operarioActualizado.historial.vacaciones || [])],
        ascensos: [...(operarioActualizado.historial.ascensos || [])],
        horasExtras: [...(operarioActualizado.historial.horasExtras || [])]
      };

      switch (itemToDelete.type) {
        case 'ausencia':
          historialActualizado.ausencias.splice(itemToDelete.index, 1);
          break;
        case 'suspension':
          historialActualizado.suspensiones.splice(itemToDelete.index, 1);
          break;
        case 'vacacion':
          historialActualizado.vacaciones.splice(itemToDelete.index, 1);
          break;
        case 'ascenso':
          historialActualizado.ascensos.splice(itemToDelete.index, 1);
          break;
      }

      operarioActualizado.historial = historialActualizado;
      const operariosActualizados = operariosGuardados.map((op: OperarioDetalle) =>
        op.legajo === operario.legajo ? operarioActualizado : op
      );
      localStorage.setItem("operarios", JSON.stringify(operariosActualizados));

      setOperario({
        ...operario,
        historial: historialActualizado
      });
    }

    setOpenDeleteHistorialDialog(false);
    setItemToDelete(null);
  };

  const categorias = [
    "Operario Calificado",
    "Operario Calificado A",
    "Operario Especializado",
    "Gerente",
    "Supervisor",
    "Jefe de RRHH",
    "Coordinador de RRHH",
    "Analista de RRHH",
    "Asistente de RRHH"
  ];

  const departamentos = [
    "Producción",
    "Mantenimiento",
    "Calidad",
    "Logística",
    "Recursos Humanos",
    "Administración",
    "Finanzas",
    "Comercial",
    "Sistemas",
    "Seguridad e Higiene"
  ];

  if (!operario) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5">Operario no encontrado</Typography>
      </Container>
    );
  }

  // Determinar si el currículum/título es un PDF válido (DataURL) o no
  const hasValidCurriculum = !!operario.curriculum && operario.curriculum.startsWith('data:application/pdf');
  const hasValidTitulo = !!operario.titulo && operario.titulo.startsWith('data:application/pdf');

  return (
    <motion.div initial="initial" animate="animate" variants={fadeIn}>
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1, sm: 2, md: 3 },
          mt: { xs: 0, sm: 1 },
        }}
      >
        <Box
          sx={{
            mb: { xs: 2, sm: 2.5 },
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
            flexWrap: "wrap",
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            variant="contained"
            size="medium"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              py: 1,
              px: 2,
              fontSize: "0.875rem",
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              "&:hover": {
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Volver
          </Button>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: { xs: "none", sm: "block" },
              fontSize: { xs: "24px", md: "30px" },
            }}
          >
            Perfil del Operario
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              maxWidth: "1200px",
              width: "100%",
              px: { xs: 0, sm: 1 },
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr",
                "@media (min-width: 768px)": {
                  gridTemplateColumns: "300px 1fr",
                },
                gap: { xs: 2, sm: 2.5 },
                mb: { xs: 2, sm: 2.5 },
                maxWidth: "1200px",
                width: "100%",
                mx: "auto",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: { xs: 2, sm: 2.5 },
                  width: "100%",
                  "@media (min-width: 768px)": {
                    maxWidth: "300px",
                  },
                  mx: "auto",
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                    width: "100%",
                    "@media (min-width: 768px)": {
                      maxWidth: "300px",
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: { xs: 2.5, sm: 2 },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: { xs: 2, sm: 2 },
                      background:
                        "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                      color: "white",
                      width: "100%",
                      minHeight: { xs: "250px", sm: "auto" },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        cursor: 'pointer',
                        '&:hover .edit-overlay': {
                          opacity: 1,
                        },
                      }}
                      component="label"
                    >
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileUpload('imagenPerfil')}
                      />
                      <Avatar
                        src={operario.imagenPerfil}
                        sx={{
                          width: { xs: 120, sm: 130, md: 150 },
                          height: { xs: 120, sm: 130, md: 150 },
                          border: "4px solid",
                          borderColor: "white",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Box
                        className="edit-overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          borderRadius: '50%',
                          opacity: 0,
                          transition: 'opacity 0.3s',
                        }}
                      >
                        <EditIcon sx={{ color: 'white', fontSize: '2rem' }} />
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.25rem" },
                        }}
                      >
                        {`${operario.apellido}, ${operario.nombre}`}
                      </Typography>
                      <Chip
                        label={`Legajo: ${operario.legajo}`}
                        size="small"
                        sx={{
                          mt: 1,
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                          "&:hover": {
                            bgcolor: "rgba(255,255,255,0.3)",
                          },
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          borderRadius: 2,
                        }}
                      />
                    </Box>
                  </Box>
                </Card>

                {/* Sección de botones */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 1.5, sm: 2 },
                    width: "100%",
                    "@media (min-width: 768px)": {
                      maxWidth: "300px",
                    },
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    width: '100%',
                  }}>
                    <Button
                      variant="contained"
                      startIcon={<DescriptionIcon />}
                      fullWidth
                      onClick={() => {
                        if (hasValidCurriculum) {
                          handleFileView(operario.curriculum, `curriculum_${operario.legajo}.pdf`);
                        } else {
                          document.getElementById('curriculumPdfInputPerfil')?.click();
                        }
                      }}
                      sx={{
                        borderRadius: 1,
                        textTransform: "none",
                        py: { xs: 1.5, sm: 1 },
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        background:
                          "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        "&:hover": {
                          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                          transform: "translateY(-2px)",
                        },
                        flex: 1,
                      }}
                    >
                      {hasValidCurriculum ? 'Ver Currículum' : 'Cargar Currículum'}
                    </Button>
                    <input
                      id="curriculumPdfInputPerfil"
                      type="file"
                      hidden
                      accept="application/pdf"
                      onChange={handleFileUpload('curriculum')}
                    />
                    <IconButton
                      component="label"
                      sx={{
                        bgcolor: 'background.paper',
                        border: '2px solid',
                        borderColor: 'primary.main',
                        borderRadius: 1,
                        width: { xs: 48, sm: 35 },
                        height: { xs: 48, sm: 35 },
                        '&:hover': {
                          bgcolor: 'primary.soft',
                        },
                      }}
                    >
                      <input
                        type="file"
                        hidden
                        accept="application/pdf"
                        onChange={handleFileUpload('curriculum')}
                      />
                      <EditIcon sx={{ fontSize: { xs: 24, sm: 18 }, color: 'primary.main' }} />
                    </IconButton>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    width: '100%',
                  }}>
                    <Button
                      variant="contained"
                      startIcon={<SchoolIcon />}
                      fullWidth
                      onClick={() => {
                        if (hasValidTitulo) {
                          handleFileView(operario.titulo, `titulo_${operario.legajo}.pdf`);
                        } else {
                          document.getElementById('tituloPdfInputPerfil')?.click();
                        }
                      }}
                      sx={{
                        borderRadius: 1,
                        textTransform: "none",
                        py: { xs: 1.5, sm: 1 },
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        background:
                          "linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        "&:hover": {
                          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                          transform: "translateY(-2px)",
                        },
                        flex: 1,
                      }}
                    >
                      {hasValidTitulo ? 'Ver Título' : 'Cargar Título'}
                    </Button>
                    <input
                      id="tituloPdfInputPerfil"
                      type="file"
                      hidden
                      accept="application/pdf"
                      onChange={handleFileUpload('titulo')}
                    />
                    <IconButton
                      component="label"
                      sx={{
                        bgcolor: 'background.paper',
                        border: '2px solid',
                        borderColor: 'success.main',
                        borderRadius: 1,
                        width: { xs: 48, sm: 35 },
                        height: { xs: 48, sm: 35 },
                        '&:hover': {
                          bgcolor: 'success.soft',
                        },
                      }}
                    >
                      <input
                        type="file"
                        hidden
                        accept="application/pdf"
                        onChange={handleFileUpload('titulo')}
                      />
                      <EditIcon sx={{ fontSize: { xs: 24, sm: 18 }, color: 'success.main' }} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {/* Sección de información personal */}
              <Box
                sx={{
                  width: "100%",
                  mt: 2,
                  "@media (min-width: 768px)": {
                    mt: 0,
                  },
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                    height: "100%",
                  }}
                >
                  <CardContent
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: { xs: 2, sm: 2.5 },
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          background:
                            "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
                        }}
                      >
                        Información Personal
                      </Typography>
                      <Tooltip title="Editar perfil">
                        <IconButton
                          color="primary"
                          size="small"
                          sx={{
                            "&:hover": {
                              transform: "rotate(15deg)",
                              transition: "transform 0.2s",
                              background:
                                "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                              color: "white",
                            },
                          }}
                          onClick={handleEditClick}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                        gap: 2,
                      }}
                    >
                      <InfoItem
                        icon={<PersonIcon />}
                        label="DNI"
                        value={operario.dni}
                        type="dni"
                      />
                      <InfoItem
                        icon={<BadgeIcon />}
                        label="CUIL"
                        value={operario.cuil}
                        type="cuil"
                      />
                      <InfoItem
                        icon={<CalendarIcon />}
                        label="Fecha de Nacimiento"
                        value={operario.fechaNacimiento}
                        type="fechaNacimiento"
                      />
                      <InfoItem
                        icon={<EventIcon />}
                        label="Fecha de Ingreso"
                        value={operario.fechaIngreso}
                        type="fechaIngreso"
                      />
                      <InfoItem
                        icon={<WorkIcon />}
                        label="Categoría"
                        value={operario.categoria}
                        type="categoria"
                      />
                      <InfoItem
                        icon={<BusinessIcon />}
                        label="Sector"
                        value={operario.sector || "No especificado"}
                        type="departamento"
                      />
                      <InfoItem
                        icon={<DescriptionIcon />}
                        label="Obra Social"
                        value={operario.obraSocial}
                        type="obraSocial"
                      />
                      <InfoItem
                        icon={<WorkIcon />}
                        label="Afiliado al Sindicato"
                        value={operario.afiliadoSindicato ? "Sí" : "No"}
                        type="afiliadoSindicato"
                      />
                      <InfoItem
                        icon={<BusinessIcon />}
                        label="Tipo de Contratación"
                        value={operario.tipoContratacion}
                        type="tipoContratacion"
                      />
                      <InfoItem
                        icon={<AccessTimeIcon />}
                        label="Sueldo por Hora"
                        value={`$${operario.sueldoPorHora.toLocaleString()}`}
                        type="sueldoPorHora"
                      />
                      <InfoItem
                        icon={<AccessTimeIcon />}
                        label="Valor Hora No Rem"
                        value={`$${operario.valorHoraNoRem?.toLocaleString() || '0'}`}
                        type="valorHoraNoRem"
                      />
                      <InfoItem
                        icon={operario.estado === "activo" ? <CheckCircleIcon /> : <CancelIcon />}
                        label="Estado"
                        value={operario.estado === "activo" ? "Activo" : "Inactivo"}
                        type="estado"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Sección de Historial Laboral */}
            <Box>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 }, width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 4,
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        background:
                          "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Historial Laboral
                    </Typography>
                  </Box>

                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      allowScrollButtonsMobile
                      sx={{
                        "& .MuiTab-root": {
                          minHeight: 64,
                          fontSize: "1rem",
                          textTransform: "none",
                          fontWeight: 500,
                          minWidth: { xs: "auto", sm: "160px" },
                          px: { xs: 1, sm: 2 },
                        },
                        "& .Mui-selected": {
                          fontWeight: 700,
                          color: (theme) => {
                            switch (tabValue) {
                              case 0: return '#d32f2f'; // Rojo para Ausencias
                              case 1: return '#ed6c02'; // Naranja para Suspensiones
                              case 2: return '#2e7d32'; // Verde para Vacaciones
                              case 3: return '#9c27b0'; // Púrpura para Ascensos
                              case 4: return '#1976d2'; // Azul para Horas Extras
                              case 5: return '#00796b'; // Verde azulado para Recibos
                              default: return '#1976d2';
                            }
                          },
                        },
                        "& .MuiTabs-scrollButtons": {
                          color: "#2196F3",
                          "&.Mui-disabled": {
                            opacity: 0.3,
                          },
                        },
                        "& .MuiTabs-indicator": {
                          height: 3,
                          borderRadius: "3px 3px 0 0",
                          background: (theme) => {
                            switch (tabValue) {
                              case 0: return 'linear-gradient(45deg, #d32f2f 30%, #ef5350 90%)';
                              case 1: return 'linear-gradient(45deg, #ed6c02 30%, #ff9800 90%)';
                              case 2: return 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)';
                              case 3: return 'linear-gradient(45deg, #9c27b0 30%, #e040fb 90%)';
                              case 4: return 'linear-gradient(45deg, #1976d2 30%, #2196F3 90%)';
                              default: return 'linear-gradient(45deg, #1976d2 30%, #2196F3 90%)';
                            }
                          }
                        },
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          right: 0,
                          top: 0,
                          bottom: 0,
                          width: "40px",
                          background:
                            "linear-gradient(90deg, transparent, white)",
                          pointerEvents: "none",
                          display: { xs: "block", sm: "none" },
                        },
                      }}
                    >
                      <Tab
                        icon={<EventIcon sx={{ fontSize: 28 }} />}
                        label="Ausencias"
                        iconPosition="start"
                        sx={{
                          color: tabValue === 0 ? '#d32f2f' : 'inherit',
                          '&.Mui-selected': {
                            color: '#d32f2f',
                          }
                        }}
                      />
                      <Tab
                        icon={<WarningIcon sx={{ fontSize: 28 }} />}
                        label="Suspensiones"
                        iconPosition="start"
                        sx={{
                          color: tabValue === 1 ? '#ed6c02' : 'inherit',
                          '&.Mui-selected': {
                            color: '#ed6c02',
                          }
                        }}
                      />
                      <Tab
                        icon={<BeachIcon sx={{ fontSize: 28 }} />}
                        label="Vacaciones"
                        iconPosition="start"
                        sx={{
                          color: tabValue === 2 ? '#2e7d32' : 'inherit',
                          '&.Mui-selected': {
                            color: '#2e7d32',
                          }
                        }}
                      />
                      <Tab
                        icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
                        label="Ascensos"
                        iconPosition="start"
                        sx={{
                          color: tabValue === 3 ? '#9c27b0' : 'inherit',
                          '&.Mui-selected': {
                            color: '#9c27b0',
                          }
                        }}
                      />
                      <Tab
                        icon={<ReceiptIcon sx={{ fontSize: 28 }} />}
                        label="Recibos"
                        iconPosition="start"
                        sx={{
                          color: tabValue === 4 ? '#1976d2' : 'inherit',
                          '&.Mui-selected': {
                            color: '#1976d2',
                          }
                        }}
                      />
                    </Tabs>
                  </Box>

                  <TabPanel value={tabValue} index={0}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mb: 2,
                      }}
                    >
                      <Button
                        onClick={() => setOpenAusenciaDialog(true)}
                        variant="contained"
                        startIcon={<EventIcon />}
                        size="medium"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          py: 1,
                          px: 2,
                          fontSize: "0.875rem",
                          background: "linear-gradient(45deg, #d32f2f 30%, #ef5350 90%)",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          "&:hover": {
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        Agregar Ausencia
                      </Button>
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "1fr 1fr",
                          md: "1fr 1fr",
                        },
                        gap: 3,
                        mt: 3,
                      }}
                    >
                      {(!operario?.historial?.ausencias || operario.historial.ausencias.length === 0) ? (
                        <EmptyStateBox 
                          icon={EventIcon} 
                          message="El operario no registra ausencias" 
                        />
                      ) : (
                        operario.historial.ausencias.map((ausencia, index) => (
                          <Box
                            key={index}
                            sx={{
                              p: 4,
                              borderRadius: "16px",
                              backgroundColor: "white",
                              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                              border: "1px solid",
                              borderColor: "rgba(0, 0, 0, 0.08)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                mb: 3,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: "12px",
                                  backgroundColor: "error.soft",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "error.main",
                                }}
                              >
                                <CalendarIcon sx={{ fontSize: 24 }} />
                              </Box>
                              <Box>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 600,
                                    color: "text.primary",
                                    fontSize: "1.1rem",
                                    mb: 0.5,
                                  }}
                                >
                                  {ausencia.motivo}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "text.secondary",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {new Date(ausencia.fecha).toLocaleDateString(
                                    "es-AR",
                                    {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )}
                                </Typography>
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                pt: 2,
                                borderTop: "1px dashed rgba(145, 158, 171, 0.24)",
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.875rem",
                                  fontWeight: 500,
                                }}
                              >
                                Duración
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                  label={ausencia.duracion}
                                  color="error"
                                  variant="filled"
                                  size="small"
                                  sx={{
                                    borderRadius: "8px",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                    py: 0.5,
                                    px: 1,
                                  }}
                                />
                                <IconButton
                                  onClick={() => {
                                    setItemToDelete({ type: 'ausencia', index });
                                    setOpenDeleteHistorialDialog(true);
                                  }}
                                  size="small"
                                  sx={{
                                    color: "error.main",
                                    "&:hover": {
                                      backgroundColor: "error.lighter",
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          </Box>
                        ))
                      )}
                    </Box>
                  </TabPanel>

                  <TabPanel value={tabValue} index={1}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mb: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<WarningIcon />}
                        size="medium"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          py: 1,
                          px: 2,
                          fontSize: "0.875rem",
                          background: "linear-gradient(45deg, #ff9800 30%, #ffc107 90%)",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          "&:hover": {
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                            transform: "translateY(-2px)",
                          },
                        }}
                        onClick={() => setOpenSuspensionDialog(true)}
                      >
                        Agregar Suspensión
                      </Button>
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "1fr 1fr",
                          md: "1fr 1fr",
                        },
                        gap: 3,
                        mt: 3,
                      }}
                    >
                      {(!operario?.historial?.suspensiones || operario.historial.suspensiones.length === 0) ? (
                        <EmptyStateBox 
                          icon={WarningIcon} 
                          message="El operario no registra suspensiones" 
                        />
                      ) : (
                        operario.historial.suspensiones.map((suspension, index) => (
                          <Box
                            key={index}
                            sx={{
                              p: 4,
                              borderRadius: "16px",
                              backgroundColor: "white",
                              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                              border: "1px solid",
                              borderColor: "rgba(0, 0, 0, 0.08)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                mb: 3,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: "12px",
                                  backgroundColor: "warning.soft",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "warning.main",
                                }}
                              >
                                <WarningIcon sx={{ fontSize: 24 }} />
                              </Box>
                              <Box>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 600,
                                    color: "text.primary",
                                    fontSize: "1.1rem",
                                    mb: 0.5,
                                  }}
                                >
                                  {suspension.motivo}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "text.secondary",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {new Date(suspension.fecha).toLocaleDateString(
                                    "es-AR",
                                    {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )}
                                </Typography>
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                pt: 2,
                                borderTop: "1px dashed rgba(145, 158, 171, 0.24)",
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.875rem",
                                  fontWeight: 500,
                                }}
                              >
                                Duración
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                  label={suspension.duracion}
                                  color="warning"
                                  variant="filled"
                                  size="small"
                                  sx={{
                                    borderRadius: "8px",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                    py: 0.5,
                                    px: 1,
                                  }}
                                />
                                <IconButton
                                  onClick={() => {
                                    setItemToDelete({ type: 'suspension', index });
                                    setOpenDeleteHistorialDialog(true);
                                  }}
                                  size="small"
                                  sx={{
                                    color: "warning.main",
                                    "&:hover": {
                                      backgroundColor: "warning.lighter",
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          </Box>
                        ))
                      )}
                    </Box>
                  </TabPanel>

                  <TabPanel value={tabValue} index={2}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ color: "text.secondary" }}>
                        Días disponibles: {calcularDiasVacaciones(operario?.fechaIngreso || "")} días
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<BeachIcon />}
                        size="medium"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          py: 1,
                          px: 2,
                          fontSize: "0.875rem",
                          background: "linear-gradient(45deg, #4caf50 30%, #81c784 90%)",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          "&:hover": {
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                            transform: "translateY(-2px)",
                          },
                        }}
                        onClick={() => setOpenVacacionesDialog(true)}
                      >
                        Asignar Vacaciones
                      </Button>
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "1fr 1fr",
                          md: "1fr 1fr",
                        },
                        gap: 3,
                        mt: 3,
                      }}
                    >
                      {(!operario?.historial?.vacaciones || operario.historial.vacaciones.length === 0) ? (
                        <EmptyStateBox 
                          icon={BeachIcon} 
                          message="El operario no registra vacaciones" 
                        />
                      ) : (
                        operario.historial.vacaciones.map((vacacion, index) => (
                          <Box
                            key={index}
                            sx={{
                              p: 4,
                              borderRadius: "16px",
                              backgroundColor: "white",
                              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                              border: "1px solid",
                              borderColor: "rgba(0, 0, 0, 0.08)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                mb: 3,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: "12px",
                                  backgroundColor: "success.soft",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "success.main",
                                }}
                              >
                                <BeachIcon sx={{ fontSize: 24 }} />
                              </Box>
                              <Box>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 600,
                                    color: "text.primary",
                                    fontSize: "1.1rem",
                                    mb: 0.5,
                                  }}
                                >
                                  Período Vacacional
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "text.secondary",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {new Date(vacacion.fecha).toLocaleDateString(
                                    "es-AR",
                                    {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )}
                                </Typography>
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                pt: 2,
                                borderTop: "1px dashed rgba(145, 158, 171, 0.24)",
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.875rem",
                                  fontWeight: 500,
                                }}
                              >
                                Duración
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                  label={vacacion.duracion}
                                  color="success"
                                  variant="filled"
                                  size="small"
                                  sx={{
                                    borderRadius: "8px",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                    py: 0.5,
                                    px: 1,
                                  }}
                                />
                                <IconButton
                                  onClick={() => {
                                    setItemToDelete({ type: 'vacacion', index });
                                    setOpenDeleteHistorialDialog(true);
                                  }}
                                  size="small"
                                  sx={{
                                    color: "success.main",
                                    "&:hover": {
                                      backgroundColor: "success.lighter",
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          </Box>
                        ))
                      )}
                    </Box>
                  </TabPanel>

                  <TabPanel value={tabValue} index={3}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mb: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<TrendingUpIcon />}
                        size="medium"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          py: 1,
                          px: 2,
                          fontSize: "0.875rem",
                          background: "linear-gradient(45deg, #9c27b0 30%, #d500f9 90%)",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          "&:hover": {
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                            transform: "translateY(-2px)",
                          },
                        }}
                        onClick={() => setOpenAscensoDialog(true)}
                      >
                        Registrar Ascenso
                      </Button>
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "1fr 1fr",
                          md: "1fr 1fr",
                        },
                        gap: 3,
                        mt: 3,
                      }}
                    >
                      {(!operario?.historial?.ascensos || operario.historial.ascensos.length === 0) ? (
                        <EmptyStateBox 
                          icon={TrendingUpIcon} 
                          message="El operario no registra ascensos" 
                        />
                      ) : (
                        operario.historial.ascensos.map((ascenso, index) => (
                          <Box
                            key={index}
                            sx={{
                              p: 4,
                              borderRadius: "16px",
                              backgroundColor: "white",
                              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                              border: "1px solid",
                              borderColor: "rgba(0, 0, 0, 0.08)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                mb: 3,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: "12px",
                                  backgroundColor: "info.soft",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "info.main",
                                }}
                              >
                                <TrendingUpIcon sx={{ fontSize: 24 }} />
                              </Box>
                              <Box>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 600,
                                    color: "text.primary",
                                    fontSize: "1.1rem",
                                    mb: 0.5,
                                  }}
                                >
                                  {ascenso.cargo}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "text.secondary",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {new Date(ascenso.fecha).toLocaleDateString(
                                    "es-AR",
                                    {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )}
                                </Typography>
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                pt: 2,
                                borderTop: "1px dashed rgba(145, 158, 171, 0.24)",
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.875rem",
                                  fontWeight: 500,
                                }}
                              >
                                Departamento
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                  label={ascenso.departamento}
                                  color="info"
                                  variant="filled"
                                  size="small"
                                  sx={{
                                    borderRadius: "8px",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                    py: 0.5,
                                    px: 1,
                                  }}
                                />
                                <IconButton
                                  onClick={() => {
                                    setItemToDelete({ type: 'ascenso', index });
                                    setOpenDeleteHistorialDialog(true);
                                  }}
                                  size="small"
                                  sx={{
                                    color: "info.main",
                                    "&:hover": {
                                      backgroundColor: "info.lighter",
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          </Box>
                        ))
                      )}
                    </Box>
                  </TabPanel>

                  <TabPanel value={tabValue} index={4}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mb: 2,
                        }}
                      >
                        <Button
                          variant="contained"
                          startIcon={<ReceiptIcon />}
                          size="medium"
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            py: 1,
                            px: 2,
                            fontSize: "0.875rem",
                            background: "linear-gradient(45deg, #1976d2 30%, #2196F3 90%)",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            "&:hover": {
                              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                              transform: "translateY(-2px)",
                            },
                          }}
                          onClick={() => setOpenRecibo(true)}
                        >
                          Generar Recibo
                        </Button>
                      </Box>

                      {/* Modal para generar recibo */}
                      <Dialog
                        open={openRecibo}
                        onClose={() => setOpenRecibo(false)}
                        maxWidth="xl"
                        fullWidth
                        PaperProps={{
                          sx: {
                            borderRadius: 4,
                            maxHeight: "90vh",
                            overflowY: "auto",
                          },
                        }}
                      >
                        <DialogTitle
                          sx={{
                            background:
                              "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                            color: "white",
                            fontWeight: 600,
                            fontSize: "1.5rem",
                            py: 2,
                          }}
                        >
                          Generar Recibo
                        </DialogTitle>
                        <DialogContent sx={{ p: 3 }}>
                          <FormularioRecibo
                            onSubmit={(empleado) => {
                              setEmpleado(empleado);
                              setOpenRecibo(false);
                              router.push("/recibo");
                            }}
                            initialData={{
                              legajo: operario.legajo.toString(),
                              apellido: operario.apellido,
                              nombre: operario.nombre,
                              segundoNombre: operario.segundoNombre || "",
                              mesAnio: new Date().toISOString().slice(0, 7),
                              afiliado: operario.afiliadoSindicato ? "Si" : "No",
                              valorHoraNormal: operario.sueldoPorHora.toString(),
                              valorHoraNoRem: operario.valorHoraNoRem?.toString() || "0",
                              fechaIngreso: operario.fechaIngreso,
                              obraSocial: operario.obraSocial,
                              cuil: operario.cuil,
                              formaContratacion: operario.tipoContratacion,
                              seccion: operario.sector || '',
                              calificacion: operario.categoria,
                              sueldoBasico: operario.sueldoPorHora.toString(),
                              sueldoNoRem: operario.valorHoraNoRem.toString(),
                              nombreCompleto: `${operario.apellido} ${operario.nombre} ${operario.segundoNombre || ''}`.trim(),
                              periodoPago: new Date().toLocaleString('es-AR', { month: 'long', year: 'numeric' })
                            }}
                            legajo={operario.legajo.toString()}
                            disableAfiliado={true}
                          />
                        </DialogContent>
                      </Dialog>

                      {/* Lista de recibos */}
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            "@media (min-width: 769px)": {
                              gridTemplateColumns: "repeat(2, 1fr)",
                            },
                          },
                          gap: 3,
                        }}
                      >
                        {(() => {
                          if (historialRecibos.length === 0) {
                            return (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  minHeight: "200px",
                                  bgcolor: "background.paper",
                                  borderRadius: 2,
                                  p: 4,
                                  border: "1px dashed",
                                  borderColor: "divider",
                                  gridColumn: "1 / -1",
                                }}
                              >
                                <ReceiptIcon
                                  sx={{
                                    fontSize: 48,
                                    color: "text.secondary",
                                    mb: 2,
                                  }}
                                />
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: "text.secondary",
                                    textAlign: "center",
                                    mb: 1,
                                  }}
                                >
                                  No hay recibos generados
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "text.secondary",
                                    textAlign: "center",
                                  }}
                                >
                                  Utiliza el botón "Generar Recibo" para crear un
                                  nuevo recibo
                                </Typography>
                              </Box>
                            );
                          }

                          return [...historialRecibos].reverse().map(
                            (recibo: Recibo, index: number) => {
                              console.log("Recibo completo:", recibo);
                              console.log(
                                "Datos completos:",
                                recibo.datosCompletos
                              );

                              return (
                                <Box
                                  key={index}
                                  onClick={() => handleReciboClick(recibo)}
                                  sx={{
                                    p: 0,
                                    borderRadius: 4,
                                    transition: "all 0.3s ease",
                                    cursor: "pointer",
                                    position: "relative",
                                    overflow: "hidden",
                                    background: "white",
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                                    "&:hover": {
                                      transform: "translateY(-4px)",
                                      boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
                                      "& .recibo-header": {
                                        background: "linear-gradient(45deg, #1976d2 30%, #2196F3 90%)",
                                        "& .recibo-periodo, & .recibo-icon, & .recibo-fecha": {
                                          color: "white",
                                        },
                                      },
                                    },
                                  }}
                                >
                                  {/* Header con gradiente */}
                                  <Box
                                    className="recibo-header"
                                    sx={{
                                      p: 2.5,
                                      background: "linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)",
                                      transition: "all 0.3s ease",
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                      }}
                                    >
                                      <ReceiptIcon
                                        className="recibo-icon"
                                        sx={{
                                          fontSize: 24,
                                          color: "#1976d2",
                                          transition: "all 0.3s ease",
                                        }}
                                      />
                                      <Typography
                                        className="recibo-periodo"
                                        variant="h6"
                                        sx={{
                                          fontWeight: 600,
                                          color: "#1976d2",
                                          fontSize: "1.1rem",
                                          transition: "all 0.3s ease",
                                        }}
                                      >
                                        Recibo de {recibo.periodo}
                                      </Typography>
                                    </Box>
                                    <Typography
                                      variant="body2"
                                      className="recibo-fecha"
                                      sx={{
                                        color: "#1976d2",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        fontSize: "0.9rem",
                                        fontWeight: 500,
                                        transition: "all 0.3s ease",
                                      }}
                                    >
                                      <CalendarIcon sx={{ fontSize: 18 }} />
                                      {recibo.fecha}
                                    </Typography>
                                  </Box>

                                  {/* Contenido principal */}
                                  <Box sx={{ p: 2.5 }}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 2,
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          color: "text.secondary",
                                          fontSize: "0.9rem",
                                          fontWeight: 500,
                                        }}
                                      >
                                        Neto a Cobrar
                                      </Typography>
                                      <Typography
                                        variant="h5"
                                        sx={{
                                          fontWeight: 700,
                                          color: "#1976d2",
                                          fontSize: "1.5rem",
                                        }}
                                      >
                                        ${calcularTotal(recibo)}
                                      </Typography>
                                    </Box>

                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        pt: 1,
                                        borderTop: "1px dashed",
                                        borderColor: "divider",
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          color: "text.secondary",
                                          fontSize: "0.8rem",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                        }}
                                      >
                                        <ReceiptIcon
                                          sx={{ fontSize: 16, color: "#1976d2" }}
                                        />
                                        Ver detalle del recibo
                                      </Typography>
                                      <IconButton
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEliminarRecibo(index);
                                        }}
                                        size="small"
                                        sx={{
                                          width: "24px",
                                          height: "24px",
                                          "&:hover": {
                                            color: "#d32f2f",
                                          },
                                          "& .MuiSvgIcon-root": {
                                            fontSize: "1rem",
                                          },
                                        }}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Box>
                                  </Box>
                                </Box>
                              );
                            }
                          );
                        })()}
                      </Box>
                    </Box>
                  </TabPanel>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>

        {/* Diálogo de confirmación de eliminación */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              minWidth: { xs: "90%", sm: "400px" },
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: "#f8f9fa",
              borderBottom: "1px solid #e9ecef",
              py: 2.5,
              px: 3,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <WarningIcon sx={{ color: "#dc3545", fontSize: "1.5rem" }} />
            <Box
              sx={{
                fontWeight: 600,
                color: "#212529",
                fontSize: "1.1rem",
              }}
            >
              Confirmar eliminación
            </Box>
          </DialogTitle>
          <DialogContent
            sx={{
              py: 3,
              px: 3,
              bgcolor: "#fff",
            }}
          >
            <DialogContentText
              sx={{
                color: "#495057",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                mb: 1,
              }}
            >
              Se eliminará el recibo. Esta acción no se puede deshacer. ¿Desea continuar?
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              px: 3,
              py: 2.5,
              gap: 1.5,
              bgcolor: "#f8f9fa",
              borderTop: "1px solid #e9ecef",
            }}
          >
            <Button
              onClick={() => setOpenDeleteDialog(false)}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                borderWidth: 1.5,
                px: 3,
                py: 1,
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "#495057",
                borderColor: "#dee2e6",
                "&:hover": {
                  borderWidth: 1.5,
                  borderColor: "#adb5bd",
                  bgcolor: "#f8f9fa",
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmarEliminacion}
              variant="contained"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                py: 1,
                fontSize: "0.9rem",
                fontWeight: 500,
                bgcolor: "#dc3545",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#c82333",
                  boxShadow: "none",
                },
              }}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal para editar información personal */}
        <Dialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              maxHeight: "90vh",
              overflowY: "auto"
            }
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              color: "white",
              fontWeight: 600,
              fontSize: "1.5rem",
              py: 2
            }}
          >
            Editar Información Personal
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(2, 1fr)", pt: 2 }}>
              <TextField
                label="Nombre"
                value={editFormData.nombre || ""}
                onChange={(e) => handleEditFormChange("nombre", e.target.value)}
                fullWidth
              />
              <TextField
                label="Segundo Nombre"
                value={editFormData.segundoNombre || ""}
                onChange={(e) => handleEditFormChange("segundoNombre", e.target.value)}
                fullWidth
              />
              <TextField
                label="Apellido"
                value={editFormData.apellido || ""}
                onChange={(e) => handleEditFormChange("apellido", e.target.value)}
                fullWidth
              />
              <TextField
                label="DNI"
                value={editFormData.dni || ""}
                onChange={(e) => handleEditFormChange("dni", e.target.value)}
                fullWidth
              />
              <TextField
                label="CUIL"
                value={editFormData.cuil || ""}
                onChange={(e) => handleEditFormChange("cuil", e.target.value)}
                fullWidth
              />
              <TextField
                label="Fecha de Nacimiento"
                value={editFormData.fechaNacimiento || ""}
                onChange={(e) => handleEditFormChange("fechaNacimiento", e.target.value)}
                fullWidth
                type="text"
                placeholder="DD/MM/AAAA"
              />
              <TextField
                label="Fecha de Ingreso"
                value={editFormData.fechaIngreso || ""}
                onChange={(e) => handleEditFormChange("fechaIngreso", e.target.value)}
                fullWidth
                type="text"
                placeholder="DD/MM/AAAA"
              />
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={editFormData.categoria || ""}
                  onChange={(e) => handleEditFormChange("categoria", e.target.value)}
                  label="Categoría"
                >
                  <MenuItem value="Operario Calificado">Operario Calificado</MenuItem>
                  <MenuItem value="Operario Calificado A">Operario Calificado A</MenuItem>
                  <MenuItem value="Operario Especializado">Operario Especializado</MenuItem>
                  <MenuItem value="Gerente">Gerente</MenuItem>
                  <MenuItem value="Supervisor">Supervisor</MenuItem>
                  <MenuItem value="Jefe de RRHH">Jefe de RRHH</MenuItem>
                  <MenuItem value="Coordinador de RRHH">Coordinador de RRHH</MenuItem>
                  <MenuItem value="Analista de RRHH">Analista de RRHH</MenuItem>
                  <MenuItem value="Asistente de RRHH">Asistente de RRHH</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Sector"
                value={editFormData.sector || ""}
                onChange={(e) => handleEditFormChange("sector", e.target.value)}
                fullWidth
              />
              <TextField
                label="Obra Social"
                value={editFormData.obraSocial || ""}
                onChange={(e) => handleEditFormChange("obraSocial", e.target.value)}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Afiliado al Sindicato</InputLabel>
                <Select
                  value={editFormData.afiliadoSindicato ? "true" : "false"}
                  onChange={(e) => handleEditFormChange("afiliadoSindicato", e.target.value === "true")}
                  label="Afiliado al Sindicato"
                >
                  <MenuItem value="true">Sí</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Tipo de Contratación"
                value={editFormData.tipoContratacion || ""}
                onChange={(e) => handleEditFormChange("tipoContratacion", e.target.value)}
                fullWidth
              />
              <TextField
                label="URL del Título"
                value={editFormData.titulo || ""}
                onChange={(e) => handleEditFormChange("titulo", e.target.value)}
                fullWidth
                placeholder="https://ejemplo.com/titulo.pdf"
              />
              <TextField
                label="Sueldo por Hora"
                value={editFormData.sueldoPorHora || ""}
                onChange={(e) => handleEditFormChange("sueldoPorHora", Number(e.target.value))}
                fullWidth
                type="number"
              />
              <TextField
                label="Valor Hora No Rem"
                value={editFormData.valorHoraNoRem || ""}
                onChange={(e) => handleEditFormChange("valorHoraNoRem", Number(e.target.value))}
                fullWidth
                type="number"
              />
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={editFormData.estado || "activo"}
                  onChange={(e) => handleEditFormChange("estado", e.target.value)}
                  label="Estado"
                >
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => setOpenEditDialog(false)}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                borderWidth: 1.5,
                px: 3,
                py: 1,
                fontSize: "0.9rem",
                fontWeight: 500
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEditSave}
              variant="contained"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                py: 1,
                fontSize: "0.9rem",
                fontWeight: 500,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              Guardar Cambios
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal para agregar ausencia */}
        <Dialog
          open={openAusenciaDialog}
          onClose={() => setOpenAusenciaDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              maxHeight: "90vh",
              overflowY: "auto"
            }
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              color: "white",
              fontWeight: 600,
              fontSize: "1.5rem",
              py: 2
            }}
          >
            Agregar Nueva Ausencia
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
              <TextField
                label="Fecha"
                type="date"
                value={ausenciaFormData.fecha}
                onChange={(e) => handleAusenciaFormChange("fecha", e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Motivo"
                value={ausenciaFormData.motivo}
                onChange={(e) => handleAusenciaFormChange("motivo", e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                label="Duración (días)"
                type="number"
                value={ausenciaFormData.duracion}
                onChange={(e) => handleAusenciaFormChange("duracion", e.target.value)}
                fullWidth
                InputProps={{
                  inputProps: { min: 1 }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => setOpenAusenciaDialog(false)}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                borderWidth: 1.5,
                px: 3,
                py: 1,
                fontSize: "0.9rem",
                fontWeight: 500
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAgregarAusencia}
              variant="contained"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                py: 1,
                fontSize: "0.9rem",
                fontWeight: 500,
                background: "linear-gradient(45deg, #d32f2f 30%, #ef5350 90%)",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              Agregar Ausencia
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal para agregar suspensión */}
        <Dialog
          open={openSuspensionDialog}
          onClose={() => setOpenSuspensionDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              maxHeight: "90vh",
              overflowY: "auto"
            }
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(45deg, #ff9800 30%, #ffc107 90%)",
              color: "white",
              fontWeight: 600,
              fontSize: "1.5rem",
              py: 2
            }}
          >
            Agregar Nueva Suspensión
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
              <TextField
                label="Fecha"
                type="date"
                value={suspensionFormData.fecha}
                onChange={(e) => handleSuspensionFormChange("fecha", e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Motivo"
                value={suspensionFormData.motivo}
                onChange={(e) => handleSuspensionFormChange("motivo", e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                label="Duración (días)"
                type="number"
                value={suspensionFormData.duracion}
                onChange={(e) => handleSuspensionFormChange("duracion", e.target.value)}
                fullWidth
                InputProps={{
                  inputProps: { min: 1 }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => setOpenSuspensionDialog(false)}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                borderWidth: 1.5,
                px: 3,
                py: 1,
                fontSize: "0.9rem",
                fontWeight: 500
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAgregarSuspension}
              variant="contained"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                py: 1,
                fontSize: "0.9rem",
                fontWeight: 500,
                background: "linear-gradient(45deg, #ff9800 30%, #ffc107 90%)",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              Agregar Suspensión
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal para asignar vacaciones */}
        <Dialog
          open={openVacacionesDialog}
          onClose={() => setOpenVacacionesDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              maxHeight: "90vh",
              overflowY: "auto"
            }
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(45deg, #4caf50 30%, #81c784 90%)",
              color: "white",
              fontWeight: 600,
              fontSize: "1.5rem",
              py: 2
            }}
          >
            Asignar Vacaciones
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Días disponibles según antigüedad: {calcularDiasVacaciones(operario?.fechaIngreso || "")} días
              </Typography>
              <TextField
                label="Fecha de inicio"
                type="date"
                value={vacacionesFormData.fecha}
                onChange={(e) => handleVacacionesFormChange("fecha", e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Duración (días)"
                type="number"
                value={vacacionesFormData.duracion}
                onChange={(e) => handleVacacionesFormChange("duracion", e.target.value)}
                fullWidth
                InputProps={{
                  inputProps: { 
                    min: 1,
                    max: calcularDiasVacaciones(operario?.fechaIngreso || "")
                  }
                }}
                helperText={`Máximo ${calcularDiasVacaciones(operario?.fechaIngreso || "")} días`}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => setOpenVacacionesDialog(false)}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                borderWidth: 1.5,
                px: 3,
                py: 1,
                fontSize: "0.9rem",
                fontWeight: 500
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAgregarVacaciones}
              variant="contained"
              disabled={
                !vacacionesFormData.fecha ||
                !vacacionesFormData.duracion ||
                Number(vacacionesFormData.duracion) > calcularDiasVacaciones(operario?.fechaIngreso || "")
              }
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                py: 1,
                fontSize: "0.9rem",
                fontWeight: 500,
                background: "linear-gradient(45deg, #4caf50 30%, #81c784 90%)",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              Asignar Vacaciones
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal para registrar ascenso */}
        <Dialog
          open={openAscensoDialog}
          onClose={() => setOpenAscensoDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              maxHeight: "90vh",
              overflowY: "auto"
            }
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(45deg, #9c27b0 30%, #d500f9 90%)",
              color: "white",
              fontWeight: 600,
              fontSize: "1.5rem",
              py: 2
            }}
          >
            Registrar Nuevo Ascenso
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
              <TextField
                label="Fecha"
                type="date"
                value={ascensoFormData.fecha}
                onChange={(e) => handleAscensoFormChange("fecha", e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControl fullWidth>
                <InputLabel>Nuevo Cargo</InputLabel>
                <Select
                  value={ascensoFormData.cargo}
                  onChange={(e) => handleAscensoFormChange("cargo", e.target.value)}
                  label="Nuevo Cargo"
                >
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria} value={categoria}>
                      {categoria}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Departamento</InputLabel>
                <Select
                  value={ascensoFormData.departamento}
                  onChange={(e) => handleAscensoFormChange("departamento", e.target.value)}
                  label="Departamento"
                >
                  {departamentos.map((departamento) => (
                    <MenuItem key={departamento} value={departamento}>
                      {departamento}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => setOpenAscensoDialog(false)}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                borderWidth: 1.5,
                px: 3,
                py: 1,
                fontSize: "0.9rem",
                fontWeight: 500
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAgregarAscenso}
              variant="contained"
              disabled={!ascensoFormData.fecha || !ascensoFormData.cargo || !ascensoFormData.departamento}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                py: 1,
                fontSize: "0.9rem",
                fontWeight: 500,
                background: "linear-gradient(45deg, #9c27b0 30%, #d500f9 90%)",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              Registrar Ascenso
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo de confirmación de eliminación para elementos del historial */}
        <Dialog
          open={openDeleteHistorialDialog}
          onClose={() => {
            setOpenDeleteHistorialDialog(false);
            setItemToDelete(null);
          }}
          PaperProps={{
            sx: {
              borderRadius: 3,
              minWidth: { xs: "90%", sm: "400px" },
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: "#f8f9fa",
              borderBottom: "1px solid #e9ecef",
              py: 2.5,
              px: 3,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <WarningIcon sx={{ color: "#dc3545", fontSize: "1.5rem" }} />
            <Box
              sx={{
                fontWeight: 600,
                color: "#212529",
                fontSize: "1.1rem",
              }}
            >
              Confirmar eliminación
            </Box>
          </DialogTitle>
          <DialogContent
            sx={{
              py: 3,
              px: 3,
              bgcolor: "#fff",
            }}
          >
            <DialogContentText
              sx={{
                color: "#495057",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                mb: 1,
              }}
            >
              {`¿Está seguro que desea eliminar este registro? Esta acción no se puede deshacer.`}
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              px: 3,
              py: 2.5,
              gap: 1.5,
              bgcolor: "#f8f9fa",
              borderTop: "1px solid #e9ecef",
            }}
          >
            <Button
              onClick={() => {
                setOpenDeleteHistorialDialog(false);
                setItemToDelete(null);
              }}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                borderWidth: 1.5,
                px: 3,
                py: 1,
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "#495057",
                borderColor: "#dee2e6",
                "&:hover": {
                  borderWidth: 1.5,
                  borderColor: "#adb5bd",
                  bgcolor: "#f8f9fa",
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteHistorialItem}
              variant="contained"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                py: 1,
                fontSize: "0.9rem",
                fontWeight: 500,
                bgcolor: "#dc3545",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#c82333",
                  boxShadow: "none",
                },
              }}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </motion.div>
  );
}

