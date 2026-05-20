let detailQty = 1;

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const product = getProductById(id);

  if (!product) {
    document.getElementById('product-detail').innerHTML = '<p style="text-align:center;padding:4rem">Produto não encontrado. <a href="index.html">Voltar ao início</a></p>';
    return;
  }

  document.title = `${product.nombre} — Delicias y Vinos`;
  document.getElementById('product-img').src = product.imagen;
  document.getElementById('product-img').alt = product.nombre;
  document.getElementById('product-bodega').textContent = product.bodega;
  document.getElementById('product-name').textContent = product.nombre;
  document.getElementById('product-price').textContent = product.precio.toFixed(2).replace('.', ',') + '€';
  document.getElementById('product-desc').textContent = product.descripcion;
  document.getElementById('bc-product').textContent = product.nombre;
  document.getElementById('bc-cat').textContent = product.categoria.charAt(0).toUpperCase() + product.categoria.slice(1);
  document.getElementById('bc-cat').href = `categoria.html?cat=${product.categoria}`;

  const metaEl = document.getElementById('product-meta');
  let metaHTML = '';
  if (product.graduacion) metaHTML += `<div class="meta-item"><span>Graduación</span><strong>${product.graduacion}</strong></div>`;
  if (product.volumen) metaHTML += `<div class="meta-item"><span>Volumen</span><strong>${product.volumen}</strong></div>`;
  if (product.subcategoria) metaHTML += `<div class="meta-item"><span>Tipo</span><strong>${product.subcategoria.charAt(0).toUpperCase() + product.subcategoria.slice(1)}</strong></div>`;
  if (metaEl) metaEl.innerHTML = metaHTML;

  document.getElementById('add-to-cart-btn').onclick = () => {
    for (let i = 0; i < detailQty; i++) addToCart(product.id);
  };

  const related = PRODUCTS.filter(p => p.categoria === product.categoria && p.id !== product.id).slice(0, 4);
  const relatedGrid = document.getElementById('related-grid');
  if (relatedGrid) relatedGrid.innerHTML = related.map(buildProductCard).join('');

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

  window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (header) header.classList.toggle('scrolled', window.scrollY > 60);
  });
});

function changeDetailQty(delta) {
  detailQty = Math.max(1, detailQty + delta);
  document.getElementById('detail-qty').textContent = detailQty;
}