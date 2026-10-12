import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import Layout from '@/components/Layout';
import RutaProtegida from '@/components/RutaProtegida';
import { AuthProvider } from '@/context/AuthContext';
import { NoticiasProvider } from '@/context/NoticiasContext';
import { NotificacionProvider } from '@/context/NotificacionContext';
import AcercaDePage from '@/pages/AcercaDePage';
import ContactoPage from '@/pages/ContactoPage';
import DetallePage from '@/pages/DetallePage';
import FavoritosPage from '@/pages/FavoritosPage';
import GestionarNoticiasPage from '@/pages/GestionarNoticiasPage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import NoticiasPage from '@/pages/NoticiasPage';
import NotFoundPage from '@/pages/NotFoundPage';
import RegistroPage from '@/pages/RegistroPage';
import { theme } from '@/theme';

/* ============================================================
   NotiPoliWeb — Composición de la aplicación
   Un solo punto de entrada, con React Router sustituyendo a las
   páginas HTML independientes de la Entrega 2.
   ============================================================ */

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <NotificacionProvider>
          <AuthProvider>
            <NoticiasProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="noticias" element={<NoticiasPage />} />
                  <Route path="noticias/:id" element={<DetallePage />} />
                  <Route
                    path="favoritos"
                    element={
                      <RutaProtegida>
                        <FavoritosPage />
                      </RutaProtegida>
                    }
                  />
                  <Route path="contacto" element={<ContactoPage />} />
                  <Route path="acerca-de" element={<AcercaDePage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="registro" element={<RegistroPage />} />
                  {/* "Mis noticias" quedó integrada en la vista unificada. */}
                  <Route path="mis-noticias" element={<Navigate to="/gestionar-noticias" replace />} />
                  <Route
                    path="gestionar-noticias"
                    element={
                      <RutaProtegida>
                        <GestionarNoticiasPage />
                      </RutaProtegida>
                    }
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </NoticiasProvider>
          </AuthProvider>
        </NotificacionProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
