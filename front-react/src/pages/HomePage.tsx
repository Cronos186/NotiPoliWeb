import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InboxIcon from '@mui/icons-material/Inbox';
import EstadoVacio from '@/components/EstadoVacio';
import { ListaNoticias } from '@/components/NoticiaCard';
import Seccion from '@/components/Seccion';
import { DATOS_PROYECTO, MARCA } from '@/constants';
import { useNoticias } from '@/context/NoticiasContext';
import { heroGradientSx } from '@/theme';

/* ============================================================
   NotiPoliWeb — Página de inicio
   ============================================================ */

export default function HomePage() {
  const { noticias } = useNoticias();
  const destacadas = noticias.slice(0, 3);

  return (
    <>
      {/* ==================== HERO ==================== */}
      <Box component="section" sx={heroGradientSx}>
        <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
          ¡Bienvenido a {DATOS_PROYECTO.nombre}!
        </Typography>

        <Typography
          variant="body1"
          sx={{ opacity: 0.95, mb: 4, maxWidth: 700, mx: 'auto', fontSize: '1.125rem' }}
        >
          {DATOS_PROYECTO.eslogan}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button component={RouterLink} to="/noticias" variant="contained" color="secondary" size="large">
            Explorar Noticias
          </Button>

          <Button
            component={RouterLink}
            to="/contacto"
            variant="outlined"
            size="large"
            sx={{
              borderColor: '#FFFFFF',
              borderWidth: 2,
              color: '#FFFFFF',
              '&:hover': { borderColor: '#FFFFFF', borderWidth: 2, bgcolor: 'rgba(255,255,255,.12)' },
            }}
          >
            Contactar
          </Button>
        </Stack>
      </Box>

      {/* ==================== NOTICIAS DESTACADAS ==================== */}
      <Seccion titulo="Noticias Destacadas" divisor>
        {destacadas.length > 0 ? (
          <ListaNoticias noticias={destacadas} />
        ) : (
          <EstadoVacio
            icono={<InboxIcon />}
            titulo="No hay noticias disponibles"
            texto="Vuelve más tarde o publica tú mismo la primera noticia."
          />
        )}
      </Seccion>

      {/* ==================== TESTIMONIOS ==================== */}
      <Box component="section" sx={{ bgcolor: MARCA.grisFondo, py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{ color: 'primary.main', textAlign: 'center', mb: 4 }}
          >
            Lo que dicen nuestros usuarios
          </Typography>

          <Card sx={{ maxWidth: 700, mx: 'auto', textAlign: 'center' }}>
            <CardContent sx={{ p: 5 }}>
              <Typography
                variant="body1"
                sx={{ fontStyle: 'italic', color: '#374151', mb: 2, fontSize: '1.0625rem' }}
              >
                "Excelente plataforma, muy fácil de usar y con contenido de calidad."
              </Typography>

              <Typography sx={{ color: 'primary.main', fontWeight: 600 }}>
                — María González
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}
