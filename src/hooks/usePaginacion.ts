import { useCallback, useEffect, useMemo, useState } from 'react';

/* ============================================================
   NotiPoliWeb — Paginación de listados
   Devuelve solo el tramo visible y se autorregula: si la lista se
   acorta (por ejemplo al eliminar una noticia) y la página actual
   queda fuera de rango, retrocede a la última válida.
   ============================================================ */

interface Paginacion<T> {
  pagina: number;
  totalPaginas: number;
  total: number;
  visibles: T[];
  /** Índice (1-based) del primer y último elemento de la página. */
  desde: number;
  hasta: number;
  irA: (pagina: number) => void;
  /** Vuelve a la primera página (útil al cambiar un filtro). */
  reiniciar: () => void;
}

export function usePaginacion<T>(items: T[], tamano: number): Paginacion<T> {
  const [pagina, setPagina] = useState(1);

  const totalPaginas = Math.max(1, Math.ceil(items.length / tamano));

  // Si la lista se reduce, no dejar la página fuera de rango.
  useEffect(() => {
    setPagina((actual) => Math.min(actual, totalPaginas));
  }, [totalPaginas]);

  const visibles = useMemo(() => {
    const inicio = (pagina - 1) * tamano;
    return items.slice(inicio, inicio + tamano);
  }, [items, pagina, tamano]);

  // Identidad estable: así puede usarse como dependencia de un efecto.
  const reiniciar = useCallback(() => setPagina(1), []);

  const desde = items.length === 0 ? 0 : (pagina - 1) * tamano + 1;
  const hasta = (pagina - 1) * tamano + visibles.length;

  return {
    pagina,
    totalPaginas,
    total: items.length,
    visibles,
    desde,
    hasta,
    irA: setPagina,
    reiniciar,
  };
}
