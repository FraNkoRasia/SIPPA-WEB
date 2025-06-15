//#region SEGUNDA A MODIFICAR
"use client";

import React, { useState } from "react";
import { useFormContext } from "@/context/FormContext";
import { useRouter } from "next/navigation"; // Ahora debería funcionar correctamente
import { procesarDatosEmpleado } from "@/utils/calculosRecibo"; // ajusta la ruta
import { EmpleadoData as FormData } from "@/context/FormContext";
import { TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const Page = () => {
  const { setEmpleado } = useFormContext();
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
      "Pollo Entero": { cantidad: 0, valor: 0 },
      Supremacrispy: { cantidad: 0, valor: 0 },
      "Bocadito de Pollo": { cantidad: 0, valor: 0 },
      Medallón: { cantidad: 0, valor: 0 },
      Nuggets: { cantidad: 0, valor: 0 },
      Rikosaurio: { cantidad: 0, valor: 0 },
      "Cuarto Trasero": { cantidad: 0, valor: 0 },
      Salchichas: { cantidad: 0, valor: 0 },
    },
    sepelio: "",
    comedor: "",
    mercaderia: "",
  });

  const router = useRouter();

  // Manejador de cambios en los inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (
    e: any,
    child?: React.ReactNode
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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

  // Enviar datos al contexto y redirigir
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sepelio) {
      alert("El campo Sepelio es requerido");
      return;
    }
    const empleadoProcesado = procesarDatosEmpleado(formData);
    setEmpleado(empleadoProcesado);
    router.push("/recibo");
  };
  return (
    <motion.main className="p-10 w-full max-w-7xl mx-auto bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-xl" initial="initial" animate="animate" variants={fadeIn}>
      <h1 className="titulo-principal text-4xl font-bold  mb-8 text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
        Formulario de Datos
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="mb-8 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <h2 className="subtitulo text-2xl font-semibold text-gray-700 mb-6 pb-3 border-b border-gray-200 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-blue-600">1</span>
            Datos Principales
          </h2>
          <div className="grid text-[12px] sm:text-[14px] md:text-[16px] grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Legajo", name: "legajo" },
              { label: "Apellido", name: "apellido" },
              { label: "Nombre", name: "nombre" },
              { label: "Segundo Nombre", name: "segundoNombre" },
              { label: "Mes/Año", name: "mesAnio" },
              { label: "Afiliado", name: "afiliado" },
              { label: "Valor Hora Normal", name: "valorHoraNormal" },
              { label: "Valor Hora No Rem", name: "valorHoraNoRem" },
              { label: "Fecha Ingreso", name: "fechaIngreso" },
              { label: "Obra Social", name: "obraSocial" },
            ].map(({ label, name }, index) => (
              <div key={index}>
                {name === "afiliado" ? (
                  <FormControl fullWidth size="small">
                    <InputLabel id="afiliado-label" shrink={true}>Afiliado</InputLabel>
                    <Select
                      labelId="afiliado-label"
                    name={name}
                    required
                    value={
                      typeof formData[name as keyof FormData] === "object"
                        ? ""
                        : (formData[name as keyof FormData] as string) || ""
                    }
                      onChange={handleSelectChange}
                      label="Afiliado"
                      displayEmpty
                      renderValue={(selected) =>
                        selected === "" ? <span style={{ color: '#bdbdbd' }}>Seleccione</span> : selected
                      }
                      sx={{
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
                          height: {
                            xs: '1.2rem',
                            sm: 'auto'
                          }
                        },
                        minHeight: {
                          xs: '30px',
                          sm: '40px'
                        },
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <MenuItem value="" disabled sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem' } }}>Seleccione</MenuItem>
                      <MenuItem value="Sí" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem' } }}>Si</MenuItem>
                      <MenuItem value="No" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem' } }}>No</MenuItem>
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
                      onChange={handleInputChange}
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
        <section className="mb-8 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <h2 className="subtitulo text-2xl font-semibold text-gray-700 mb-6 pb-3 border-b border-gray-200 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-blue-600">2</span>
            Datos Adicionales
          </h2>
          <div className="grid text-[12px] sm:text-[14px] md:text-[16px] grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Días primera quincena", name: "diasPrimeraQuincena" },
              { label: "Días segunda quincena", name: "diasSegundaQuincena" },
              {
                label: "Feriado 1era quincena",
                name: "feriadoPrimeraQuincena",
              },
              { label: "Feriado 2da quincena", name: "feriadoSegundaQuincena" },
              {
                label: "Extras 50% 1º quincena",
                name: "horaExtraPrimeraQuincena",
              },
              {
                label: "Extras 50% 2º quincena",
                name: "horaExtraSegundaQuincena",
              },
              {
                label: "Extras 100% 1º quincena",
                name: "horaExtraAL100PrimeraQuincena",
              },
              {
                label: "Extras 100% 2º quincena",
                name: "horaExtraAL100SegundaQuincena",
              },
              {
                label: "Nocturna 1º quincena",
                name: "horaNocturnaPrimeraQuincena",
              },
              {
                label: "Nocturna 2º quincena",
                name: "horaNocturnaSegundaQuincena",
              },
              {
                label: "Extra noct 1º quincena",
                name: "horaExtraNocturnaPrimeraQuincena",
              },
              {
                label: "Extra noct 2º quincena",
                name: "horaExtraNocturnaSegundaQuincena",
              },
              {
                label: "Suspension 1° quincena",
                name: "suspensionPrimeraQuincena",
              },
              {
                label: "Suspension 2° quincena",
                name: "suspensionSegundaQuincena",
              },
              {
                label: "Bonificacion adicional",
                name: "bonificacion",
              },
              {
                label: "Sepelio",
                name: "sepelio",
              },
            ].map(({ label, name }, index) => {
              return (
                <div key={index}>
                  <FormControl fullWidth>
                    <TextField
                      label={label}
                    name={name}
                    value={
                        typeof formData[name as keyof typeof formData] === "object"
                          ? ""
                          : (formData[name as keyof typeof formData] as string) || ""
                      }
                      onChange={handleInputChange}
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
              );
            })}
          </div>
        </section>
        {/* Sección Comedor y Mercadería */}

        <section className="mb-8 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <h2 className="subtitulo text-2xl font-semibold text-gray-700 mb-6 pb-3 border-b border-gray-200 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-blue-600">3</span>
            Comedor y Mercadería
          </h2>
          <div className="grid text-[12px] sm:text-[14px] md:text-[16px] grid-cols-3 gap-6">
            <div className="col-span-1 font-medium text-gray-700 text-[12px] sm:text-[14px] md:text-[16px]">PRODUCTOS</div>
            <div className="font-medium text-gray-700 text-[12px] sm:text-[14px] md:text-[16px]">CANTIDAD</div>
            <div className="font-medium text-gray-700 text-[12px] sm:text-[14px] md:text-[16px]">VALOR</div>

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
          <div className="mt-8 flex justify-center md:justify-start w-full">
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

          <div className="mt-8 grid grid-cols-2 gap-6 bg-white/90 p-6 rounded-xl shadow-sm border border-gray-100">

            <div>
              <label className="block font-medium text-center text-gray-700 mb-2">Comedor</label>
              <TextField
                value={formData.comedor || "0"}
                InputProps={{ readOnly: true }}
                placeholder="0"
                fullWidth
                variant="outlined"
                size="small"
                sx={{
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
                    },
                    textAlign: 'center',
                  },
                  '& .MuiOutlinedInput-root': {
                    minHeight: {
                      xs: '30px',
                      sm: '40px'
                    }
                  },
                  '& .MuiInputBase-input::placeholder': {
                    fontSize: {
                      xs: '0.65rem',
                      sm: '0.75rem',
                      md: '0.875rem'
                    },
                    opacity: 1
                  }
                }}
              />
            </div>
            <div>
              <label className="block font-medium text-center text-gray-700 mb-2">Mercadería</label>
              <TextField
                value={formData.mercaderia || "0"}
                InputProps={{ readOnly: true }}
                placeholder="0"
                fullWidth
                variant="outlined"
                size="small"
                sx={{
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
                    },
                    textAlign: 'center',
                  },
                  '& .MuiOutlinedInput-root': {
                    minHeight: {
                      xs: '30px',
                      sm: '40px'
                    }
                  },
                  '& .MuiInputBase-input::placeholder': {
                    fontSize: {
                      xs: '0.65rem',
                      sm: '0.75rem',
                      md: '0.875rem'
                    },
                    opacity: 1
                  }
                }}
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
    </motion.main>
  );
};

export default Page;
