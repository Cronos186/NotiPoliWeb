/* ============================================================
   NotiPoliWeb — Acceso tipado a localStorage
   Centraliza las claves para evitar cadenas mágicas dispersas.
   ============================================================ */

export const STORAGE_KEYS = {
  USUARIOS: 'notipoliweb_usuarios',
  SESION: 'notipoliweb_sesion',
  FAVORITOS: (email: string) => `notipoliweb_favoritos_${email}`,
  NOTICIAS_CREADAS: 'notipoliweb_noticias_creadas',
  ELIMINADAS: 'notipoliweb_eliminadas',
  MENSAJES: 'notipoliweb_mensajes',
} as const;

/** Lee y parsea una clave; devuelve `porDefecto` si no existe o está corrupta. */
export function leer<T>(clave: string, porDefecto: T): T {
  try {
    const raw = localStorage.getItem(clave);
    if (raw === null) return porDefecto;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`⚠ No se pudo leer "${clave}" de localStorage:`, error);
    return porDefecto;
  }
}

/** Serializa y guarda un valor. */
export function escribir<T>(clave: string, valor: T): void {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    console.warn(`⚠ No se pudo escribir "${clave}" en localStorage:`, error);
  }
}

export function eliminarClave(clave: string): void {
  localStorage.removeItem(clave);
}

export function existeClave(clave: string): boolean {
  return localStorage.getItem(clave) !== null;
}
