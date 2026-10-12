/* ============================================================
   NotiPoliWeb — Servicio de noticias y favoritos
   Toda la persistencia vive en localStorage, igual que en la
   versión HTML original, pero ahora es tipada.
   ============================================================ */

import { NOTICIAS_BASE } from '@/services/seeds';
import { STORAGE_KEYS, escribir, leer } from '@/services/storage';
import type { Categoria, Noticia, NoticiaFormValues, Sesion } from '@/types';
import { fechaHoyISO } from '@/utils/fechas';

/* ---------------- Lectura ---------------- */

/**
 * Combina las noticias base con las creadas por usuarios y descarta
 * las que hayan sido eliminadas.
 */
export function cargarNoticias(): Noticia[] {
  const creadas = leer<Noticia[]>(STORAGE_KEYS.NOTICIAS_CREADAS, []);
  const eliminadas = leer<number[]>(STORAGE_KEYS.ELIMINADAS, []);
  return [...NOTICIAS_BASE, ...creadas].filter((n) => !eliminadas.includes(n.id));
}

export function getSiguienteId(noticias: Noticia[]): number {
  const ids = noticias.map((n) => n.id);
  return ids.length ? Math.max(...ids) + 1 : 1;
}

export function buscarNoticia(noticias: Noticia[], id: number): Noticia | undefined {
  return noticias.find((n) => n.id === id);
}

export function noticiasRelacionadas(
  noticias: Noticia[],
  actual: Noticia,
  limite = 4,
): Noticia[] {
  return noticias
    .filter((n) => n.categoria === actual.categoria && n.id !== actual.id)
    .slice(0, limite);
}

/* ---------------- Escritura ---------------- */

export function crearNoticia(
  values: NoticiaFormValues,
  sesion: Sesion,
  noticiasActuales: Noticia[],
): Noticia {
  const nueva: Noticia = {
    id: getSiguienteId(noticiasActuales),
    titulo: values.titulo.trim(),
    categoria: values.categoria as Categoria,
    imagen: values.imagen.trim(),
    descripcion: values.descripcion.trim(),
    contenido: values.contenido.trim(),
    fecha: fechaHoyISO(),
    autorEmail: sesion.email,
    autorNombre: `${sesion.nombre} ${sesion.apellido ?? ''}`.trim(),
  };

  const creadas = leer<Noticia[]>(STORAGE_KEYS.NOTICIAS_CREADAS, []);
  escribir(STORAGE_KEYS.NOTICIAS_CREADAS, [...creadas, nueva]);
  return nueva;
}

/**
 * Marca la noticia como eliminada y, si era una noticia creada por un
 * usuario, la retira también del registro de noticias creadas.
 */
export function eliminarNoticia(id: number): void {
  const eliminadas = leer<number[]>(STORAGE_KEYS.ELIMINADAS, []);
  if (!eliminadas.includes(id)) {
    escribir(STORAGE_KEYS.ELIMINADAS, [...eliminadas, id]);
  }

  const creadas = leer<Noticia[]>(STORAGE_KEYS.NOTICIAS_CREADAS, []);
  escribir(
    STORAGE_KEYS.NOTICIAS_CREADAS,
    creadas.filter((n) => n.id !== id),
  );
}

/* ---------------- Favoritos ---------------- */

export function getFavoritos(email: string): number[] {
  return leer<number[]>(STORAGE_KEYS.FAVORITOS(email), []);
}

export function setFavoritos(email: string, lista: number[]): void {
  escribir(STORAGE_KEYS.FAVORITOS(email), lista);
}

/** Añade o quita un favorito y devuelve `true` si quedó guardado. */
export function alternarFavorito(email: string, id: number): boolean {
  const favoritos = getFavoritos(email);
  const indice = favoritos.indexOf(id);
  const agregado = indice < 0;

  if (agregado) favoritos.push(id);
  else favoritos.splice(indice, 1);

  setFavoritos(email, favoritos);
  return agregado;
}
