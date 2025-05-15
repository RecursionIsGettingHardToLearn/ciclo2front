// src/app/dashboard/modelos/Institucion.tsx

// Modelo TypeScript correspondiente a tus modelos Django de Institución

/** Colegio */
export interface Colegio {
  id: number;
  nombre: string;
  logo?: string | null;
  direccion?: string;
  telefono?: string;
  email?: string | null;
  sitio_web?: string | null;
  superAdminFk?: number | null;
}

/** Módulo dentro de un Colegio */
export interface Modulo {
  id: number;
  nombre: string;
  cantidadAulas: number;
  descripcion?: string | null;
  colegioId?: number | null;
}

/** Tipos disponibles para Aula */
export type TipoAula =
  | 'AUL'
  | 'LAB'
  | 'TAL'
  | 'AUD'
  | 'COM'
  | 'GIM'
  | 'BIB';

/** Aula perteneciente a un Módulo */
export interface Aula {
  id: number;
  moduloId?: number | null;
  nombre: string;
  capacidad: number;
  estado: boolean;
  tipo: TipoAula;
  equipamiento?: string | null;
  piso?: number;
}

/** Turnos permitidos para UnidadEducativa */
export type Turno =
  | 'MAÑANA'
  | 'TARDE'
  | 'NOCHE'
  | 'COMPLETO';

/** Unidad Educativa */
export interface UnidadEducativa {
  id: number;
  codigoSie: string;
  turno: Turno;
  nombre?: string | null;
  direccion?: string | null;
  telefono?: string | null;
  nivel?: string | null;
  adminId?: number | null;
  colegioId?: number | null;
}
