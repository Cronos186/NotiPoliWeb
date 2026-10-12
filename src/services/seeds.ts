/* ============================================================
   NotiPoliWeb — Semillas de datos
   Los JSON de /src/data se importan en tiempo de compilación y se
   vuelcan en localStorage la primera vez que se abre la aplicación.
   ============================================================ */

import favoritosJson from '@/data/favoritos.json';
import noticiasCreadasJson from '@/data/noticias-creadas.json';
import noticiasJson from '@/data/noticias.json';
import usuariosJson from '@/data/usuarios.json';
import { STORAGE_KEYS, escribir, existeClave, leer } from '@/services/storage';
import type { Noticia, Usuario } from '@/types';

export const NOTICIAS_BASE = noticiasJson.noticias as unknown as Noticia[];

const USUARIOS_BASE = usuariosJson.usuarios as unknown as Usuario[];
const FAVORITOS_BASE = favoritosJson.favoritos as { email: string; noticias: number[] }[];
const NOTICIAS_CREADAS_BASE = noticiasCreadasJson.noticias as unknown as Noticia[];

/** Evita volver a sembrar en cada render o recarga en caliente. */
let yaSembrado = false;

/**
 * Carga las semillas respetando los datos que el usuario ya tenga guardados:
 * nunca sobreescribe información existente.
 */
export function cargarSemillas(): void {
  if (yaSembrado) return;
  yaSembrado = true;

  // Usuarios registrados
  if (leer<Usuario[]>(STORAGE_KEYS.USUARIOS, []).length === 0) {
    escribir(STORAGE_KEYS.USUARIOS, USUARIOS_BASE);
  }

  // Favoritos por usuario (una clave de localStorage por correo)
  FAVORITOS_BASE.forEach((registro) => {
    const clave = STORAGE_KEYS.FAVORITOS(registro.email);
    if (!existeClave(clave)) {
      escribir(clave, registro.noticias);
    }
  });

  // Noticias creadas por los usuarios
  if (leer<Noticia[]>(STORAGE_KEYS.NOTICIAS_CREADAS, []).length === 0) {
    escribir(STORAGE_KEYS.NOTICIAS_CREADAS, NOTICIAS_CREADAS_BASE);
  }
}
