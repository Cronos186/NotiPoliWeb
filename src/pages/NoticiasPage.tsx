import { useMemo, useState } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import EstadoVacio from '@/components/EstadoVacio';
import { ListaNoticias } from '@/components/NoticiaCard';
import Paginador from '@/components/Paginador';
import Seccion from '@/components/Seccion';
import { FILTROS, TAMANO_PAGINA } from '@/constants';
import { useNoticias } from '@/context/NoticiasContext';
import { usePaginacion } from '@/hooks/usePaginacion';
import type { FiltroCategoria } from '@/types';

/* ============================================================
   NotiPoliWeb — Listado de noticias con filtros y paginación
   Reemplaza a listados.js.
   ============================================================ */

export default function NoticiasPage() {
  const { noticias } = useNoticias();
  const [filtro, setFiltro] = useState<FiltroCategoria>('Todas');

  const filtradas = useMemo(
    () => (filtro === 'Todas' ? noticias : noticias.filter((n) => n.categoria === filtro)),
    [noticias, filtro],
  );

  const paginacion = usePaginacion(filtradas, TAMANO_PAGINA.noticias);

  /** Al cambiar de categoría se vuelve a la primera página. */
  const cambiarFiltro = (nuevo: FiltroCategoria) => {
    setFiltro(nuevo);
    paginacion.reiniciar();
  };

  return (
    <>
      <Seccion
        titulo="Todas las Noticias"
        subtitulo="Explora las experiencias publicadas por la comunidad."
        nivelTitulo="h1"
      >
        <Stack
          direction="row"
          component="div"
          role="group"
          aria-label="Filtrar por categoría"
          sx={{ flexWrap: 'wrap', gap: 1 }}
        >
          {FILTROS.map((opcion) => {
            const activo = filtro === opcion.valor;
            return (
              <Chip
                key={opcion.valor}
                label={opcion.etiqueta}
                clickable
                onClick={() => cambiarFiltro(opcion.valor)}
                color={activo ? 'primary' : 'default'}
                variant={activo ? 'filled' : 'outlined'}
                aria-pressed={activo}
                sx={{
                  px: 1.5,
                  py: 2.25,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  borderColor: activo ? 'primary.main' : '#D1D5DB',
                }}
              />
            );
          })}
        </Stack>
      </Seccion>

      <Seccion fondoGris>
        {filtradas.length > 0 ? (
          <>
            <ListaNoticias noticias={paginacion.visibles} />

            <Paginador
              pagina={paginacion.pagina}
              totalPaginas={paginacion.totalPaginas}
              onCambiar={paginacion.irA}
              resumen={`mostrando ${paginacion.desde}–${paginacion.hasta} de ${paginacion.total} noticias`}
            />
          </>
        ) : (
          <EstadoVacio
            icono={<CategoryOutlinedIcon />}
            titulo="No hay noticias en esta categoría todavía"
            texto="Prueba con otra categoría o publica tu propia experiencia."
          />
        )}
      </Seccion>
    </>
  );
}
