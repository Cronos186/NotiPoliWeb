/* ============================================================
   NotiPoliWeb — favoritos.js
   Render de la lista de favoritos del usuario autenticado
   ============================================================ */

/* ---------- VERIFICAR SESIÓN ---------- */
function verificarSesion() {
  const sesion = getSesion();
  if (!sesion) {
    alert('Debes iniciar sesión para ver tus favoritos.');
    window.location.href = 'login.html';
    return null;
  }
  return sesion;
}

/* ---------- RENDER DE FAVORITOS ---------- */
function renderFavoritos() {
  const sesion = verificarSesion();
  if (!sesion) return;

  const container = document.getElementById('favoritosLista');
  const empty = document.getElementById('favoritosEmpty');
  const subtitulo = document.getElementById('favoritosSubtitulo');
  if (!container) return;

  const favoritosIds = getFavoritos(sesion.email);
  const noticiasFav = noticiasCache.filter(n => favoritosIds.includes(n.id));

  // Actualizar subtítulo
  subtitulo.textContent = noticiasFav.length === 0
    ? `Bienvenido, ${sesion.nombre}. Aún no tienes noticias guardadas.`
    : `${noticiasFav.length} ${noticiasFav.length === 1 ? 'noticia guardada' : 'noticias guardadas'} por ${sesion.nombre}.`;

  // Estado vacío
  if (noticiasFav.length === 0) {
    container.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  container.innerHTML = noticiasFav.map(n => `
    <article class="favorito">
      <img src="${n.imagen}" alt="${n.titulo}" class="favorito__img">

      <div class="favorito__info">
        <div class="favorito__meta">
          <span class="card__categoria">${n.categoria}</span>
          <span class="favorito__fecha">📅 ${formatearFecha(n.fecha)}</span>
        </div>

        <h3 class="favorito__titulo">${n.titulo}</h3>
        <p class="favorito__desc">${n.descripcion}</p>

        <div class="favorito__acciones">
          <a href="detalle.html?id=${n.id}" class="btn btn--secondary btn--sm">
            Ver detalle
          </a>
          <button class="btn btn--danger-outline btn--sm"
                  onclick="quitarFavorito(${n.id})">
            ✖ Quitar de favoritos
          </button>
        </div>
      </div>

      <div class="favorito__corazon">♥</div>
    </article>
  `).join('');
}

/* ---------- FORMATEAR FECHA ---------- */
function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

/* ---------- QUITAR FAVORITO ---------- */
function quitarFavorito(id) {
  const sesion = getSesion();
  if (!sesion) return;

  const noticia = noticiasCache.find(n => n.id === id);
  if (!noticia) return;

  const confirmar = confirm(`¿Quitar "${noticia.titulo}" de tus favoritos?`);
  if (!confirmar) return;

  const favs = getFavoritos(sesion.email);
  const idx = favs.indexOf(id);
  if (idx >= 0) favs.splice(idx, 1);
  setFavoritos(sesion.email, favs);

  renderFavoritos();
}

/* ---------- INICIALIZACIÓN ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  const sesion = getSesion();
  if (!sesion) {
    alert('Debes iniciar sesión para ver tus favoritos.');
    window.location.href = 'login.html';
    return;
  }

  await cargarNoticias();
  renderFavoritos();
});