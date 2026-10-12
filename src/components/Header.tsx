import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { DATOS_PROYECTO } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { useNotificacion } from '@/context/NotificacionContext';

/* ============================================================
   NotiPoliWeb — Cabecera con navegación y menú "Mi cuenta"
   ============================================================ */

interface ItemNav {
  etiqueta: string;
  ruta: string;
}

const NAV_ITEMS: ItemNav[] = [
  { etiqueta: 'Inicio', ruta: '/' },
  { etiqueta: 'Noticias', ruta: '/noticias' },
  { etiqueta: 'Favoritos', ruta: '/favoritos' },
  { etiqueta: 'Contacto', ruta: '/contacto' },
  { etiqueta: 'Acerca de', ruta: '/acerca-de' },
];

const estiloEnlace = {
  color: '#FFFFFF',
  borderRadius: 0,
  px: 0.5,
  py: 0.75,
  borderBottom: '2px solid transparent',
  '&:hover': { borderBottomColor: 'secondary.main', backgroundColor: 'transparent' },
  '&.active': { borderBottomColor: 'secondary.main' },
} as const;

export default function Header() {
  const { sesion, cerrarSesion } = useAuth();
  const { mostrar } = useNotificacion();
  const navigate = useNavigate();

  const [anclaCuenta, setAnclaCuenta] = useState<HTMLElement | null>(null);
  const [drawerAbierto, setDrawerAbierto] = useState(false);

  const menuAbierto = Boolean(anclaCuenta);

  const cerrarMenu = () => setAnclaCuenta(null);
  const cerrarDrawer = () => setDrawerAbierto(false);

  const irA = (ruta: string) => {
    cerrarMenu();
    cerrarDrawer();
    navigate(ruta);
  };

  const handleCerrarSesion = () => {
    cerrarMenu();
    cerrarDrawer();
    cerrarSesion();
    mostrar('Cerraste sesión correctamente.', 'info');
    navigate('/');
  };

  /* ---------- Acciones del menú "Mi cuenta" ---------- */

  const accionesCuenta = sesion
    ? [
        {
          etiqueta: 'Gestionar noticias',
          icono: <PostAddIcon fontSize="small" />,
          accion: () => irA('/gestionar-noticias'),
        },
        {
          etiqueta: 'Mis favoritos',
          icono: <FavoriteIcon fontSize="small" />,
          accion: () => irA('/favoritos'),
        },
      ]
    : [
        {
          etiqueta: 'Iniciar sesión',
          icono: <LoginIcon fontSize="small" />,
          accion: () => irA('/login'),
        },
        {
          etiqueta: 'Registrarse',
          icono: <PersonAddIcon fontSize="small" />,
          accion: () => irA('/registro'),
        },
      ];

  return (
    <AppBar
      position="sticky"
      sx={{ bgcolor: 'primary.main', boxShadow: '0 2px 8px rgba(0,0,0,.1)' }}
    >
      <Toolbar
        sx={{
          maxWidth: 1440,
          width: '100%',
          mx: 'auto',
          px: { xs: 2, md: 5 },
          py: 1,
          gap: 3,
          justifyContent: 'space-between',
        }}
      >
        {/* ---------- Logo ---------- */}
        <Typography
          component={NavLink}
          to="/"
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#FFFFFF',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <NewspaperIcon sx={{ fontSize: '1.5rem' }} /> {DATOS_PROYECTO.nombre}
        </Typography>

        {/* ---------- Navegación de escritorio ---------- */}
        <Stack
          direction="row"
          spacing={2.5}
          component="nav"
          aria-label="Navegación principal"
          sx={{ display: { xs: 'none', md: 'flex' } }}
        >
          {NAV_ITEMS.map((item) => (
            <Button key={item.ruta} component={NavLink} to={item.ruta} end sx={estiloEnlace}>
              {item.etiqueta}
            </Button>
          ))}
        </Stack>

        {/* ---------- Mi cuenta + menú móvil ---------- */}
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Button
            onClick={(evento) => setAnclaCuenta(evento.currentTarget)}
            startIcon={<PersonIcon />}
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              border: '2px solid #FFFFFF',
              color: '#FFFFFF',
              px: 2,
              py: 1,
              fontSize: '0.875rem',
              '&:hover': { backgroundColor: 'rgba(255,255,255,.1)', transform: 'none' },
            }}
            aria-haspopup="true"
            aria-expanded={menuAbierto ? 'true' : undefined}
          >
            {sesion ? sesion.nombre : 'Mi cuenta'}
          </Button>

          <Tooltip title="Abrir menú">
            <IconButton
              onClick={() => setDrawerAbierto(true)}
              sx={{ display: { xs: 'inline-flex', md: 'none' }, color: '#FFFFFF' }}
              aria-label="Abrir menú de navegación"
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>

      {/* ---------- Menú desplegable de cuenta ---------- */}
      <Menu
        anchorEl={anclaCuenta}
        open={menuAbierto}
        onClose={cerrarMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 220, mt: 1 } } }}
      >
        {sesion && (
          <Box sx={{ px: 2, py: 1.5, bgcolor: '#F3F4F6' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {`${sesion.nombre} ${sesion.apellido ?? ''}`.trim()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {sesion.email}
            </Typography>
          </Box>
        )}

        {accionesCuenta.map((accion) => (
          <MenuItem key={accion.etiqueta} onClick={accion.accion} sx={{ gap: 1.5, py: 1.25 }}>
            {accion.icono}
            {accion.etiqueta}
          </MenuItem>
        ))}

        {sesion && <Divider />}

        {sesion && (
          <MenuItem onClick={handleCerrarSesion} sx={{ gap: 1.5, py: 1.25, color: 'error.main' }}>
            <LogoutIcon fontSize="small" />
            Cerrar sesión
          </MenuItem>
        )}
      </Menu>

      {/* ---------- Drawer móvil ---------- */}
      <Drawer
        anchor="right"
        open={drawerAbierto}
        onClose={cerrarDrawer}
        slotProps={{ paper: { sx: { width: 280 } } }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
            bgcolor: 'primary.main',
            color: '#FFFFFF',
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>Menú</Typography>
          <IconButton onClick={cerrarDrawer} sx={{ color: '#FFFFFF' }} aria-label="Cerrar menú">
            <CloseIcon />
          </IconButton>
        </Box>

        <List component="nav" aria-label="Navegación móvil">
          {NAV_ITEMS.map((item) => (
            <ListItemButton
              key={item.ruta}
              component={NavLink}
              to={item.ruta}
              end
              onClick={cerrarDrawer}
              sx={{
                '&.active': { bgcolor: '#E0E7FF', color: 'primary.main', fontWeight: 700 },
              }}
            >
              <ListItemText primary={item.etiqueta} />
            </ListItemButton>
          ))}
        </List>

        <Divider />

        {sesion && (
          <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
              {sesion.nombre.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                {`${sesion.nombre} ${sesion.apellido ?? ''}`.trim()}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {sesion.email}
              </Typography>
            </Box>
          </Box>
        )}

        <List component="nav">
          {accionesCuenta.map((accion) => (
            <ListItemButton key={accion.etiqueta} onClick={accion.accion} sx={{ gap: 1.5 }}>
              {accion.icono}
              <ListItemText primary={accion.etiqueta} />
            </ListItemButton>
          ))}

          {sesion && (
            <ListItemButton onClick={handleCerrarSesion} sx={{ gap: 1.5, color: 'error.main' }}>
              <LogoutIcon fontSize="small" />
              <ListItemText primary="Cerrar sesión" />
            </ListItemButton>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
}
