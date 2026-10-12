import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import Seccion from '@/components/Seccion';
import { useNoticias } from '@/context/NoticiasContext';
import { getUsuarios } from '@/services/authService';
import { DATOS_PROYECTO, MARCA } from '@/constants';
import { heroGradientSx } from '@/theme';

/* ============================================================
   NotiPoliWeb — Acerca de
   Reemplaza a acerca-de.html + acerca.js, incluyendo los
   contadores animados de las estadísticas.
   ============================================================ */

/** Contador animado: reproduce `animarContador()` de acerca.js. */
function Contador({ valor }: { valor: number }) {
  const [actual, setActual] = useState(0);

  useEffect(() => {
    const duracion = 800;
    const inicio = performance.now();
    let frame = 0;

    const animar = (ahora: number) => {
      const progreso = Math.min((ahora - inicio) / duracion, 1);
      setActual(Math.round(valor * progreso));
      if (progreso < 1) frame = requestAnimationFrame(animar);
    };

    frame = requestAnimationFrame(animar);
    return () => cancelAnimationFrame(frame);
  }, [valor]);

  return <>{actual}</>;
}

const PILARES: { icono: ReactNode; titulo: string; texto: string }[] = [
  {
    icono: <TrackChangesIcon />,
    titulo: 'Misión',
    texto:
      'Ofrecer un espacio digital accesible donde las personas puedan informarse, compartir experiencias y construir comunidad en torno a la información veraz.',
  },
  {
    icono: <VisibilityIcon />,
    titulo: 'Visión',
    texto:
      'Ser la plataforma de referencia regional para la publicación de noticias colaborativas, reconocida por su diseño intuitivo y su compromiso con la verdad.',
  },
  {
    icono: <VolunteerActivismIcon />,
    titulo: 'Valores',
    texto:
      'Transparencia, respeto por la diversidad de opiniones, innovación constante y compromiso con el acceso libre a la información.',
  },
];

const PARRAFOS = [
  `NotiPoliWeb nació como una iniciativa para conectar a la comunidad con las historias que importan. Somos un equipo de estudiantes y profesionales apasionados por el periodismo digital y la tecnología.`,
  `Nuestra plataforma permite a los usuarios no solo leer noticias, sino también publicar sus propias experiencias, guardar sus favoritos y participar activamente en la construcción de un espacio informativo colaborativo.`,
  `Creemos que la información debe ser accesible, veraz y cercana. Por eso trabajamos cada día para ofrecer una experiencia intuitiva, moderna y útil para todos.`,
];

export default function AcercaDePage() {
  const { noticias } = useNoticias();
  const [totalUsuarios] = useState(() => getUsuarios().length);

  const estadisticas: {
    valor: number;
    etiqueta: string;
    animado?: boolean;
    sufijo?: string;
  }[] = [
    { valor: noticias.length, etiqueta: 'Noticias publicadas', animado: true },
    { valor: 4, etiqueta: 'Categorías activas' },
    { valor: totalUsuarios, etiqueta: 'Usuarios registrados', animado: true },
    { valor: 100, etiqueta: 'Gratuito y abierto', sufijo: '%' },
  ];

  return (
    <>
      {/* ==================== HERO ==================== */}
      <Box component="section" sx={heroGradientSx}>
        <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
          Acerca de {DATOS_PROYECTO.nombre}
        </Typography>

        <Typography
          variant="body1"
          sx={{ opacity: 0.95, maxWidth: 700, mx: 'auto', fontSize: '1.125rem' }}
        >
          Un espacio digital donde las experiencias educativas, tecnológicas, turísticas y
          comerciales encuentran su voz.
        </Typography>
      </Box>

      {/* ==================== QUIÉNES SOMOS ==================== */}
      <Seccion>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 4, md: 6 }}>
          <Box sx={{ flex: 2 }}>
            <Typography variant="h2" component="h2" sx={{ color: 'primary.main', mb: 2 }}>
              ¿Quiénes somos?
            </Typography>
            <Divider sx={{ mb: 3, borderColor: '#D1D5DB' }} />

            <Stack spacing={2}>
              {PARRAFOS.map((parrafo) => (
                <Typography key={parrafo.slice(0, 24)} variant="body1" sx={{ color: '#374151' }}>
                  {parrafo}
                </Typography>
              ))}
            </Stack>
          </Box>

          <Box sx={{ flex: 1, minWidth: { md: 260 } }}>
            <Paper
              sx={{
                height: '100%',
                minHeight: 240,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                bgcolor: '#E0E7FF',
                color: 'primary.main',
                p: 4,
              }}
            >
              <Box aria-hidden sx={{ color: 'primary.main', '& svg': { fontSize: '3.5rem' } }}>
                <NewspaperIcon />
              </Box>              <Typography sx={{ fontWeight: 700 }}>Equipo {DATOS_PROYECTO.nombre}</Typography>
            </Paper>
          </Box>
        </Stack>
      </Seccion>

      {/* ==================== ESTADÍSTICAS ==================== */}
      <Box component="section" sx={{ bgcolor: MARCA.grisFondo, py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{ color: 'primary.main', textAlign: 'center', mb: 4 }}
          >
            {DATOS_PROYECTO.nombre} en números
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{ flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}
          >
            {estadisticas.map((stat) => (
              <Card key={stat.etiqueta} sx={{ flex: 1, minWidth: 200, maxWidth: 260 }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography
                    variant="h1"
                    component="span"
                    sx={{ display: 'block', color: 'secondary.main', fontWeight: 700 }}
                  >
                    {stat.animado ? <Contador valor={stat.valor} /> : stat.valor}
                    {stat.sufijo ?? ''}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {stat.etiqueta}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ==================== PILARES ==================== */}
      <Seccion titulo="Nuestros Pilares" divisor>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          {PILARES.map((pilar) => (
            <Card key={pilar.titulo} sx={{ flex: 1 }}>
              <CardContent sx={{ p: 4 }}>
                <Box aria-hidden sx={{ color: 'primary.main', mb: 2, '& svg': { fontSize: '2.5rem' } }}>
                  {pilar.icono}
                </Box>

                <Typography variant="h3" component="h3" sx={{ color: 'primary.main', mb: 1 }}>
                  {pilar.titulo}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {pilar.texto}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Seccion>

      {/* ==================== CTA ==================== */}
      <Box component="section" sx={{ bgcolor: MARCA.grisFondo, py: { xs: 5, md: 7 } }}>
        <Container maxWidth="sm" sx={{ px: { xs: 2, md: 3 }, textAlign: 'center' }}>
          <Typography variant="h2" component="h2" sx={{ color: 'primary.main', mb: 1 }}>
            ¿Quieres saber más?
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Escríbenos y te responderemos lo antes posible.
          </Typography>

          <Button component={RouterLink} to="/contacto" variant="contained" size="large">
            Ir a Contacto
          </Button>
        </Container>
      </Box>
    </>
  );
}
