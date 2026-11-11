import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

/* ============================================================
   NotiPoliWeb — Layout raíz
   Cabecera fija arriba, contenido flexible y pie al final.
   ============================================================ */

export default function Layout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
