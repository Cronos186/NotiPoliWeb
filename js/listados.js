/* ============================================================
   NotiPoliWeb — listados.js
   Filtros por categoría y renderizado del listado completo
   ============================================================ */

let categoriaActual = 'Todas';

/* ---------- RENDER FILTRADO ---------- */
function renderListado() {
  const container = document.getElementById('noticiasGrid');
  const emptyState = document.getElementById('emptyState');
  if (!container) return;

  const sesion = getSesion();
  const favoritos = sesion ? getFavoritos(sesion.email) : [];

  const filtradas = categoriaActual === 'Todas'
    ? noticiasCache
    : noticiasCache.filter(n => n.categoria === categoriaActual);

  if (filtradas.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  container.innerHTML = filtradas.map(n => {
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

/* ---------- TOGGLE FAVORITO EN LISTADO ---------- */
function toggleFavoritoListado(id) {
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
  renderListado();
}

/* ---------- FILTROS ---------- */
function initFiltros() {
  const botones = document.querySelectorAll('.filter');
  botones.forEach(btn => {
    btn.addEventListener('click', () => {
      botones.forEach(b => b.classList.remove('filter--active'));
      btn.classList.add('filter--active');
      categoriaActual = btn.dataset.categoria;
      renderListado();
    });
  });
}

/* ---------- INICIALIZACIÓN ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  await cargarNoticias();
  initFiltros();
  renderListado();
});