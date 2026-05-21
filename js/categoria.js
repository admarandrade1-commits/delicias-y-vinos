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
  const SUBCATS = {
    vinos:      ['BLANCOS','TINTO','ROSADO','ESPUMOSO','DULCES','ESTUCHES','INTERNACIONALES','MAGNUM','OLOROSOS'],
    destilados: ['VERMOUTH','SIDRA','CREMAS Y LICORES','BRANDYS','GINEBRA','WHISKY','RON','ORUJO'],
    gourmet:    ['IBÉRICOS','CONSERVAS','ACEITE','PATÉ','PIMENTÓN','CRACKERS','FRUTA'],
    dulce:      ['CHOCOLATES','BOMBONES'],
    cerveza:    ['RUBIA','ESPECIAL','ARTESANA','SIN ALCOHOL'],
    infusiones: ['TÉ VERDE','TÉ NEGRO','ROOIBOS','MENTA','MANZANILLA'],
  };
  const titleEl = document.getElementById('sidebar-cat-title');
  if (titleEl) titleEl.textContent = cat.toUpperCase();

  const subs = SUBCATS[cat] || [...new Set(PRODUCTS.filter(p => p.categoria === cat).map(p => p.subcategoria))];
  const container = document.getElementById('sidebar-subcats');
  if (!container) return;

  container.innerHTML = subs.map(s => `
    <div onclick="setSubcat('${s.toLowerCase()}')" 
         style="padding:11px 20px;font-size:13px;letter-spacing:0.06em;border-bottom:1px solid #e8e8e8;cursor:pointer;color:#333;transition:background 0.15s;"
         onmouseover="this.style.background='#f5f5f5';this.style.fontWeight='600';" 
         onmouseout="this.style.background='';this.style.fontWeight='';">
      ${s}
    </div>`).join('');

  // Price checkboxes
  const priceBox = document.getElementById('price-boxes');
  if (priceBox) {
    const ranges = [[0,114],[114,227],[227,340],[340,454],[454,600]];
    priceBox.innerHTML = ranges.map(([min,max]) => `
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:#333;margin-bottom:8px;cursor:pointer;">
        <input type="checkbox" onchange="togglePriceRange(${min},${max},this.checked)" 
               style="accent-color:#000;width:14px;height:14px;"/>
        ${min} - ${max} eur
      </label>`).join('');
  }
}

function togglePriceRange(min, max, checked) {
  renderCategoryProducts();
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