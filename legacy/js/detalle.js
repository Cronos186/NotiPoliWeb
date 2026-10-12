/* ============================================================
   NotiPoliWeb — detalle.js
   Render dinámico del detalle de una noticia + acciones
   ============================================================ */

/* ---------- OBTENER ID DESDE LA URL ---------- */
function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);
  return isNaN(id) ? null : id;
}

/* ---------- RENDER DEL DETALLE ---------- */
function renderDetalle(noticia) {
  const container = document.getElementById('detalleContainer');
  if (!container) return;

  const sesion = getSesion();
  const favoritos = sesion ? getFavoritos(sesion.email) : [];
  const esFav = favoritos.includes(noticia.id);

  // Botón eliminar solo si el usuario es el autor
  const esAutor = sesion && sesion.email === noticia.autorEmail;
  const botonEliminar = esAutor
    ? `<button class="btn btn--danger" onclick="eliminarNoticia(${noticia.id})">
         🗑 Eliminar noticia
       </button>`
    : '';

  container.innerHTML = `
    <article class="detalle__article">
      <img src="${noticia.imagen}" alt="${noticia.titulo}" class="detalle__img">

      <div class="detalle__meta">
        <span class="card__categoria">${noticia.categoria}</span>
        <span class="detalle__fecha">📅 ${formatearFecha(noticia.fecha)}</span>
        <span class="detalle__autor">✍ ${noticia.autorNombre}</span>
      </div>

      <h1 class="detalle__titulo">${noticia.titulo}</h1>

      <p class="detalle__contenido">${noticia.contenido}</p>

      <div class="detalle__actions">
        <button class="btn btn--primary ${esFav ? 'btn--active' : ''}"
                onclick="toggleFavoritoDetalle(${noticia.id})">
          ${esFav ? '♥ Quitar de favoritos' : '♥ Agregar a favoritos'}
        </button>

        <a href="contacto.html" class="btn btn--secondary">
          ✉ Contactar
        </a>

        ${botonEliminar}
      </div>

      <a href="noticias.html" class="detalle__volver">← Volver al listado</a>
    </article>
  `;
}

/* ---------- FORMATEAR FECHA ---------- */
function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  const opciones = { day: '2-digit', month: 'long', year: 'numeric' };
  return fecha.toLocaleDateString('es-CO', opciones);
}

/* ---------- TOGGLE FAVORITO EN DETALLE ---------- */
function toggleFavoritoDetalle(id) {
  const sesion = getSesion();
  if (!sesion) {
    alert('Debes iniciar sesión para guardar favoritos.');
    window.location.href = 'login.html';
    return;
  }
  const favs = getFavoritos(sesion.email);
  const idx = favs.indexOf(id);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push(id);
  setFavoritos(sesion.email, favs);

  const noticia = noticiasCache.find(n => n.id === id);
  if (noticia) renderDetalle(noticia);
}

/* ---------- ELIMINAR NOTICIA (SOLO AUTOR) ---------- */
function eliminarNoticia(id) {
  const sesion = getSesion();
  if (!sesion) return;

  const noticia = noticiasCache.find(n => n.id === id);
  if (!noticia) return;

  // Verificación de autoría (doble chequeo por seguridad)
  if (noticia.autorEmail !== sesion.email) {
    alert('No puedes eliminar noticias de otros autores.');
    return;
  }

  const confirmar = confirm(`¿Eliminar la noticia "${noticia.titulo}"?`);
  if (!confirmar) return;

  // Persistir la eliminación en localStorage
  const eliminadas = JSON.parse(localStorage.getItem('notipoliweb_eliminadas') || '[]');
  eliminadas.push(id);
  localStorage.setItem('notipoliweb_eliminadas', JSON.stringify(eliminadas));

  alert('Noticia eliminada correctamente.');
  window.location.href = 'noticias.html';
}

/* ---------- RENDER DE RELACIONADAS ---------- */
function renderRelacionadas(noticiaActual) {
  const relacionadas = noticiasCache
    .filter(n => n.categoria === noticiaActual.categoria && n.id !== noticiaActual.id)
    .slice(0, 4);

  if (relacionadas.length === 0) return;

  const seccion = document.getElementById('relacionadasSection');
  const grid = document.getElementById('relacionadasGrid');
  if (!seccion || !grid) return;

  seccion.style.display = 'block';

  const sesion = getSesion();
  const favoritos = sesion ? getFavoritos(sesion.email) : [];

  grid.innerHTML = relacionadas.map(n => {
    const esFav = favoritos.includes(n.id);
    return `
      <article class="card">
        <img src="${n.imagen}" alt="${n.titulo}" class="card__img">
        <div class="card__body">
          <span class="card__categoria">${n.categoria}</span>
          <h3 class="card__title">${n.titulo}</h3>
          <p class="card__desc">${n.descripcion}</p>
          <div class="card__footer">
            <a href="detalle.html?id=${n.id}" class="card__btn">Ver más</a>
            <button class="card__fav ${esFav ? 'card__fav--active' : ''}"
                    onclick="toggleFavoritoListado(${n.id})">♥</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/* ---------- ESTADO DE ERROR ---------- */
function renderError(mensaje) {
  const container = document.getElementById('detalleContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="detalle__error">
      <h2>😕 ${mensaje}</h2>
      <a href="noticias.html" class="btn btn--primary">Volver al listado</a>
    </div>
  `;
}

/* ---------- INICIALIZACIÓN ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  await cargarNoticias();

  const id = getIdFromUrl();
  if (id === null) {
    renderError('Noticia no encontrada');
    return;
  }

  const noticia = noticiasCache.find(n => n.id === id);
  if (!noticia) {
    renderError('La noticia que buscas no existe');
    return;
  }

  renderDetalle(noticia);
  renderRelacionadas(noticia);
});