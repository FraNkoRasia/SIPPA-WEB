"use client";

import React, { useState, useEffect } from "react";
import { procesarDatosEmpleado, generarConceptos } from "@/utils/calculosRecibo";
import { EmpleadoData as FormData } from "@/context/FormContext";
import { FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';
import { toast } from 'sonner';

interface FormularioReciboProps {
  onSubmit: (empleado: FormData) => void;
  initialData?: Partial<FormData>;
  disableAfiliado?: boolean;
  legajo?: string;
}

const FormularioRecibo = ({ onSubmit, initialData, disableAfiliado = false, legajo }: FormularioReciboProps) => {
  const [formData, setFormData] = useState<FormData>({
    legajo: "",
    apellido: "",
    nombre: "",
    segundoNombre: "",
    cuil: "",
    fechaIngreso: "",
    periodoPago: "",
    obraSocial: "",
    sindicato: "",
    formaContratacion: "",
    seccion: "",
    calificacion: "",
    valorHoraNormal: "",
    valorHoraNoRem: "",
    mesAnio: "",
    afiliado: "",
    sueldoBasico: "",
    sueldoNoRem: "",
    nombreCompleto: "",
    primeraQuincena: {
      brutoAsignacionNoRem: "",
      brutoHsNoRemunerativoExtra: "",
      brutoHsNoRemunerativoExtraAL100: "",
      brutoHsNoRemunerativoNocturnas: "",
      brutoHsNoRemunerativoNocturnasExtras: "",
    },
    segundaQuincena: {
      brutoAsignacionNoRem: "",
      brutoHsNoRemunerativoExtra: "",
      brutoHsNoRemunerativoExtraAL100: "",
      brutoHsNoRemunerativoNocturnas: "",
      brutoHsNoRemunerativoNocturnasExtras: "",
    },
    productos: {
      Comedor: { cantidad: 0, valor: 0 },
      "Producto 1": { cantidad: 0, valor: 0 },
      "Producto 2": { cantidad: 0, valor: 0 },
      "Producto 3": { cantidad: 0, valor: 0 },
    },
    numeroProductos: 3,
    sepelio: "",
    comedor: "",
    mercaderia: "",
    ...initialData,
  });

  useEffect(() => {
    if (legajo) {
      const operariosString = localStorage.getItem('operarios');
      if (operariosString) {
        const operarios = JSON.parse(operariosString);
        const operario = operarios.find((op: any) => op.legajo.toString() === legajo);
        
        if (operario) {
          const periodoPagoUpperCase = new Date().toLocaleString('es-AR', { month: 'long', year: 'numeric' })
            .toUpperCase();
          
          setFormData(prevData => ({
            ...prevData,
            legajo: operario.legajo.toString(),
            apellido: operario.apellido.toUpperCase(),
            nombre: operario.nombre.toUpperCase(),
            segundoNombre: operario.segundoNombre ? operario.segundoNombre.toUpperCase() : "",
            cuil: operario.cuil.toUpperCase(),
            fechaIngreso: operario.fechaIngreso.toUpperCase(),
            obraSocial: operario.obraSocial.toUpperCase(),
            afiliado: operario.afiliadoSindicato ? "SI" : "NO",
            formaContratacion: operario.tipoContratacion.toUpperCase(),
            seccion: operario.sector ? operario.sector.toUpperCase() : "",
            calificacion: operario.categoria.toUpperCase(),
            valorHoraNormal: operario.sueldoPorHora.toString(),
            valorHoraNoRem: operario.valorHoraNoRem?.toString() || "0",
            periodoPago: periodoPagoUpperCase,
            nombreCompleto: `${operario.apellido} ${operario.nombre} ${operario.segundoNombre || ''}`.trim().toUpperCase(),
          }));
        }
      }
    }
  }, [legajo]);

  // Manejador de cambios en los inputs que convierte a mayúsculas
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Convertir a mayúsculas solo si no es un campo numérico
    const shouldUpperCase = ![
      'valorHoraNormal',
      'valorHoraNoRem',
      'sepelio',
      'comedor',
      'mercaderia'
    ].includes(name);

    setFormData((prevData) => ({
      ...prevData,
      [name]: shouldUpperCase ? value.toUpperCase() : value,
    }));
  };

  const handleProductoChange = (
    producto: string,
    tipo: "cantidad" | "valor",
    value: string
  ) => {
    setFormData((prev) => {
      const newProductos = {
        ...(prev.productos || {}),
        [producto]: {
          ...(prev.productos?.[producto] || { cantidad: 0, valor: 0 }),
          [tipo]: Number(value) || 0,
        },
      };

      // Calcular totales
      const totalComedor =
        newProductos.Comedor.cantidad * newProductos.Comedor.valor;
      const totalMercaderia = Object.entries(newProductos)
        .filter(([key]) => key !== "Comedor")
        .reduce((sum, [, data]) => sum + data.cantidad * data.valor, 0);

      return {
        ...prev,
        productos: newProductos,
        comedor: totalComedor.toString(),
        mercaderia: totalMercaderia.toString(),
      };
    });
  };

  // Enviar datos
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sepelio) {
      toast.error("El campo Sepelio es requerido");
      return;
    }
    const empleadoProcesado = procesarDatosEmpleado(formData);
    const conceptos = generarConceptos(empleadoProcesado);

    // Calcular totales
    const totalRemunerativo = conceptos
      .map((c) => parseFloat(String(c.remunerativo)) || 0)
      .reduce((total, val) => total + val, 0);

    const totalNoRemunerativo = conceptos.reduce((total, c) => {
      const noremunerativo = parseFloat(String(c.noremunerativo)) || 0;
      const compensacion = parseFloat(String(c.compensacion)) || 0;
      return total + noremunerativo + compensacion;
    }, 0);

    const totalDescuentos = conceptos
      .map((c) => parseFloat(String(c.descuentos)) || 0)
      .reduce((total, val) => total + val, 0);

    const totalNeto = totalRemunerativo + totalNoRemunerativo - totalDescuentos;

    // Guardar en localStorage
    const historialRecibos = JSON.parse(localStorage.getItem('historialRecibos') || '[]');
    const nuevoRecibo = {
      legajo: formData.legajo,
      periodo: formData.mesAnio,
      fecha: new Date().toLocaleDateString(),
      totalNeto: totalNeto.toFixed(2),
      datosCompletos: empleadoProcesado
    };

    historialRecibos.push(nuevoRecibo);
    localStorage.setItem('historialRecibos', JSON.stringify(historialRecibos));

    toast.success('¡Recibo creado y guardado exitosamente en su historial laboral!', {
      duration: 4000,
      className: 'my-toast-class',
    });

    onSubmit(empleadoProcesado);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="pt-6 w-full">
        {/* Sección Datos Personales */}
        <section className=" hidden mb-8 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <h2 className="subtitulo text-2xl font-semibold text-gray-700 mb-6 pb-3 border-b border-gray-200 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-blue-600">1</span>
            Datos Personales
          </h2>
          <div className="grid text-[12px] sm:text-[14px] md:text-[16px] grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "LEGAJO", name: "legajo" },
              { label: "APELLIDO", name: "apellido" },
              { label: "NOMBRE", name: "nombre" },
              { label: "SEGUNDO NOMBRE", name: "segundoNombre" },
              { label: "CUIL", name: "cuil" },
              { label: "PERIODO DE PAGO", name: "periodoPago" },
              { label: "AFILIADO AL SINDICATO", name: "afiliado" },
              { label: "VALOR HORA NORMAL", name: "valorHoraNormal" },
              { label: "VALOR HORA NO REM", name: "valorHoraNoRem" },
              { label: "FECHA INGRESO", name: "fechaIngreso" },
              { label: "OBRA SOCIAL", name: "obraSocial" },
              { label: "FORMA DE CONTRATACIÓN", name: "formaContratacion" },
              { label: "SECCIÓN", name: "seccion" },
              { label: "CALIFICACIÓN PROFESIONAL", name: "calificacion" },
            ].map(({ label, name }, index) => (
              <div key={index}>
                {name === "afiliado" ? (
                  <FormControl fullWidth>
                    <InputLabel sx={{
                      fontSize: {
                        xs: '0.6rem',
                        sm: '0.75rem',
                        md: '0.875rem'
                      },
                      lineHeight: {
                        xs: 1,
                        sm: 1.2
                      },
                      '&.MuiInputLabel-shrink': {
                        transform: {
                          xs: 'translate(14px, -6px) scale(0.75)',
                          sm: 'translate(14px, -9px) scale(0.75)'
                        }
                      }
                    }}>{label}</InputLabel>
                    <Select
                      name={name}
                      value={formData.afiliado}
                      onChange={(e: SelectChangeEvent) => setFormData(prev => ({
                        ...prev,
                        afiliado: e.target.value.toUpperCase()
                      }))}
                      label={label}
                      disabled={disableAfiliado}
                      size="small"
                      sx={{
                        height: {
                          xs: '30px',
                          sm: '40px'
                        },
                        '& .MuiSelect-select': {
                          fontSize: {
                            xs: '0.65rem',
                            sm: '0.75rem',
                            md: '0.875rem'
                          },
                          padding: {
                            xs: '6px',
                            sm: '8px 14px'
                          },
                          display: 'flex',
                          alignItems: 'center',
                          minHeight: '0 !important',
                          height: {
                            xs: '30px !important',
                            sm: '40px !important'
                          }
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderRadius: '4px'
                        }
                      }}
                    >
                      <MenuItem 
                        value="SI" 
                        sx={{
                          fontSize: {
                            xs: '0.65rem',
                            sm: '0.75rem',
                            md: '0.875rem'
                          },
                          minHeight: {
                            xs: '30px',
                            sm: '40px'
                          },
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        SÍ
                      </MenuItem>
                      <MenuItem 
                        value="NO"
                        sx={{
                          fontSize: {
                            xs: '0.65rem',
                            sm: '0.75rem',
                            md: '0.875rem'
                          },
                          minHeight: {
                            xs: '30px',
                            sm: '40px'
                          },
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        NO
                      </MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <FormControl fullWidth>
                    <TextField
                      label={label}
                      name={name}
                      value={
                        typeof formData[name as keyof FormData] === "object"
                          ? ""
                          : formData[name as keyof FormData]
                      }
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      required={name !== "segundoNombre"}
                      inputProps={{
                        style: { textTransform: 'uppercase' }
                      }}
                      sx={{
                        '& .MuiInputLabel-root': {
                          fontSize: {
                            xs: '0.6rem',
                            sm: '0.75rem',
                            md: '0.875rem'
                          },
                          lineHeight: {
                            xs: 1,
                            sm: 1.2
                          },
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '100%',
                          transformOrigin: 'left',
                          '&.MuiInputLabel-shrink': {
                            transform: {
                              xs: 'translate(14px, -6px) scale(0.75)',
                              sm: 'translate(14px, -9px) scale(0.75)'
                            }
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          fontSize: {
                            xs: '0.65rem',
                            sm: '0.75rem',
                            md: '0.875rem'
                          },
                          padding: {
                            xs: '6px',
                            sm: '8px 14px'
                          },
                          height: {
                            xs: '1.2rem',
                            sm: 'auto'
                          }
                        },
                        '& .MuiOutlinedInput-root': {
                          minHeight: {
                            xs: '30px',
                            sm: '40px'
                          }
                        }
                      }}
                    />
                  </FormControl>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Sección Datos Adicionales */}
        <section className="mb-8 bg-white/80 backdrop-blur-sm p-5 md:p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <h2 className="subtitulo text-2xl font-semibold text-gray-700 mb-6 pb-3 border-b border-gray-200 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-blue-600">1</span>
            Datos Adicionales
          </h2>
          <div className="grid text-[12px] sm:text-[14px] md:text-[16px] grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Días primera quincena", name: "diasPrimeraQuincena", key: "dpq" },
              { label: "Días segunda quincena", name: "diasSegundaQuincena", key: "dsq" },
              { label: "Feriado 1era quincena", name: "feriadoPrimeraQuincena", key: "fpq" },
              { label: "Feriado 2da quincena", name: "feriadoSegundaQuincena", key: "fsq" },
              { label: "Extras 50% 1º quincena", name: "horaExtraPrimeraQuincena", key: "hepq" },
              { label: "Extras 50% 2º quincena", name: "horaExtraSegundaQuincena", key: "hesq" },
              { label: "Extras 100% 1º quincena", name: "horaExtraAL100PrimeraQuincena", key: "he100pq" },
              { label: "Extras 100% 2º quincena", name: "horaExtraAL100SegundaQuincena", key: "he100sq" },
              { label: "Nocturna 1º quincena", name: "horaNocturnaPrimeraQuincena", key: "hnpq" },
              { label: "Nocturna 2º quincena", name: "horaNocturnaSegundaQuincena", key: "hnsq" },
              { label: "Extra noct 1º quincena", name: "horaExtraNocturnaPrimeraQuincena", key: "henpq" },
              { label: "Extra noct 2º quincena", name: "horaExtraNocturnaSegundaQuincena", key: "hensq" },
              { label: "Suspension 1° quincena", name: "suspensionPrimeraQuincena", key: "spq" },
              { label: "Suspension 2° quincena", name: "suspensionSegundaQuincena", key: "ssq" },
              { label: "Bonificacion adicional", name: "bonificacion", key: "ba" },
              { label: "Sepelio", name: "sepelio", key: "sep" },
            ].map(({ label, name, key }) => (
              <div key={key}>
                <FormControl fullWidth>
                  <TextField
                    label={label}
                  name={name}
                  value={
                    typeof formData[name as keyof typeof formData] === "object"
                      ? ""
                      : (formData[name as keyof typeof formData] as string) || ""
                  }
                  onChange={handleChange}
                    variant="outlined"
                    size="small"
                    required={name === "sepelio"}
                    type="text"
                    inputProps={{
                      style: { textTransform: 'uppercase' }
                    }}
                    sx={{
                      '& .MuiInputLabel-root': {
                        fontSize: {
                          xs: '0.6rem',
                          sm: '0.75rem',
                          md: '0.875rem'
                        },
                        lineHeight: {
                          xs: 1,
                          sm: 1.2
                        },
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: '100%',
                        transformOrigin: 'left',
                        '&.MuiInputLabel-shrink': {
                          transform: {
                            xs: 'translate(14px, -6px) scale(0.75)',
                            sm: 'translate(14px, -9px) scale(0.75)'
                          }
                        }
                      },
                      '& .MuiOutlinedInput-input': {
                        fontSize: {
                          xs: '0.65rem',
                          sm: '0.75rem',
                          md: '0.875rem'
                        },
                        padding: {
                          xs: '6px',
                          sm: '8px 14px'
                        },
                        height: {
                          xs: '1.2rem',
                          sm: 'auto'
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        minHeight: {
                          xs: '30px',
                          sm: '40px'
                        }
                      }
                    }}
                />
                {(name === "diasPrimeraQuincena" ||
                  name === "diasSegundaQuincena" ||
                  name === "feriadoPrimeraQuincena" ||
                  name === "feriadoSegundaQuincena") && (
                    <div className="text-[10px] sm:text-sm text-gray-600 mt-1">
                      {formData[name as keyof typeof formData] &&
                        `TOTAL: ${(
                          Number(formData[name as keyof typeof formData]) * 8.8
                        ).toFixed(2)}`}
                    </div>
                  )}
                </FormControl>
              </div>
            ))}
          </div>
        </section>

        {/* Sección Comedor y Mercadería */}
        <section className="mb-8 bg-white/80 backdrop-blur-sm p-5 md:p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <h2 className="subtitulo text-2xl font-semibold text-gray-700 mb-6 pb-3 border-b border-gray-200 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-blue-600">2</span>
            Comedor y Mercadería
          </h2>
          <div className="grid text-[12px] sm:text-[14px] md:text-[16px] grid-cols-3 gap-6">
            <div className="col-span-1 font-medium text-gray-700">PRODUCTOS</div>
            <div className="font-medium text-gray-700">CANTIDAD</div>
            <div className="font-medium text-gray-700">VALOR</div>

            {/* Comedor siempre visible */}
            <div className="col-span-1 flex items-center font-medium text-gray-700">Comedor</div>
            <FormControl fullWidth>
              <TextField
                type="number"
                label="Cantidad"
                value={formData.productos?.["Comedor"]?.cantidad || ""}
                onChange={(e) => handleProductoChange("Comedor", "cantidad", e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: {
                      xs: '0.6rem',
                      sm: '0.75rem',
                      md: '0.875rem'
                    },
                    lineHeight: {
                      xs: 1,
                      sm: 1.2
                    },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                    transformOrigin: 'left',
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: {
                      xs: '0.65rem',
                      sm: '0.75rem',
                      md: '0.875rem'
                    },
                    padding: {
                      xs: '6px',
                      sm: '8px 14px'
                    },
                    height: {
                      xs: '1.2rem',
                      sm: 'auto'
                    }
                  },
                  '& .MuiOutlinedInput-root': {
                    minHeight: {
                      xs: '30px',
                      sm: '40px'
                    }
                  }
                }}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                type="number"
                label="Valor unitario"
                value={formData.productos?.["Comedor"]?.valor || ""}
                onChange={(e) => handleProductoChange("Comedor", "valor", e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: {
                      xs: '0.6rem',
                      sm: '0.75rem',
                      md: '0.875rem'
                    },
                    lineHeight: {
                      xs: 1,
                      sm: 1.2
                    },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                    transformOrigin: 'left',
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: {
                      xs: '0.65rem',
                      sm: '0.75rem',
                      md: '0.875rem'
                    },
                    padding: {
                      xs: '6px',
                      sm: '8px 14px'
                    },
                    height: {
                      xs: '1.2rem',
                      sm: 'auto'
                    }
                  },
                  '& .MuiOutlinedInput-root': {
                    minHeight: {
                      xs: '30px',
                      sm: '40px'
                    }
                  }
                }}
              />
            </FormControl>

            {/* Productos dinámicos */}
            {Array.from({ length: formData.numeroProductos || 3 }).map((_, index) => (
              <React.Fragment key={index}>
                <div className="col-span-1 flex items-center font-medium text-gray-700">{`Producto ${index + 1}`}</div>
                <FormControl fullWidth>
                  <TextField
                    type="number"
                    label="Cantidad"
                    value={formData.productos?.[`Producto ${index + 1}`]?.cantidad || ""}
                    onChange={(e) => handleProductoChange(`Producto ${index + 1}`, "cantidad", e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiInputLabel-root': {
                        fontSize: {
                          xs: '0.6rem',
                          sm: '0.75rem',
                          md: '0.875rem'
                        },
                        lineHeight: {
                          xs: 1,
                          sm: 1.2
                        },
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: '100%',
                        transformOrigin: 'left',
                      },
                      '& .MuiOutlinedInput-input': {
                        fontSize: {
                          xs: '0.65rem',
                          sm: '0.75rem',
                          md: '0.875rem'
                        },
                        padding: {
                          xs: '6px',
                          sm: '8px 14px'
                        },
                        height: {
                          xs: '1.2rem',
                          sm: 'auto'
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        minHeight: {
                          xs: '30px',
                          sm: '40px'
                        }
                      }
                    }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    type="number"
                    label="Valor unitario"
                    value={formData.productos?.[`Producto ${index + 1}`]?.valor || ""}
                    onChange={(e) => handleProductoChange(`Producto ${index + 1}`, "valor", e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiInputLabel-root': {
                        fontSize: {
                          xs: '0.6rem',
                          sm: '0.75rem',
                          md: '0.875rem'
                        },
                        lineHeight: {
                          xs: 1,
                          sm: 1.2
                        },
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: '100%',
                        transformOrigin: 'left',
                      },
                      '& .MuiOutlinedInput-input': {
                        fontSize: {
                          xs: '0.65rem',
                          sm: '0.75rem',
                          md: '0.875rem'
                        },
                        padding: {
                          xs: '6px',
                          sm: '8px 14px'
                        },
                        height: {
                          xs: '1.2rem',
                          sm: 'auto'
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        minHeight: {
                          xs: '30px',
                          sm: '40px'
                        }
                      }
                    }}
                  />
                </FormControl>
              </React.Fragment>
            ))}
          </div>

          {/* Botón para agregar más productos */}
          <div className="mt-8 flex justify-center items-center md:justify-start md:items-start">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, numeroProductos: (prev.numeroProductos || 3) + 1 }))}
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Agregar Producto
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6 text-[0.65rem] sm:text-[0.75rem] md:text-[0.875rem] bg-white/90 p-6 rounded-xl shadow-sm border border-gray-100">
            <div>
              <label className="block font-medium text-center text-gray-700 mb-2 text-[0.65rem] sm:text-[0.75rem] md:text-[0.875rem]">COMEDOR</label>
              <input
                type="text"
                value={formData.comedor || "0"}
                readOnly
                className="w-full border border-gray-300 rounded-lg bg-gray-50 text-center font-medium text-gray-700 text-[0.65rem] sm:text-[0.75rem] md:text-[0.875rem] p-[6px] sm:p-[8px_14px]"
              />
            </div>
            <div>
              <label className="block font-medium text-center text-gray-700 mb-2 text-[0.65rem] sm:text-[0.75rem] md:text-[0.875rem]">MERCADERÍA</label>
              <input
                type="text"
                value={formData.mercaderia || "0"}
                readOnly
                className="w-full border border-gray-300 rounded-lg bg-gray-50 text-center font-medium text-gray-700 text-[0.65rem] sm:text-[0.75rem] md:text-[0.875rem] p-[6px] sm:p-[8px_14px]"
              />
            </div>
          </div>
        </section>

        <div className="text-center mt-12">
          <button
            type="submit"
            className="group relative inline-flex items-center justify-center px-12 py-4 overflow-hidden font-bold text-white transition-all duration-300 ease-out rounded-xl shadow-lg bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-blue-800 to-blue-900 group-hover:translate-x-0 ease">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </span>
            <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">Crear RECIBO</span>
            <span className="relative invisible">Crear RECIBO</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioRecibo; 