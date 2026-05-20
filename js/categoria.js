let maxPrice = 150;
let activeSubcat = null;

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat') || 'vinos';

  const titleEl = document.getElementById('cat-title');
  const breadEl = document.getElementById('breadcrumb-cat');
  const label = getCategoryLabel(cat);
  if (titleEl) titleEl.textContent = label;
  if (breadEl) breadEl.textContent = label;
  document.title = `${label} — Delicias y Vinos`;

  buildSidebarCats(cat);
  renderCategoryProducts();

  const filterToggle = document.getElementById('filter-toggle');
  const sidebar = document.getElementById('sidebar');
  if (filterToggle && sidebar) {
    filterToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  }

  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('open');
    });
  }

  const searchToggle = document.getElementById('search-toggle');
  const searchBar = document.getElementById('search-bar');
  if (searchToggle && searchBar) {
    searchToggle.addEventListener('click', () => searchBar.classList.toggle('open'));
  }

  const cartToggle = document.getElementById('cart-toggle');
  if (cartToggle) cartToggle.addEventListener('click', toggleCart);
});

function getCategoryLabel(cat) {
  const map = {
    vinos: 'Vinos', destilados: 'Destilados', gourmet: 'Gourmet',
    cerveza: 'Cerveza', cafe: 'Café',
    albarino: 'Albariño', godello: 'Godello', ribeiro: 'Ribeiro', verdejo: 'Verdejo',
    rioja: 'Rioja', ribera: 'Ribera del Duero', mencia: 'Mencía',
    rosado: 'Rosado', espumoso: 'Espumoso / Cava',
    ginebra: 'Ginebra', whisky: 'Whisky', ron: 'Ron', brandy: 'Brandy', orujo: 'Orujo',
    jamon: 'Jamones y Paletas', embutidos: 'Embutidos',
    conservas: 'Conservas', quesos: 'Quesos', chocolates: 'Chocolates',
  };
  return map[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
}

function buildSidebarCats(cat) {
  const container = document.getElementById('sidebar-cats');
  if (!container) return;

  const subs = [...new Set(PRODUCTS
    .filter(p => p.categoria === cat || p.subcategoria === cat)
    .map(p => p.subcategoria))];

  if (subs.length <= 1) {
    const group = container.closest('.sidebar__group');
    if (group) group.style.display = 'none';
    return;
  }

  container.innerHTML = `
    <label class="sidebar__option">
      <input type="radio" name="subcat" value="" onchange="setSubcat('')" checked/>
      Todos
    </label>` +
    subs.map(s => `
    <label class="sidebar__option">
      <input type="radio" name="subcat" value="${s}" onchange="setSubcat('${s}')"/>
      ${getCategoryLabel(s)}
    </label>`).join('');
}

function setSubcat(sub) {
  activeSubcat = sub || null;
  renderCategoryProducts();
}

function updatePriceFilter(val) {
  maxPrice = parseInt(val);
  document.getElementById('price-max-label').textContent = maxPrice >= 150 ? '150€+' : maxPrice + '€';
  renderCategoryProducts();
}

function clearFilters() {
  activeSubcat = null;
  maxPrice = 150;
  const range = document.getElementById('price-range');
  const label = document.getElementById('price-max-label');
  const radio = document.querySelector('input[name="subcat"][value=""]');
  if (range) range.value = 150;
  if (label) label.textContent = '150€+';
  if (radio) radio.checked = true;
  renderCategoryProducts();
}

function renderCategoryProducts() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat') || 'vinos';
  const sortVal = document.getElementById('sort-select')?.value || 'default';

  let products = PRODUCTS.filter(p => {
    const matchCat = p.categoria === cat || p.subcategoria === cat;
    const matchSub = !activeSubcat || p.subcategoria === activeSubcat;
    const matchPrice = p.precio <= (maxPrice >= 150 ? Infinity : maxPrice);
    return matchCat && matchSub && matchPrice;
  });

  if (sortVal === 'price-asc') products.sort((a, b) => a.precio - b.precio);
  else if (sortVal === 'price-desc') products.sort((a, b) => b.precio - a.precio);
  else if (sortVal === 'name') products.sort((a, b) => a.nombre.localeCompare(b.nombre));

  const grid = document.getElementById('cat-products-grid');
  const countEl = document.getElementById('cat-count');
  const emptyEl = document.getElementById('cat-empty');

  if (countEl) countEl.textContent = `${products.length} produto${products.length !== 1 ? 's' : ''}`;

  if (products.length === 0) {
    if (grid) grid.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (grid) grid.innerHTML = products.map(buildProductCard).join('');
}