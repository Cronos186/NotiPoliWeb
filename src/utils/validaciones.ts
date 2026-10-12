/* ============================================================
   NotiPoliWeb — Validaciones de formularios
   Todas devuelven '' cuando el valor es válido o el mensaje de error.
   ============================================================ */

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------------- Autenticación ---------------- */

export function validarCorreo(valor: string): string {
  if (!valor.trim()) return 'El correo es obligatorio.';
  if (!REGEX_CORREO.test(valor.trim())) return 'Ingresa un correo válido.';
  return '';
}

export function validarPassword(valor: string): string {
  if (!valor) return 'La contraseña es obligatoria.';
  if (valor.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
  return '';
}

export function validarNombre(valor: string, minimo = 2): string {
  if (!valor.trim()) return 'El nombre es obligatorio.';
  if (valor.trim().length < minimo) {
    return `El nombre debe tener al menos ${minimo} caracteres.`;
  }
  return '';
}

export function validarApellido(valor: string): string {
  if (!valor.trim()) return 'El apellido es obligatorio.';
  if (valor.trim().length < 2) return 'El apellido debe tener al menos 2 caracteres.';
  return '';
}

export function validarConfirmacionPassword(valor: string, original: string): string {
  if (!valor) return 'Debes confirmar la contraseña.';
  if (valor !== original) return 'Las contraseñas no coinciden.';
  return '';
}

export function validarTerminos(aceptado: boolean): string {
  if (!aceptado) return 'Debes aceptar los términos y condiciones.';
  return '';
}

/* ---------------- Creación de noticias ---------------- */

export function validarTitulo(valor: string): string {
  if (!valor.trim()) return 'El título es obligatorio.';
  if (valor.trim().length < 5) return 'El título debe tener al menos 5 caracteres.';
  return '';
}

export function validarCategoria(valor: string): string {
  if (!valor) return 'Debes seleccionar una categoría.';
  return '';
}

export function validarImagen(valor: string): string {
  if (!valor.trim()) return 'La URL de la imagen es obligatoria.';
  try {
    new URL(valor.trim());
  } catch {
    return 'Ingresa una URL válida (ej: https://...).';
  }
  return '';
}

export function validarDescripcion(valor: string): string {
  const texto = valor.trim();
  if (!texto) return 'La descripción es obligatoria.';
  if (texto.length < 10) return 'La descripción debe tener al menos 10 caracteres.';
  if (texto.length > 150) return 'La descripción no puede superar los 150 caracteres.';
  return '';
}

export function validarContenido(valor: string): string {
  if (!valor.trim()) return 'El contenido es obligatorio.';
  if (valor.trim().length < 30) return 'El contenido debe tener al menos 30 caracteres.';
  return '';
}

/* ---------------- Contacto ---------------- */

export function validarMensaje(valor: string): string {
  if (!valor.trim()) return 'El mensaje es obligatorio.';
  if (valor.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres.';
  return '';
}
