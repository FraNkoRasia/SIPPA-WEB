export interface EmpleadoData {
    nombreCompleto: string;
    legajo: string;
    cuil: string;
    fechaIngreso: string;
    obraSocial: string;
    periodoPago?: string;
    sindicato?: string;
    formaContratacion?: string;
    seccion: string;
    calificacionProfesional: string;
    sueldoBasico: number;
    sueldoBasicoNoRem: number;
} 