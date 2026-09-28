/* ============================================================
   NotiPoliWeb — acerca.js
   Estadísticas dinámicas de la plataforma
   ============================================================ */

/* ---------- CARGAR ESTADÍSTICAS ---------- */
async function cargarEstadisticas() {
  try {
    // Noticias publicadas
    const base = getBasePath();
    const res = await fetch(base + 'data/noticias.json');
    const data = await res.json();
    const eliminadas = JSON.parse(localStorage.getItem('notipoliweb_eliminadas') || '[]');
    const totalNoticias = data.noticias.filter(n => !eliminadas.includes(n.id)).length;

    // Usuarios registrados
    const usuarios = JSON.parse(localStorage.getItem('notipoliweb_usuarios') || '[]');

    // Animar contadores
    animarContador('statNoticias', totalNoticias);
    animarContador('statUsuarios', usuarios.length);

  } catch (err) {
    console.error('Error cargando estadísticas:', err);
  }
}

/* ---------- ANIMACIÓN DE CONTADORES ---------- */
function animarContador(elementId, valorFinal) {
  const el = document.getElementById(elementId);
  if (!el) return;

  let actual = 0;
  const duracion = 800;
  const paso = Math.max(1, Math.floor(valorFinal / 30));
  const intervalo = duracion / 30;

  const timer = setInterval(() => {
    actual += paso;
    if (actual >= valorFinal) {
      actual = valorFinal;
      clearInterval(timer);
    }
    el.textContent = actual;
  }, intervalo);
}

/* ---------- INICIALIZACIÓN ---------- */
document.addEventListener('DOMContentLoaded', cargarEstadisticas);