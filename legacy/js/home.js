/* ============================================================
   NotiPoliWeb — home.js
   Inicialización específica del Home
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🏠 Iniciando Home...');

  // Verificar que las funciones estén definidas
  if (typeof cargarNoticias !== 'function') {
    console.error('❌ cargarNoticias no está definida. Revisa el orden de los <script>.');
    return;
  }

  if (typeof renderCards !== 'function') {
    console.error('❌ renderCards no está definida. Revisa noticias.js.');
    return;
  }

  // Verificar que el contenedor exista
  const container = document.getElementById('destacadasGrid');
  if (!container) {
    console.error('❌ No existe #destacadasGrid en el HTML.');
    return;
  }

  try {
    await cargarNoticias();
    console.log('📰 Noticias cargadas:', noticiasCache.length);

    if (noticiasCache.length === 0) {
      console.warn('⚠ No hay noticias para mostrar.');
      container.innerHTML = '<p class="empty-state">No hay noticias disponibles.</p>';
      return;
    }

    // Mostrar solo las 3 primeras como "destacadas"
    renderCards(noticiasCache.slice(0, 3), 'destacadasGrid', '');
    console.log('✅ Home renderizado correctamente.');
  } catch (err) {
    console.error('❌ Error en la inicialización del Home:', err);
    container.innerHTML = '<p class="empty-state">Error al cargar las noticias.</p>';
  }
});