import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useNoticias } from '@/context/NoticiasContext';
import { useNotificacion } from '@/context/NotificacionContext';

/* ============================================================
   NotiPoliWeb — Hook de favoritos
   Centraliza la regla "necesitas sesión para guardar favoritos"
   que en la versión HTML vivía dentro de cada `toggleFavorito`.
   ============================================================ */

interface UseFavoritoResult {
  esFavorito: (id: number) => boolean;
  alternar: (id: number, rutaRetorno?: string) => void;
}

export function useFavorito(): UseFavoritoResult {
  const { sesion } = useAuth();
  const { esFavorito, alternarFavorito } = useNoticias();
  const { mostrar } = useNotificacion();
  const navigate = useNavigate();

  const alternar = useCallback(
    (id: number, rutaRetorno?: string) => {
      if (!sesion) {
        mostrar('Debes iniciar sesión para guardar favoritos.', 'warning');
        navigate('/login', {
          state: { desde: rutaRetorno ?? '/noticias', motivo: 'favoritos' },
        });
        return;
      }

      const agregado = alternarFavorito(id);
      mostrar(
        agregado ? 'Noticia añadida a tus favoritos.' : 'Noticia quitada de tus favoritos.',
        agregado ? 'success' : 'info',
      );
    },
    [sesion, alternarFavorito, mostrar, navigate],
  );

  return { esFavorito, alternar };
}
