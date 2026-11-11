import type { Categoria, Noticia, NoticiaFormValues, Sesion } from '@/types';
import { fechaHoyISO } from '@/utils/fechas';
const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3000';

export async function cargarNoticias(): Promise<Noticia[]> {
  const response = await fetch(`${API_URL}/noticias`);
  if (!response.ok) throw new Error('Error al cargar noticias');
  return response.json();
}

export function getSiguienteId(noticias: Noticia[]): number {
  const ids = noticias.map(n => n.id);
  return ids.length ? Math.max(...ids) + 1 : 1;
}

export function buscarNoticia(noticias: Noticia[], id: number): Noticia | undefined {
  return noticias.find(n => n.id === id);
}

export function noticiasRelacionadas(noticias: Noticia[], actual: Noticia, limite = 4): Noticia[] {
  return noticias.filter(n => n.categoria === actual.categoria && n.id !== actual.id).slice(0, limite);
}

export async function crearNoticia(values: NoticiaFormValues, sesion: Sesion): Promise<Noticia> {
  const nueva: Omit<Noticia, 'id'> = {
    titulo: values.titulo.trim(),
    categoria: values.categoria as Categoria,
    imagen: values.imagen.trim(),
    descripcion: values.descripcion.trim(),
    contenido: values.contenido.trim(),
    fecha: fechaHoyISO(),
    autorEmail: sesion.email,
    autorNombre: `${sesion.nombre} ${sesion.apellido ?? ''}`.trim(),
  };
  const response = await fetch(`${API_URL}/noticias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nueva),
  });
  if (!response.ok) throw new Error('Error al crear noticia');
  return response.json();
}

export async function eliminarNoticia(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/noticias/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Error al eliminar noticia');
}

export async function getFavoritos(email: string): Promise<number[]> {
  const response = await fetch(`${API_URL}/usuarios/${encodeURIComponent(email)}/favoritos`);
  if (!response.ok) return [];
  return response.json();
}

export async function alternarFavorito(email: string, id: number): Promise<boolean> {
  const favoritos = await getFavoritos(email);
  const agregado = favoritos.indexOf(id) < 0;
  if (agregado) {
    const res = await fetch(`${API_URL}/usuarios/${encodeURIComponent(email)}/favoritos/${id}`, { method: 'POST' });
    if (!res.ok) throw new Error('Error al agregar favorito');
  } else {
    const res = await fetch(`${API_URL}/usuarios/${encodeURIComponent(email)}/favoritos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al quitar favorito');
  }
  return agregado;
}
