import { Link as RouterLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MailIcon from '@mui/icons-material/Mail';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ChipCategoria from '@/components/ChipCategoria';
import DialogoConfirmacion, { useConfirmacion } from '@/components/DialogoConfirmacion';
import EstadoVacio from '@/components/EstadoVacio';
import { ListaNoticiasCompacta } from '@/components/NoticiaCard';
import Seccion from '@/components/Seccion';
import { useAuth } from '@/context/AuthContext';
import { useNoticias } from '@/context/NoticiasContext';
import { useNotificacion } from '@/context/NotificacionContext';
import { useFavorito } from '@/hooks/useFavorito';
import { formatearFecha } from '@/utils/fechas';
import type { Noticia } from '@/types';

/* ============================================================
   NotiPoliWeb — Detalle de una noticia
   Reemplaza a detalle.html + detalle.js. La noticia se identifica
   por el parámetro de ruta `/noticias/:id` en lugar de `?id=`.
   ============================================================ */

export default function DetallePage() {
  const { id } = useParams<{ id: string }>();
  const { obtenerPorId, relacionadasDe, eliminar } = useNoticias();
  const { sesion } = useAuth();
  const { esFavorito, alternar } = useFavorito();
  const { mostrar } = useNotificacion();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const confirmacion = useConfirmacion<Noticia>();

  const idNumerico = Number(id);
  const noticia = Number.isFinite(idNumerico) ? obtenerPorId(idNumerico) : undefined;

  /* ---------- Noticia inexistente ---------- */
  if (!noticia) {
    return (
      <Seccion>
        <EstadoVacio
          icono={<SearchOffIcon />}
          titulo="La noticia que buscas no existe"
          texto="Puede que haya sido eliminada o que el enlace esté equivocado."
          nivelTitulo="h1"
          accion={
            <Button component={RouterLink} to="/noticias" variant="contained" size="large">
              Volver al listado
            </Button>
          }
        />
      </Seccion>
    );
  }

  const favorito = esFavorito(noticia.id);
  const esAutor = sesion?.email === noticia.autorEmail;
  const relacionadas = relacionadasDe(noticia);

  const confirmarEliminar = () => {
    const objetivo = confirmacion.objetivo;
    if (!objetivo) return;
    eliminar(objetivo.id);
    confirmacion.cerrar();
    mostrar(`La noticia "${objetivo.titulo}" fue eliminada.`, 'info');
    navigate('/noticias');
  };

  return (
    <>
      <Container maxWidth="md" sx={{ px: { xs: 2, md: 3 }, py: { xs: 4, md: 6 } }}>
        <article>
          <Box
            component="img"
            src={noticia.imagen}
            alt={noticia.titulo}
            sx={{
              width: '100%',
              maxHeight: 420,
              objectFit: 'cover',
              borderRadius: 3,
              bgcolor: '#E5E7EB',
              mb: 3,
            }}
          />

          <Stack
            direction="row"
            sx={{ flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 2 }}
          >
            <ChipCategoria categoria={noticia.categoria} />

            <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
              <CalendarMonthIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {formatearFecha(noticia.fecha)}
              </Typography>
            </Stack>

            <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
              <EditNoteIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {noticia.autorNombre}
              </Typography>
            </Stack>
          </Stack>

          <Typography variant="h1" component="h1" sx={{ mb: 3, color: 'primary.main' }}>
            {noticia.titulo}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography
            variant="body1"
            sx={{ color: '#374151', lineHeight: 1.8, whiteSpace: 'pre-line', mb: 4 }}
          >
            {noticia.contenido}
          </Typography>

          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 2 }}>
            <Button
              onClick={() => alternar(noticia.id, pathname)}
              variant={favorito ? 'contained' : 'outlined'}
              color={favorito ? 'error' : 'primary'}
              startIcon={favorito ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            >
              {favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            </Button>

            <Button
              component={RouterLink}
              to="/contacto"
              variant="outlined"
              color="primary"
              startIcon={<MailIcon />}
            >
              Contactar
            </Button>

            {esAutor && (
              <Button
                onClick={() => confirmacion.abrir(noticia)}
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
              >
                Eliminar noticia
              </Button>
            )}
          </Stack>

          <Button
            component={RouterLink}
            to="/noticias"
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 4, color: 'primary.main' }}
          >
            Volver al listado
          </Button>
        </article>
      </Container>

      {relacionadas.length > 0 && (
        <Seccion titulo="Noticias Relacionadas" fondoGris divisor>
          <ListaNoticiasCompacta noticias={relacionadas} />
        </Seccion>
      )}

      <DialogoConfirmacion
        abierto={confirmacion.abierto}
        titulo="Eliminar noticia"
        mensaje={
          <>
            ¿Seguro que quieres eliminar{' '}
            <strong>&ldquo;{confirmacion.objetivo?.titulo}&rdquo;</strong>? Esta acción no se puede
            deshacer.
          </>
        }
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminar}
        onCancelar={confirmacion.cerrar}
      />
    </>
  );
}
