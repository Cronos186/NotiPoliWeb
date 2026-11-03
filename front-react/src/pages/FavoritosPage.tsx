import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ChipCategoria from '@/components/ChipCategoria';
import DialogoConfirmacion, { useConfirmacion } from '@/components/DialogoConfirmacion';
import EstadoVacio from '@/components/EstadoVacio';
import Paginador from '@/components/Paginador';
import Seccion from '@/components/Seccion';
import { TAMANO_PAGINA } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { useNoticias } from '@/context/NoticiasContext';
import { useNotificacion } from '@/context/NotificacionContext';
import { usePaginacion } from '@/hooks/usePaginacion';
import { formatearFecha } from '@/utils/fechas';
import type { Noticia } from '@/types';

/* ============================================================
   NotiPoliWeb — Mis favoritos
   Reemplaza a favoritos.html + favoritos.js.
   ============================================================ */

export default function FavoritosPage() {
  const { sesion } = useAuth();
  const { noticias, favoritos, alternarFavorito } = useNoticias();
  const { mostrar } = useNotificacion();
  const confirmacion = useConfirmacion<Noticia>();

  const guardadas = noticias.filter((n) => favoritos.includes(n.id));

  const paginacion = usePaginacion(guardadas, TAMANO_PAGINA.favoritos);

  const subtitulo =
    guardadas.length === 0
      ? `Bienvenido, ${sesion?.nombre ?? ''}. Aún no tienes noticias guardadas.`
      : `${guardadas.length} ${
          guardadas.length === 1 ? 'noticia guardada' : 'noticias guardadas'
        } por ${sesion?.nombre ?? ''}.`;

  const confirmarQuitar = () => {
    const objetivo = confirmacion.objetivo;
    if (!objetivo) return;
    alternarFavorito(objetivo.id);
    confirmacion.cerrar();
    mostrar(`"${objetivo.titulo}" salió de tus favoritos.`, 'info');
  };

  return (
    <>
      <Seccion titulo="Mis Favoritos" subtitulo={subtitulo} nivelTitulo="h1" divisor>
        {guardadas.length === 0 ? (
          <EstadoVacio
            icono={<FavoriteBorderIcon />}
            titulo="Aún no tienes favoritos"
            texto="Explora las noticias y guarda las que más te interesen con el botón de corazón."
            accion={
              <Button component={RouterLink} to="/noticias" variant="contained" size="large">
                Explorar Noticias
              </Button>
            }
          />
        ) : (
          <>
            <Stack spacing={3}>
              {paginacion.visibles.map((noticia) => (
              <Card
                key={noticia.id}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  overflow: 'hidden',
                  borderRadius: 3,
                }}
              >
                <CardMedia
                  component="img"
                  image={noticia.imagen}
                  alt={noticia.titulo}
                  loading="lazy"
                  sx={{
                    width: { xs: '100%', sm: 240 },
                    height: { xs: 200, sm: 'auto' },
                    minHeight: { sm: 190 },
                    objectFit: 'cover',
                    bgcolor: '#E5E7EB',
                    flexShrink: 0,
                  }}
                />

                <CardContent
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 1,
                    p: 3,
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{ alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 0.5 }}
                  >
                    <ChipCategoria categoria={noticia.categoria} />

                    <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                      <CalendarMonthIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatearFecha(noticia.fecha)}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Typography variant="h4" component="h3">
                    {noticia.titulo}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                    {noticia.descripcion}
                  </Typography>

                  <Stack direction="row" sx={{ gap: 1.5, flexWrap: 'wrap', mt: 1 }}>
                    <Button
                      component={RouterLink}
                      to={`/noticias/${noticia.id}`}
                      variant="outlined"
                      size="small"
                    >
                      Ver detalle
                    </Button>

                    <Button
                      onClick={() => confirmacion.abrir(noticia)}
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<RemoveCircleIcon />}
                    >
                      Quitar de favoritos
                    </Button>
                  </Stack>
                </CardContent>

                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 3,
                    color: 'error.main',
                    fontSize: '1.75rem',
                  }}
                  aria-hidden
                >
                  <FavoriteIcon fontSize="inherit" />
                </Box>
              </Card>
            ))}
            </Stack>

            <Paginador
              pagina={paginacion.pagina}
              totalPaginas={paginacion.totalPaginas}
              onCambiar={paginacion.irA}
              resumen={`mostrando ${paginacion.desde}–${paginacion.hasta} de ${paginacion.total} favoritos`}
            />
          </>
        )}
      </Seccion>

      <DialogoConfirmacion
        abierto={confirmacion.abierto}
        titulo="Quitar de favoritos"
        mensaje={
          <>
            ¿Quieres quitar <strong>&ldquo;{confirmacion.objetivo?.titulo}&rdquo;</strong> de tus
            favoritos?
          </>
        }
        textoConfirmar="Quitar"
        onConfirmar={confirmarQuitar}
        onCancelar={confirmacion.cerrar}
      />
    </>
  );
}
