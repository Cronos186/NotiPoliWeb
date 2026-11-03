import { Link as RouterLink, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChipCategoria from '@/components/ChipCategoria';
import { useFavorito } from '@/hooks/useFavorito';
import type { Noticia } from '@/types';

/* ============================================================
   NotiPoliWeb — Tarjeta de noticia
   Reemplaza a `renderCards()` de noticias.js.
   ============================================================ */

export default function NoticiaCard({ noticia }: { noticia: Noticia }) {
  const { esFavorito, alternar } = useFavorito();
  const { pathname } = useLocation();
  const favorito = esFavorito(noticia.id);

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,.12)',
        },
      }}
    >
      <CardMedia
        component="img"
        image={noticia.imagen}
        alt={noticia.titulo}
        loading="lazy"
        sx={{ height: 200, objectFit: 'cover', bgcolor: '#E5E7EB' }}
      />

      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 1,
        }}
      >
        <ChipCategoria categoria={noticia.categoria} />

        <Typography variant="h4" component="h3">
          {noticia.titulo}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
          {noticia.descripcion}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
        <Button
          component={RouterLink}
          to={`/noticias/${noticia.id}`}
          variant="contained"
          fullWidth
        >
          Ver más
        </Button>

        <Tooltip title={favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
          <IconButton
            onClick={() => alternar(noticia.id, pathname)}
            aria-label={
              favorito
                ? `Quitar ${noticia.titulo} de favoritos`
                : `Agregar ${noticia.titulo} a favoritos`
            }
            aria-pressed={favorito}
            sx={{
              width: 44,
              height: 40,
              borderRadius: 2,
              bgcolor: favorito ? 'error.main' : '#FEE2E2',
              color: favorito ? '#FFFFFF' : 'error.main',
              '&:hover': { bgcolor: favorito ? 'error.dark' : '#FECACA' },
            }}
          >
            {favorito ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}

/* ============================================================
   Rejilla de tarjetas a partir de una lista de noticias
   ============================================================ */

export function ListaNoticias({ noticias }: { noticias: Noticia[] }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(300px, 1fr))' },
        gap: 4,
      }}
    >
      {noticias.map((noticia) => (
        <NoticiaCard key={noticia.id} noticia={noticia} />
      ))}
    </Box>
  );
}

/* ============================================================
   Lista compacta (miniatura + título)
   Es el formato que usan las "Noticias Relacionadas" en el
   wireframe 03-detalle.
   ============================================================ */

export function ListaNoticiasCompacta({ noticias }: { noticias: Noticia[] }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 2,
      }}
    >
      {noticias.map((noticia) => (
        <Card
          key={noticia.id}
          component={RouterLink}
          to={`/noticias/${noticia.id}`}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1.5,
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(0,0,0,.12)',
            },
          }}
        >
          <Box
            component="img"
            src={noticia.imagen}
            alt=""
            loading="lazy"
            sx={{
              width: 64,
              height: 48,
              objectFit: 'cover',
              borderRadius: 1.5,
              flexShrink: 0,
              bgcolor: '#E5E7EB',
            }}
          />

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
              {noticia.titulo}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {noticia.categoria}
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
