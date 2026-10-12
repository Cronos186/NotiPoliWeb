import type { Categoria, FiltroCategoria } from '@/types';

/* ============================================================
   NotiPoliWeb — Constantes de dominio y de interfaz
   ============================================================ */

export const CATEGORIAS: Categoria[] = [
  'Educación',
  'Tecnología',
  'Turismo',
  'Comercial',
];

/** Etiquetas de los botones de filtro del listado. */
export const FILTROS: { valor: FiltroCategoria; etiqueta: string }[] = [
  { valor: 'Todas', etiqueta: 'Todas' },
  { valor: 'Educación', etiqueta: 'Educativas' },
  { valor: 'Tecnología', etiqueta: 'Tecnológicas' },
  { valor: 'Turismo', etiqueta: 'Turísticas' },
  { valor: 'Comercial', etiqueta: 'Comerciales' },
];

/** Elementos por página en los listados paginados. */
export const TAMANO_PAGINA = {
  /** Rejilla del listado de noticias. */
  noticias: 6,
  /** Tarjetas horizontales de favoritos. */
  favoritos: 5,
  /** Filas de las tablas de gestión de noticias. */
  tabla: 5,
} as const;

export const DATOS_PROYECTO = {
  nombre: 'NotiPoliWeb',
  eslogan:
    'Tu periódico digital de experiencias educativas, tecnológicas, turísticas y comerciales.',
  correo: 'contacto@notipoliweb.com',
  anio: 2026,
  redes: ['Facebook', 'Twitter', 'Instagram'],
} as const;

/** Colores de marca reutilizados fuera del theme de MUI. */
export const MARCA = {
  azul: '#1E3A8A',
  azulClaro: '#3B82F6',
  azulOscuro: '#1E40AF',
  ambar: '#F59E0B',
  grisFondo: '#F3F4F6',
  texto: '#111827',
  textoSuave: '#6B7280',
  footer: '#111827',
  footerTexto: '#D1D5DB',
} as const;
