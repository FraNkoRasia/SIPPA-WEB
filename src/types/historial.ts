export interface Ausencia {
  fecha: string;
  motivo: string;
  duracion: string;
}

export interface Suspension {
  fecha: string;
  motivo: string;
  duracion: string;
}

export interface Vacacion {
  fecha: string;
  duracion: string;
}

export interface Ascenso {
  fecha: string;
  cargo: string;
  departamento: string;
}

export interface HoraExtra {
  fecha: string;
  cantidad: string;
  motivo: string;
}

export interface HistorialLaboral {
  ausencias: Ausencia[];
  suspensiones: Suspension[];
  vacaciones: Vacacion[];
  ascensos: Ascenso[];
  horasExtras: HoraExtra[];
}
