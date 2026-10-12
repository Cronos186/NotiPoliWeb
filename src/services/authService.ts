/* ============================================================
   NotiPoliWeb — Servicio de autenticación
   Registro, login y manejo de la sesión activa.
   ============================================================ */

import { STORAGE_KEYS, eliminarClave, escribir, leer } from '@/services/storage';
import type {
  DatosRegistro,
  ResultadoAuthConSesion,
  Sesion,
  Usuario,
} from '@/types';
import {
  validarApellido,
  validarConfirmacionPassword,
  validarCorreo,
  validarNombre,
  validarPassword,
  validarTerminos,
} from '@/utils/validaciones';

/* ---------------- Usuarios ---------------- */

export function getUsuarios(): Usuario[] {
  return leer<Usuario[]>(STORAGE_KEYS.USUARIOS, []);
}

export function setUsuarios(lista: Usuario[]): void {
  escribir(STORAGE_KEYS.USUARIOS, lista);
}

export function buscarUsuario(email: string): Usuario | undefined {
  const objetivo = email.trim().toLowerCase();
  return getUsuarios().find((u) => u.email.toLowerCase() === objetivo);
}

/** Variante de `validarCorreo` que además comprueba que no esté registrado. */
export function validarCorreoUnico(valor: string): string {
  const errorFormato = validarCorreo(valor);
  if (errorFormato) return errorFormato;
  if (buscarUsuario(valor)) return 'Ya existe una cuenta con este correo.';
  return '';
}

/* ---------------- Sesión ---------------- */

export function getSesion(): Sesion | null {
  return leer<Sesion | null>(STORAGE_KEYS.SESION, null);
}

export function setSesion(sesion: Sesion): void {
  escribir(STORAGE_KEYS.SESION, sesion);
}

export function limpiarSesion(): void {
  eliminarClave(STORAGE_KEYS.SESION);
}

/* ---------------- Operaciones ---------------- */

export function iniciarSesion(correo: string, password: string): ResultadoAuthConSesion {
  const errorCorreo = validarCorreo(correo);
  if (errorCorreo) return { ok: false, error: errorCorreo };

  const errorPassword = validarPassword(password);
  if (errorPassword) return { ok: false, error: errorPassword };

  const usuario = buscarUsuario(correo);
  if (!usuario) {
    return { ok: false, error: 'No existe una cuenta con ese correo.' };
  }
  if (usuario.password !== password) {
    return { ok: false, error: 'Contraseña incorrecta. Inténtalo de nuevo.' };
  }

  const sesion: Sesion = {
    email: usuario.email,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
  };
  setSesion(sesion);
  return { ok: true, sesion };
}

export function registrarUsuario(datos: DatosRegistro): ResultadoAuthConSesion {
  const errores = [
    validarNombre(datos.nombre),
    validarApellido(datos.apellido),
    validarCorreoUnico(datos.correo),
    validarPassword(datos.password),
    validarConfirmacionPassword(datos.password2, datos.password),
    validarTerminos(datos.terminos),
  ];
  const primerError = errores.find((e) => e !== '');
  if (primerError) return { ok: false, error: primerError };

  const nuevoUsuario: Usuario = {
    nombre: datos.nombre.trim(),
    apellido: datos.apellido.trim(),
    email: datos.correo.trim().toLowerCase(),
    password: datos.password,
    fechaRegistro: new Date().toISOString(),
  };

  setUsuarios([...getUsuarios(), nuevoUsuario]);

  // Auto-login tras el registro, igual que en la versión HTML.
  const sesion: Sesion = {
    email: nuevoUsuario.email,
    nombre: nuevoUsuario.nombre,
    apellido: nuevoUsuario.apellido,
  };
  setSesion(sesion);
  return { ok: true, sesion };
}

/* ---------------- Utilidades de presentación ---------------- */

export function nombreCompleto(sesion: Sesion | null): string {
  if (!sesion) return '';
  return `${sesion.nombre} ${sesion.apellido ?? ''}`.trim();
}
