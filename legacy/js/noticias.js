/* ============================================================
   NotiPoliWeb — noticias.js
   Carga y render de noticias + sistema de favoritos
   ============================================================ */

let noticiasCache = [];

/* ============================================================
   CARGA DE NOTICIAS
   Combina: noticias.json + noticias creadas - noticias eliminadas
   ============================================================ */
async function cargarNoticias() {
  // Asegurar que las semillas estén cargadas
  if (!localStorage.getItem(STORAGE_KEYS.NOTICIAS_CREADAS)) {
    await cargarNoticiasCreadasSemilla();
  }

  // Si ya están en caché, no recargar
  if (noticiasCache.length > 0) return noticiasCache;

  try {
    const base = getBasePath();
    const res = await fetch(base + 'data/noticias.json');
    const data = await res.json();

    // 1. Noticias del JSON
    let todas = [...data.noticias];

    // 2. Noticias creadas por usuarios (localStorage)
    const creadas = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTICIAS_CREADAS) || '[]');
    todas = todas.concat(creadas);

    // 3. Filtrar eliminadas
    const eliminadas = JSON.parse(localStorage.getItem(STORAGE_KEYS.ELIMINADAS) || '[]');
    todas = todas.filter(n => !eliminadas.includes(n.id));

    noticiasCache = todas;
    return noticiasCache;
  } catch (err) {
    console.error('Error cargando noticias:', err);
    return [];
  }
}

/* ============================================================
   HELPER: SIGUIENTE ID DISPONIBLE
   ============================================================ */
function getSiguienteId() {
  const ids = noticiasCache.map(n => n.id);
  return ids.length ? Math.max(...ids) + 1 : 1;
}

/* ============================================================
   RENDER DE CARDS (para Home, Listado y Relacionadas)
   ============================================================ */
function renderCards(noticias, containerId, basePrefix = '') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const sesion = getSesion();
  const favoritos = sesion ? getFavoritos(sesion.email) : [];

  if (noticias.length === 0) {
    container.innerHTML = `
      <p class="empty-state">No hay noticias para mostrar.</p>
    `;
    return;
  }

  container.innerHTML = noticias.map(n => {
    const esFav = favoritos.includes(n.id);
    return `
      <article class="card">
        <img src="${n.imagen}" alt="${n.titulo}" class="card__img">
        <div class="card__body">
          <span class="card__categoria">${n.categoria}</span>
          <h3 class="card__title">${n.titulo}</h3>
          <p class="card__desc">${n.descripcion}</p>
          <div class="card__footer">
            <a href="${basePrefix}pages/detalle.html?id=${n.id}" class="card__btn">Ver más</a>
            <button class="card__fav ${esFav ? 'card__fav--active' : ''}"
                    onclick="toggleFavorito(${n.id}, '${containerId}')">♥</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/* ============================================================
   FAVORITOS
   ============================================================ */
function getFavoritos(email) {
  const raw = localStorage.getItem(STORAGE_KEYS.FAVORITOS(email));
  return raw ? JSON.parse(raw) : [];
}

function setFavoritos(email, lista) {
  localStorage.setItem(STORAGE_KEYS.FAVORITOS(email), JSON.stringify(lista));
}

/* ---------- TOGGLE FAVORITO (genérico) ---------- */
function toggleFavorito(id, containerId = null) {
  const sesion = getSesion();
  if (!sesion) {
    alert('Debes iniciar sesión para guardar favoritos.');
    window.location.href = getBasePath() + 'pages/login.html';
    return;
  }

  const favs = getFavoritos(sesion.email);
  const idx = favs.indexOf(id);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push(id);
  setFavoritos(sesion.email, favs);

  // Re-render del contenedor específico si se pasa
  if (containerId) {
    const noticiasFiltradas = noticiasCache.filter(n => {
      // Si es el contenedor de destacadas, mostrar solo las 3 primeras
      return true;
    });

    if (containerId === 'destacadasGrid') {
      renderCards(noticiasCache.slice(0, 3), containerId);
    } else if (containerId === 'noticiasGrid') {
      // Delegamos al listado.js si está disponible
      if (typeof renderListado === 'function') renderListado();
    } else if (containerId === 'relacionadasGrid') {
      // Re-render de relacionadas (se maneja en detalle.js)
      if (typeof renderRelacionadas === 'function') {
        const id = getIdFromUrl && getIdFromUrl();
        const noticia = noticiasCache.find(n => n.id === id);
        if (noticia) renderRelacionadas(noticia);
      }
    }
  }
}

/* ---------- TOGGLE FAVORITO PARA LISTADO (compatibilidad) ---------- */
function toggleFavoritoListado(id) {
  toggleFavorito(id, 'noticiasGrid');
}

/* ============================================================
   FORMATEO DE FECHA
   ============================================================ */
function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

function formatearFechaCorta(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}