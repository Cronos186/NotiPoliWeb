import { Link as RouterLink } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import ChipCategoria from '@/components/ChipCategoria';
import Paginador from '@/components/Paginador';
import { TAMANO_PAGINA } from '@/constants';
import { usePaginacion } from '@/hooks/usePaginacion';
import { formatearFechaCorta } from '@/utils/fechas';
import type { Noticia } from '@/types';

/* ============================================================
   NotiPoliWeb — Tabla de noticias
   Es la tabla del wireframe 08 (Imagen · Título · Categoría ·
   Fecha · Acciones), con paginación propia. En pantallas pequeñas
   se convierte en tarjetas apiladas, porque 5 columnas no caben.
   ============================================================ */

interface TablaNoticiasProps {
  noticias: Noticia[];
  esMovil: boolean;
  /** `true` cuando las noticias son de otros autores (no se pueden borrar). */
  soloLectura?: boolean;
  onEliminar?: (noticia: Noticia) => void;
  mensajeVacio: string;
}

export default function TablaNoticias({
  noticias,
  esMovil,
  soloLectura,
  onEliminar,
  mensajeVacio,
}: TablaNoticiasProps) {
  const paginacion = usePaginacion(noticias, TAMANO_PAGINA.tabla);

  if (noticias.length === 0) {
    return <Alert severity="info">{mensajeVacio}</Alert>;
  }

  const { visibles } = paginacion;

  return (
    <Box>
      {esMovil ? (
        <Stack spacing={2}>
          {visibles.map((noticia) => (
            <Card key={noticia.id}>
              <CardContent sx={{ display: 'flex', gap: 2, p: 2 }}>
                <Box
                  component="img"
                  src={noticia.imagen}
                  alt={noticia.titulo}
                  loading="lazy"
                  sx={{ width: 96, height: 72, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }}
                />

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    component={RouterLink}
                    to={`/noticias/${noticia.id}`}
                    variant="body1"
                    sx={{ fontWeight: 700, mb: 0.5, display: 'block', color: 'primary.main' }}
                  >
                    {noticia.titulo}
                  </Typography>

                  <Stack
                    direction="row"
                    sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 1 }}
                  >
                    <ChipCategoria categoria={noticia.categoria} />
                    <Typography variant="caption" color="text.secondary">
                      {formatearFechaCorta(noticia.fecha)}
                    </Typography>
                  </Stack>

                  <BotonAccion
                    noticia={noticia}
                    soloLectura={soloLectura}
                    onEliminar={onEliminar}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <TableContainer component={Card}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: '#F3F4F6' } }}>
                <TableCell>Imagen</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {visibles.map((noticia) => (
                <TableRow key={noticia.id} hover>
                  <TableCell>
                    <Box
                      component="img"
                      src={noticia.imagen}
                      alt={noticia.titulo}
                      loading="lazy"
                      sx={{
                        width: 72,
                        height: 48,
                        objectFit: 'cover',
                        borderRadius: 1.5,
                        display: 'block',
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography
                      component={RouterLink}
                      to={`/noticias/${noticia.id}`}
                      variant="body2"
                      sx={{ fontWeight: 600, color: 'primary.main' }}
                    >
                      {noticia.titulo}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <ChipCategoria categoria={noticia.categoria} />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">{formatearFechaCorta(noticia.fecha)}</Typography>
                  </TableCell>

                  <TableCell>
                    <BotonAccion
                      noticia={noticia}
                      soloLectura={soloLectura}
                      onEliminar={onEliminar}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Paginador
        pagina={paginacion.pagina}
        totalPaginas={paginacion.totalPaginas}
        onCambiar={paginacion.irA}
        resumen={`mostrando ${paginacion.desde}–${paginacion.hasta} de ${paginacion.total}`}
        sx={{ mt: 3 }}
      />
    </Box>
  );
}

function BotonAccion({
  noticia,
  soloLectura,
  onEliminar,
}: {
  noticia: Noticia;
  soloLectura?: boolean;
  onEliminar?: (noticia: Noticia) => void;
}) {
  // Flujo C del wireframe 10: si no soy el autor, la acción queda bloqueada.
  if (soloLectura) {
    return (
      <Tooltip title="Solo el autor puede eliminar esta noticia">
        <span>
          <Button variant="outlined" size="small" disabled startIcon={<LockIcon />}>
            Bloqueado
          </Button>
        </span>
      </Tooltip>
    );
  }

  return (
    <Button
      variant="outlined"
      color="error"
      size="small"
      startIcon={<DeleteIcon />}
      onClick={() => onEliminar?.(noticia)}
    >
      Eliminar
    </Button>
  );
}
