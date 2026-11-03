/* ============================================================
   NotiPoliWeb — Utilidades de formato
   ============================================================ */

/** "10 de agosto de 2026" */
export function formatearFecha(fechaISO: string): string {
  const fecha = new Date(fechaISO);
  if (Number.isNaN(fecha.getTime())) return fechaISO;
  return fecha.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/** "10 ago 2026" */
export function formatearFechaCorta(fechaISO: string): string {
  const fecha = new Date(fechaISO);
  if (Number.isNaN(fecha.getTime())) return fechaISO;
  return fecha.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** Fecha de hoy en formato ISO corto (YYYY-MM-DD). */
export function fechaHoyISO(): string {
  return new Date().toISOString().split('T')[0];
}
