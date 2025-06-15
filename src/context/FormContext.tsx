// src/context/FormContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export interface EmpleadoData {
  legajo: string;
  apellido: string;
  nombre: string;
  segundoNombre: string;
  mesAnio: string;
  afiliado: string;
  sindicato: string;
  cuil: string;
  formaContratacion: string;
  seccion: string;
  calificacion: string;
  sueldoBasico: string;
  sueldoNoRem: string;
  fechaIngreso: string;
  periodoPago: string;
  obraSocial: string;
  nombreCompleto: string;
  valorHoraNormal: string;
  valorHoraNoRem: string;
  numeroProductos?: number;

  // Campos para totales
  brutoTotal?: number;
  netoTotal?: number;
  totalRemunerativo?: number;
  totalNoRemunerativo?: number;
  totalDescuentos?: number;

  // Campos adicionales usados para cálculos (opcionales)
  diasPrimeraQuincena?: string;
  diasSegundaQuincena?: string;
  diasPrimeraQuincenaUnidades?: string;
  diasSegundaQuincenaUnidades?: string;
  feriadoPrimeraQuincena?: string;
  feriadoSegundaQuincena?: string;
  feriadoPrimeraQuincenaUnidades?: string;
  feriadoSegundaQuincenaUnidades?: string;
  horaExtraPrimeraQuincena?: string;
  horaExtraSegundaQuincena?: string;
  horaExtraAL100PrimeraQuincena?: string;
  horaExtraAL100SegundaQuincena?: string;
  horaNocturnaPrimeraQuincena?: string;
  horaNocturnaSegundaQuincena?: string;
  horaExtraNocturnaPrimeraQuincena?: string;
  horaExtraNocturnaSegundaQuincena?: string;
  suspensionPrimeraQuincena?: string;
  suspensionSegundaQuincena?: string;
  sepelio?: string;
  comedor?: string;
  mercaderia?: string;

  productos?: {
    [key: string]: {
      cantidad: number;
      valor: number;
    };
  };

  brutoHsNoRemunerativoExtraAL100?: string;
  brutoPrimeraQui?: string;
  brutoSegundaQui?: string;
  brutoFeriadoPrimeraQui?: string;
  brutoFeriadoSegundaQui?: string;
  ExtraPrimeraQui?: string;
  ExtraSegundaQui?: string;
  ExtraAL100PrimeraQui?: string;
  ExtraAL100SegundaQui?: string;
  NocturnaPrimeraQui?: string;
  NocturnaSegundaQui?: string;
  ExtraNocturnaPrimeraQui?: string;
  ExtraNocturnaSegundaQui?: string;
  brutoAsignacionNoRem?: string;
  brutoHsNoRemunerativoExtra?: string;
  brutoHsNoRemunerativoNocturnas?: string;
  brutoHsNoRemunerativoNocturnasExtras?: string;
  bonificacion?: string;
  bonificado?: string;
  bonificacionAdicional?: string;

  primeraQuincena: {
    brutoAsignacionNoRem: string;
    brutoHsNoRemunerativoExtra: string;
    brutoHsNoRemunerativoExtraAL100: string;
    brutoHsNoRemunerativoNocturnas: string;
    brutoHsNoRemunerativoNocturnasExtras: string;
  };
  segundaQuincena: {
    brutoAsignacionNoRem: string;
    brutoHsNoRemunerativoExtra: string;
    brutoHsNoRemunerativoExtraAL100: string;
    brutoHsNoRemunerativoNocturnas: string;
    brutoHsNoRemunerativoNocturnasExtras: string;
  };
}
export interface Concepto {
  concepto: string;
  codigo: string;
  unidades: number;
  remunerativo: number | string;
  noremunerativo: number | string;
  descuentos: number | string;
  compensacion?: number;
}
interface FormContextType {
  empleado: EmpleadoData | null;
  setEmpleado: (empleado: EmpleadoData) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [empleado, setEmpleado] = useState<EmpleadoData | null>(null);

  return (
    <FormContext.Provider value={{ empleado, setEmpleado }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext debe usarse dentro de un FormProvider");
  }
  return context;
};
