// Usuarios.tsx
// Clases TypeScript que representan los modelos Django definidos en el backend.

export class Rol {
  id: number;
  nombre: string;
  descripcion?: string | null;

  constructor(data: {
    id: number;
    nombre: string;
    descripcion?: string | null;
  }) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.descripcion = data.descripcion ?? null;
  }
}

export class Usuario {
  id: number;
  ci: string;
  foto?: string | null;
  nombre: string;
  apellido: string;
  email: string;
  fecha_nacimiento?: string | null;
  username: string;
  estado: boolean;
  rol: Rol;
  telefono?: string | null;
  password?: string | null;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;

  constructor(data: {
    id: number;
    ci: string;
    foto?: string | null;
    nombre: string;
    apellido: string;
    email: string;
    fecha_nacimiento?: string | null;
    username: string;
    estado: boolean;
    rol: Rol;
    telefono?: string | null;
    password?: string | null;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
  }) {
    this.id = data.id;
    this.ci = data.ci;
    this.foto = data.foto ?? null;
    this.nombre = data.nombre;
    this.apellido = data.apellido;
    this.email = data.email;
    this.fecha_nacimiento = data.fecha_nacimiento ?? null;
    this.username = data.username;
    this.estado = data.estado;
    this.rol = data.rol;
    this.telefono = data.telefono ?? null;
    this.password = data.password ?? null;
    this.is_staff = data.is_staff;
    this.is_active = data.is_active;
    this.date_joined = data.date_joined;
  }
}

export class Notificacion {
  id: number;
  usuarioId: number;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  tipo: string;

  constructor(data: {
    id: number;
    usuarioId: number;
    titulo: string;
    mensaje: string;
    fecha: string;
    leida: boolean;
    tipo: string;
  }) {
    this.id = data.id;
    this.usuarioId = data.usuarioId;
    this.titulo = data.titulo;
    this.mensaje = data.mensaje;
    this.fecha = data.fecha;
    this.leida = data.leida;
    this.tipo = data.tipo;
  }
}

export class SuperAdmin {
  usuarioId: number;
  usuario: Usuario;

  constructor(data: { usuarioId: number; usuario: Usuario }) {
    this.usuarioId = data.usuarioId;
    this.usuario = data.usuario;
  }
}

export class Admin {
  usuarioId: number;
  usuario: Usuario;
  puesto?: string | null;
  estado: boolean;

  constructor(data: {
    usuarioId: number;
    usuario: Usuario;
    puesto?: string | null;
    estado: boolean;
  }) {
    this.usuarioId = data.usuarioId;
    this.usuario = data.usuario;
    this.puesto = data.puesto ?? null;
    this.estado = data.estado;
  }
}

export type AccionBitacora = 'crear' | 'editar' | 'eliminar' | 'ver' | 'otro';

export class Bitacora {
  id: number;
  usuarioId: number;
  hora_entrada: string;
  hora_salida?: string | null;
  ip?: string | null;
  tabla_afectada?: string | null;
  accion: AccionBitacora;
  descripcion?: string | null;
  fecha: string;

  constructor(data: {
    id: number;
    usuarioId: number;
    hora_entrada: string;
    hora_salida?: string | null;
    ip?: string | null;
    tabla_afectada?: string | null;
    accion: AccionBitacora;
    descripcion?: string | null;
    fecha: string;
  }) {
    this.id = data.id;
    this.usuarioId = data.usuarioId;
    this.hora_entrada = data.hora_entrada;
    this.hora_salida = data.hora_salida ?? null;
    this.ip = data.ip ?? null;
    this.tabla_afectada = data.tabla_afectada ?? null;
    this.accion = data.accion;
    this.descripcion = data.descripcion ?? null;
    this.fecha = data.fecha;
  }
}
