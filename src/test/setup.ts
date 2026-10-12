import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

/* ============================================================
   Configuración compartida de las pruebas
   ============================================================ */

// Desmonta el árbol de React después de cada prueba.
afterEach(() => {
  cleanup();
});

// jsdom no implementa matchMedia; MUI lo consulta para los breakpoints.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

// Tampoco implementa scrollTo, que usan algunos componentes al montar.
window.scrollTo = () => undefined;
