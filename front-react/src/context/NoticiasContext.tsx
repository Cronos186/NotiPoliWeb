import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { alternarFavorito as alternarFavoritoService, cargarNoticias, crearNoticia as crearNoticiaService, eliminarNoticia as eliminarNoticiaService, getFavoritos, noticiasRelacionadas } from '@/services/noticiasService';
import type { Noticia, NoticiaFormValues } from '@/types';

interface NoticiasContextValue {
  noticias: Noticia[];
  favoritos: number[];
  esFavorito: (id: number) => boolean;
  alternarFavorito: (id: number) => Promise<boolean>;
  crear: (values: NoticiaFormValues) => Promise<Noticia | null>;
  eliminar: (id: number) => Promise<void>;
  obtenerPorId: (id: number) => Noticia | undefined;
  relacionadasDe: (noticia: Noticia, limite?: number) => Noticia[];
  noticiasDeAutor: (email: string) => Noticia[];
  noticiasDeOtros: (email: string) => Noticia[];
}

const NoticiasContext = createContext<NoticiasContextValue | null>(null);

export function NoticiasProvider({ children }: { children: ReactNode }) {
  const { sesion } = useAuth();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [favoritos, setFavoritos] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;
    cargarNoticias().then(data => { if (!cancelled) setNoticias(data); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!sesion) { setFavoritos([]); return; }
    let cancelled = false;
    getFavoritos(sesion.email).then(data => { if (!cancelled) setFavoritos(data); });
    return () => { cancelled = true; };
  }, [sesion]);

  const esFavorito = useCallback((id: number) => favoritos.includes(id), [favoritos]);

  const alternarFavorito = useCallback(async (id: number) => {
    if (!sesion) return false;
    const agregado = await alternarFavoritoService(sesion.email, id);
    const nuevos = await getFavoritos(sesion.email);
    setFavoritos(nuevos);
    return agregado;
  }, [sesion]);

  const crear = useCallback(async (values: NoticiaFormValues) => {
    if (!sesion) return null;
    const nueva = await crearNoticiaService(values, sesion);
    setNoticias(prev => [...prev, nueva]);
    return nueva;
  }, [sesion]);

  const eliminar = useCallback(async (id: number) => {
    await eliminarNoticiaService(id);
    setNoticias(prev => prev.filter(n => n.id !== id));
  }, []);

  const obtenerPorId = useCallback((id: number) => noticias.find(n => n.id === id), [noticias]);
  const relacionadasDe = useCallback((noticia: Noticia, limite = 4) => noticiasRelacionadas(noticias, noticia, limite), [noticias]);
  const noticiasDeAutor = useCallback((email: string) => noticias.filter(n => n.autorEmail === email), [noticias]);
  const noticiasDeOtros = useCallback((email: string) => noticias.filter(n => n.autorEmail !== email), [noticias]);

  const valor = useMemo<NoticiasContextValue>(() => ({
    noticias, favoritos, esFavorito, alternarFavorito, crear, eliminar, obtenerPorId, relacionadasDe, noticiasDeAutor, noticiasDeOtros
  }), [noticias, favoritos, esFavorito, alternarFavorito, crear, eliminar, obtenerPorId, relacionadasDe, noticiasDeAutor, noticiasDeOtros]);

  return <NoticiasContext.Provider value={valor}>{children}</NoticiasContext.Provider>;
}

export function useNoticias(): NoticiasContextValue {
  const contexto = useContext(NoticiasContext);
  if (!contexto) throw new Error('useNoticias debe usarse dentro de <NoticiasProvider>');
  return contexto;
}
