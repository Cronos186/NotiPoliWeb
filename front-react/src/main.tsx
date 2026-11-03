import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Tipografía Poppins empaquetada (solo subset latino) para no depender de un CDN.
import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-600.css';
import '@fontsource/poppins/latin-700.css';

import App from '@/App';
import { cargarSemillas } from '@/services/seeds';

// Vuelca los JSON semilla en localStorage antes primer render.
cargarSemillas();

const contenedor = document.getElementById('root');
if (!contenedor) {
  throw new Error('No se encontró el contenedor #root en index.html');
}

createRoot(contenedor).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
