import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  alternarFavorito as alternarFavoritoStorage,
  cargarNoticias,
  crearNoticia as crearNoticiaStorage,
  eliminarNoticia as eliminarNoticiaStorage,
  getFavoritos,
  noticiasRelacionadas,
} from '@/services/noticiasService';
import type { Noticia, NoticiaFormValues } from '@/types';

/* ============================================================
   NotiPoliWeb — Contexto de noticias y favoritos
   Es la única fuente de verdad sobre las noticias visibles.
   ============================================================ */

interface NoticiasContextValue {
  noticias: Noticia[];
  favoritos: number[];
  esFavorito: (id: number) => boolean;
  /** Devuelve `true` si la noticia quedó guardada como favorita. */
  alternarFavorito: (id: number) => boolean;
  crear: (values: NoticiaFormValues) => Noticia | null;
  eliminar: (id: number) => void;
  obtenerPorId: (id: number) => Noticia | undefined;
  relacionadasDe: (noticia: Noticia, limite?: number) => Noticia[];
  noticiasDeAutor: (email: string) => Noticia[];
  noticiasDeOtros: (email: string) => Noticia[];
}

const NoticiasContext = createContext<NoticiasContextValue | null>(null);

export function NoticiasProvider({ children }: { children: ReactNode }) {
  const { sesion } = useAuth();
  const [noticias, setNoticias] = useState<Noticia[]>(() => cargarNoticias());
  const [favoritos, setFavoritos] = useState<number[]>([]);

  // Los favoritos son por usuario: al cambiar de sesión se recargan.
  useEffect(() => {
    setFavoritos(sesion ? getFavoritos(sesion.email) : []);
  }, [sesion]);

  const esFavorito = useCallback(
    (id: number) => favoritos.includes(id),
    [favoritos],
  );

  const alternarFavorito = useCallback(
    (id: number) => {
      if (!sesion) return false;
      const agregado = alternarFavoritoStorage(sesion.email, id);
      setFavoritos(getFavoritos(sesion.email));
      return agregado;
    },
    [sesion],
  );

  const crear = useCallback(
    (values: NoticiaFormValues) => {
      if (!sesion) return null;
      const nueva = crearNoticiaStorage(values, sesion, noticias);
      setNoticias((previas) => [...previas, nueva]);
      return nueva;
    },
    [sesion, noticias],
  );

  const eliminar = useCallback((id: number) => {
    eliminarNoticiaStorage(id);
    setNoticias((previas) => previas.filter((n) => n.id !== id));
  }, []);

  const obtenerPorId = useCallback(
    (id: number) => noticias.find((n) => n.id === id),
    [noticias],
  );

  const relacionadasDe = useCallback(
    (noticia: Noticia, limite = 4) => noticiasRelacionadas(noticias, noticia, limite),
    [noticias],
  );

  const noticiasDeAutor = useCallback(
    (email: string) => noticias.filter((n) => n.autorEmail === email),
    [noticias],
  );

  const noticiasDeOtros = useCallback(
    (email: string) => noticias.filter((n) => n.autorEmail !== email),
    [noticias],
  );

  const valor = useMemo<NoticiasContextValue>(
    () => ({
      noticias,
      favoritos,
      esFavorito,
      alternarFavorito,
      crear,
      eliminar,
      obtenerPorId,
      relacionadasDe,
      noticiasDeAutor,
      noticiasDeOtros,
    }),
    [
      noticias,
      favoritos,
      esFavorito,
      alternarFavorito,
      crear,
      eliminar,
      obtenerPorId,
      relacionadasDe,
      noticiasDeAutor,
      noticiasDeOtros,
    ],
  );

  return <NoticiasContext.Provider value={valor}>{children}</NoticiasContext.Provider>;
}

export function useNoticias(): NoticiasContextValue {
  const contexto = useContext(NoticiasContext);
  if (!contexto) {
    throw new Error('useNoticias debe usarse dentro de <NoticiasProvider>');
  }
  return contexto;
}
