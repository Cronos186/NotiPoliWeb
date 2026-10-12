import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArticleIcon from '@mui/icons-material/Article';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DialogoConfirmacion, { useConfirmacion } from '@/components/DialogoConfirmacion';
import Seccion from '@/components/Seccion';
import TablaNoticias from '@/components/TablaNoticias';
import { CATEGORIAS } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { useNoticias } from '@/context/NoticiasContext';
import { useNotificacion } from '@/context/NotificacionContext';
import { nombreCompleto } from '@/services/authService';
import {
  validarCategoria,
  validarContenido,
  validarDescripcion,
  validarImagen,
  validarTitulo,
} from '@/utils/validaciones';
import type { Noticia, NoticiaFormValues } from '@/types';

/* ============================================================
   NotiPoliWeb — Gestionar noticias (vista unificada)

   Reproduce el wireframe 08 completo en una sola pantalla:
     · columna izquierda → CREAR NUEVA NOTICIA
     · columna derecha   → MIS NOTICIAS PUBLICADAS (con Eliminar)
                         + OTRAS NOTICIAS DE LA COMUNIDAD (solo lectura)

   Flujo C del wireframe 10: solo el autor puede eliminar su noticia;
   las de otros usuarios aparecen con el botón "Bloqueado".
   ============================================================ */

type CampoFormulario = keyof NoticiaFormValues;

const VALORES_INICIALES: NoticiaFormValues = {
  titulo: '',
  categoria: '',
  imagen: '',
  descripcion: '',
  contenido: '',
};

const VALIDADORES: Record<CampoFormulario, (valor: string) => string> = {
  titulo: validarTitulo,
  categoria: validarCategoria,
  imagen: validarImagen,
  descripcion: validarDescripcion,
  contenido: validarContenido,
};

export default function GestionarNoticiasPage() {
  const { sesion } = useAuth();
  const { crear, eliminar, noticiasDeAutor, noticiasDeOtros } = useNoticias();
  const { mostrar } = useNotificacion();
  const confirmacion = useConfirmacion<Noticia>();
  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down('md'));

  const [valores, setValores] = useState<NoticiaFormValues>(VALORES_INICIALES);
  const [errores, setErrores] = useState<Partial<Record<CampoFormulario, string>>>({});
  const [autorNombre] = useState(() => nombreCompleto(sesion));

  const misNoticias = useMemo(
    () => (sesion ? noticiasDeAutor(sesion.email) : []),
    [sesion, noticiasDeAutor],
  );

  const otrasNoticias = useMemo(
    () => (sesion ? noticiasDeOtros(sesion.email) : []),
    [sesion, noticiasDeOtros],
  );

  const actualizar = (campo: CampoFormulario, valor: string) => {
    setValores((previos) => ({ ...previos, [campo]: valor }));
    setErrores((previos) => ({ ...previos, [campo]: undefined }));
  };

  const validarCampo = (campo: CampoFormulario) =>
    setErrores((previos) => ({ ...previos, [campo]: VALIDADORES[campo](valores[campo]) }));

  const limpiarFormulario = () => {
    setValores(VALORES_INICIALES);
    setErrores({});
  };

  const handleSubmit = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    const nuevosErrores: Partial<Record<CampoFormulario, string>> = {};
    (Object.keys(VALIDADORES) as CampoFormulario[]).forEach((campo) => {
      nuevosErrores[campo] = VALIDADORES[campo](valores[campo]);
    });
    setErrores(nuevosErrores);

    if (Object.values(nuevosErrores).some(Boolean)) {
      mostrar('Revisa los campos marcados en rojo.', 'error');
      return;
    }

    const nueva = crear(valores);
    if (!nueva) {
      mostrar('No se pudo publicar la noticia.', 'error');
      return;
    }

    limpiarFormulario();
    mostrar(`La noticia "${nueva.titulo}" fue publicada correctamente.`, 'success');
  };

  const confirmarEliminar = () => {
    const objetivo = confirmacion.objetivo;
    if (!objetivo || !sesion) return;

    // Doble verificación de autoría antes de borrar.
    if (objetivo.autorEmail !== sesion.email) {
      mostrar('No puedes eliminar noticias de otros autores.', 'error');
      confirmacion.cerrar();
      return;
    }

    eliminar(objetivo.id);
    confirmacion.cerrar();
    mostrar(`La noticia "${objetivo.titulo}" fue eliminada.`, 'info');
  };

  return (
    <>
      <Seccion
        titulo="Gestionar Noticias"
        subtitulo="Crea nuevas noticias y administra las que tú mismo has publicado."
        nivelTitulo="h1"
        divisor
      >
        <Box
          sx={{
            display: 'grid',
            gap: 4,
            alignItems: 'start',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 5fr) minmax(0, 8fr)' },
          }}
        >
          {/* ==================== COLUMNA IZQUIERDA: CREAR ==================== */}
          <Card>
            <CardContent sx={{ p: { xs: 3, lg: 3 } }}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 1.5 }}>
                <AddCircleIcon color="primary" />
                <Typography variant="h3" component="h2">
                  Crear Nueva Noticia
                </Typography>
              </Stack>
              <Divider sx={{ mb: 3 }} />

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2.5}>
                  <TextField
                    id="titulo"
                    label="Título"
                    required
                    value={valores.titulo}
                    onChange={(e) => actualizar('titulo', e.target.value)}
                    onBlur={() => validarCampo('titulo')}
                    error={Boolean(errores.titulo)}
                    helperText={errores.titulo ?? 'Ingresa el título de la noticia'}
                  />

                  <TextField
                    id="categoria"
                    select
                    label="Categoría"
                    required
                    value={valores.categoria}
                    onChange={(e) => actualizar('categoria', e.target.value)}
                    onBlur={() => validarCampo('categoria')}
                    error={Boolean(errores.categoria)}
                    helperText={errores.categoria ?? ' '}
                  >
                    {CATEGORIAS.map((categoria) => (
                      <MenuItem key={categoria} value={categoria}>
                        {categoria}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    id="imagen"
                    label="Imagen (URL)"
                    type="url"
                    required
                    value={valores.imagen}
                    onChange={(e) => actualizar('imagen', e.target.value)}
                    onBlur={() => validarCampo('imagen')}
                    error={Boolean(errores.imagen)}
                    helperText={errores.imagen ?? 'https://...'}
                  />

                  <TextField
                    id="descripcion"
                    label="Descripción breve"
                    required
                    slotProps={{ htmlInput: { maxLength: 150 } }}
                    value={valores.descripcion}
                    onChange={(e) => actualizar('descripcion', e.target.value)}
                    onBlur={() => validarCampo('descripcion')}
                    error={Boolean(errores.descripcion)}
                    helperText={errores.descripcion ?? 'Resumen corto (máx. 150 caracteres)'}
                  />

                  <TextField
                    id="contenido"
                    label="Contenido completo"
                    required
                    multiline
                    minRows={6}
                    value={valores.contenido}
                    onChange={(e) => actualizar('contenido', e.target.value)}
                    onBlur={() => validarCampo('contenido')}
                    error={Boolean(errores.contenido)}
                    helperText={errores.contenido ?? 'Escribe el contenido de la noticia...'}
                  />

                  <Stack direction="row" sx={{ gap: 2, flexWrap: 'wrap' }}>
                    <Button type="submit" variant="contained">
                      Publicar Noticia
                    </Button>

                    <Button
                      type="button"
                      variant="outlined"
                      onClick={limpiarFormulario}
                      startIcon={<RestartAltIcon />}
                    >
                      Limpiar formulario
                    </Button>
                  </Stack>

                  <Alert severity="info" sx={{ fontSize: '0.8125rem' }}>
                    Esta noticia quedará registrada a tu nombre (<strong>{autorNombre}</strong>).
                  </Alert>
                </Stack>
              </Box>
            </CardContent>
          </Card>

          {/* ==================== COLUMNA DERECHA: LISTADOS ==================== */}
          <Box>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 2 }}>
              <ArticleIcon color="primary" />
              <Typography variant="h3" component="h2">
                Mis Noticias Publicadas
              </Typography>
              <Chip label={`(${misNoticias.length})`} size="small" color="primary" />
            </Stack>

            <TablaNoticias
              noticias={misNoticias}
              esMovil={esMovil}
              onEliminar={confirmacion.abrir}
              mensajeVacio="Aún no has publicado ninguna noticia. ¡Crea la primera!"
            />

            <Divider sx={{ my: 4 }} />

            <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 0.5 }}>
              <NewspaperIcon color="primary" />
              <Typography variant="h3" component="h2">
                Otras Noticias de la Comunidad
              </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No puedes eliminarlas porque fueron creadas por otros usuarios.
            </Typography>

            <TablaNoticias
              noticias={otrasNoticias}
              esMovil={esMovil}
              soloLectura
              mensajeVacio="No hay noticias de otros autores por ahora."
            />

            <Alert severity="info" sx={{ mt: 3, fontSize: '0.8125rem' }}>
              <strong>Regla de autoría:</strong> solo puedes eliminar las noticias que tú mismo has
              creado. Las noticias de otros usuarios aparecen con el botón &ldquo;Bloqueado&rdquo;.
            </Alert>
          </Box>
        </Box>
      </Seccion>

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
