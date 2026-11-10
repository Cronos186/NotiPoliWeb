/* ============================================================
   NotiPoliWeb — Servicio de autenticación
   Registro, login y manejo de la sesión activa.
   Ahora consume API REST.
   ============================================================ */

import { STORAGE_KEYS, eliminarClave, escribir, leer } from '@/services/storage';
import type { DatosRegistro, ResultadoAuthConSesion, Sesion, Usuario } from '@/types';
import { validarApellido, validarConfirmacionPassword, validarCorreo, validarNombre, validarPassword, validarTerminos } from '@/utils/validaciones';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3000';

export async function getUsuarios(): Promise<Usuario[]> {
  const response = await fetch(`${API_URL}/usuarios`);
  if (!response.ok) throw new Error('Error al obtener usuarios');
  return response.json();
}

export async function buscarUsuario(email: string): Promise<Usuario | undefined> {
  const response = await fetch(`${API_URL}/usuarios/${encodeURIComponent(email.trim().toLowerCase())}`);
  if (!response.ok) return undefined;
  const text = await response.text();
  if (!text) return undefined;
  return JSON.parse(text);
}

export async function validarCorreoUnico(valor: string): Promise<string> {
  const errorFormato = validarCorreo(valor);
  if (errorFormato) return errorFormato;
  const usuario = await buscarUsuario(valor);
  if (usuario) return 'Ya existe una cuenta con este correo.';
  return '';
}

export function getSesion(): Sesion | null {
  return leer<Sesion | null>(STORAGE_KEYS.SESION, null);
}

export function setSesion(sesion: Sesion): void {
  escribir(STORAGE_KEYS.SESION, sesion);
}

export function limpiarSesion(): void {
  eliminarClave(STORAGE_KEYS.SESION);
}

export async function iniciarSesion(correo: string, password: string): Promise<ResultadoAuthConSesion> {
  const errorCorreo = validarCorreo(correo);
  if (errorCorreo) return { ok: false, error: errorCorreo };
  const errorPassword = validarPassword(password);
  if (errorPassword) return { ok: false, error: errorPassword };
  const usuario = await buscarUsuario(correo);
  if (!usuario) return { ok: false, error: 'No existe una cuenta con ese correo.' };
  if (usuario.password !== password) return { ok: false, error: 'Contraseña incorrecta. Inténtalo de nuevo.' };
  const sesion: Sesion = { email: usuario.email, nombre: usuario.nombre, apellido: usuario.apellido };
  setSesion(sesion);
  return { ok: true, sesion };
}

export async function registrarUsuario(datos: DatosRegistro): Promise<ResultadoAuthConSesion> {
  const errores = [
    validarNombre(datos.nombre),
    validarApellido(datos.apellido),
    await validarCorreoUnico(datos.correo),
    validarPassword(datos.password),
    validarConfirmacionPassword(datos.password2, datos.password),
    validarTerminos(datos.terminos)
  ];
  const primerError = errores.find(e => e !== '');
  if (primerError) return { ok: false, error: primerError };
  const nuevoUsuario: Usuario = {
    nombre: datos.nombre.trim(),
    apellido: datos.apellido.trim(),
    email: datos.correo.trim().toLowerCase(),
    password: datos.password,
    fechaRegistro: new Date().toISOString()
  };
  const response = await fetch(`${API_URL}/usuarios`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nuevoUsuario) });
  if (!response.ok) return { ok: false, error: 'Error al registrar usuario' };
  const sesion: Sesion = { email: nuevoUsuario.email, nombre: nuevoUsuario.nombre, apellido: nuevoUsuario.apellido };
  setSesion(sesion);
  return { ok: true, sesion };
}

export function nombreCompleto(sesion: Sesion | null): string {
  if (!sesion) return '';
  return `${sesion.nombre} ${sesion.apellido ?? ''}`.trim();
}
