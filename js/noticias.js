/* ============================================================
   NotiPoliWeb — noticias.js
   Renderizado dinámico de noticias desde JSON + favoritos
   ============================================================ */

let noticiasCache = [];

/* ---------- RENDER DE CARDS ---------- */
function renderCards(noticias, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const sesion = getSesion();
  const favoritos = sesion ? getFavoritos(sesion.email) : [];

  container.innerHTML = noticias.map(n => {
    const esFav = favoritos.includes(n.id);
    return `
      <article class="card">
        <img src="${n.imagen}" alt="${n.titulo}" class="card__img">
        <div class="card__body">
          <h3 class="card__title">${n.titulo}</h3>
          <p class="card__desc">${n.descripcion}</p>
          <div class="card__footer">
            <a href="pages/detalle.html?id=${n.id}" class="card__btn">Ver más</a>
            <button class="card__fav ${esFav ? 'card__fav--active' : ''}"
                    onclick="toggleFavorito(${n.id})">♥</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/* ---------- FAVORITOS ---------- */
function getFavoritos(email) {
  const raw = localStorage.getItem(STORAGE_KEYS.FAVORITOS(email));
  return raw ? JSON.parse(raw) : [];
}

function setFavoritos(email, lista) {
  localStorage.setItem(STORAGE_KEYS.FAVORITOS(email), JSON.stringify(lista));
}

function toggleFavorito(id) {
  const sesion = getSesion();
  if (!sesion) {
    alert('Debes iniciar sesión para guardar favoritos.');
    window.location.href = getBasePath() + 'pages/login.html';
    return;
  }
  const favs = getFavoritos(sesion.email);
  const idx = favs.indexOf(id);
  if (idx >= 0) {
    favs.splice(idx, 1);
  } else {
    favs.push(id);
  }
  setFavoritos(sesion.email, favs);
  renderCards(noticiasCache, 'destacadasGrid');
}

/* ---------- INICIALIZACIÓN ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  const noticias = await cargarNoticias();
  renderCards(noticias, 'destacadasGrid');
});

/* ---------- FILTRAR NOTICIAS ELIMINADAS ---------- */
function filtrarEliminadas(noticias) {
  const eliminadas = JSON.parse(localStorage.getItem('notipoliweb_eliminadas') || '[]');
  return noticias.filter(n => !eliminadas.includes(n.id));
}

/* ---------- CARGA DE NOTICIAS ---------- */
async function cargarNoticias() {
  try {
    const base = getBasePath();
    const res = await fetch(base + 'data/noticias.json');
    const data = await res.json();
    noticiasCache = filtrarEliminadas(data.noticias);
    return noticiasCache;
  } catch (err) {
    console.error('Error cargando noticias:', err);
    return [];
  }
}