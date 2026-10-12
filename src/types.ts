/* ============================================================
   NotiPoliWeb — Tipos compartidos
   ============================================================ */

/** Categorías válidas del periódico. */
export type Categoria = 'Educación' | 'Tecnología' | 'Turismo' | 'Comercial';

/** Filtro del listado: incluye la opción "Todas". */
export type FiltroCategoria = 'Todas' | Categoria;

export interface Noticia {
  id: number;
  titulo: string;
  categoria: Categoria;
  imagen: string;
  descripcion: string;
  contenido: string;
  fecha: string;
  autorEmail: string;
  autorNombre: string;
}

export interface Usuario {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  fechaRegistro: string;
}

/** Datos mínimos que se conservan en la sesión activa. */
export interface Sesion {
  email: string;
  nombre: string;
  apellido?: string;
}

export interface MensajeContacto {
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
  fecha: string;
}

/** Valores del formulario de creación de noticias. */
export interface NoticiaFormValues {
  titulo: string;
  categoria: string;
  imagen: string;
  descripcion: string;
  contenido: string;
}

export interface CredencialesLogin {
  correo: string;
  password: string;
}

export interface DatosRegistro {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  password2: string;
  terminos: boolean;
}

/** Resultado estándar de las operaciones de autenticación. */
export interface ResultadoAuth {
  ok: boolean;
  error?: string;
}

/** Login y registro devuelven además la sesión creada. */
export interface ResultadoAuthConSesion extends ResultadoAuth {
  sesion?: Sesion;
}
