/* ============================================================
   NotiPoliWeb — Servicio de contacto
   Registra los mensajes enviados desde el formulario.
   ============================================================ */

import { STORAGE_KEYS, escribir, leer } from '@/services/storage';
import type { MensajeContacto } from '@/types';

export function guardarMensaje(mensaje: MensajeContacto): void {
  const mensajes = leer<MensajeContacto[]>(STORAGE_KEYS.MENSAJES, []);
  escribir(STORAGE_KEYS.MENSAJES, [...mensajes, mensaje]);
}

export function getMensajes(): MensajeContacto[] {
  return leer<MensajeContacto[]>(STORAGE_KEYS.MENSAJES, []);
}
