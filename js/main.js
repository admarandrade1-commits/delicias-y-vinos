function closeAgeModal() {
  const modal = document.getElementById('age-modal');
  if (modal) {
    modal.classList.add('fade-out');
    sessionStorage.setItem('age-confirmed', '1');
    setTimeout(() => modal.remove(), 500);
  }
}

function denyAge() {
  window.location.href = 'https://www.google.com';
}

document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('age-confirmed')) {
    const modal = document.getElementById('age-modal');
    if (modal) modal.remove();
  }
});

window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (header) header.classList.toggle('scrolled', window.scrollY > 60);
});

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });
  }

  const searchToggle = document.getElementById('search-toggle');
  const searchBar = document.getElementById('search-bar');
  if (searchToggle && searchBar) {
    searchToggle.addEventListener('click', () => {
      searchBar.classList.toggle('open');
      if (searchBar.classList.contains('open')) {
        searchBar.querySelector('input').focus();
      }
    });
  }

  const cartToggle = document.getElementById('cart-toggle');
  if (cartToggle) cartToggle.addEventListener('click', toggleCart);

  initHeroSlider();
  renderFeaturedCarousel();
  renderHighlightedGrid();
});

let currentSlide = 0;
let slideInterval;

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero__slide');
  const dotsContainer = document.getElementById('hero-dots');
  if (!slides.length || !dotsContainer) return;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero__dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  slideInterval = setInterval(() => changeSlide(1), 5000);
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  slides[currentSlide].classList.remove('active');
  dots[currentSlide]?.classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide]?.classList.add('active');
  clearInterval(slideInterval);
  slideInterval = setInterval(() => changeSlide(1), 5000);
}

function changeSlide(dir) {
  goToSlide(currentSlide + dir);
}

function buildProductCard(product) {
  const badge = product.badge ? `<span class="product-badge">${product.badge}</span>` : '';
  return `
    <div class="product-card" data-id="${product.id}">
      ${badge}
      <a href="produto.html?id=${product.id}" class="product-card__img-wrap">
        <img src="${product.imagen}" alt="${product.nombre}" loading="lazy"/>
        <div class="product-card__overlay">
          <button onclick="event.preventDefault(); addToCart(${product.id})" class="product-card__quick-add">
            + Añadir a la cesta
          </button>
        </div>
      </a>
      <div class="product-card__info">
        <p class="product-card__sub">${product.bodega}</p>
        <h3 class="product-card__name">
          <a href="produto.html?id=${product.id}">${product.nombre}</a>
        </h3>
        <div class="product-card__footer">
          <span class="product-card__price">${product.precio.toFixed(2).replace('.', ',')}€</span>
          <button onclick="addToCart(${product.id})" class="btn-add-cart" aria-label="Añadir al carrito">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          </button>
        </div>
      </div>
    </div>`;
}

function renderFeaturedCarousel() {
  const container = document.getElementById('featured-carousel');
  if (!container) return;
  container.innerHTML = getFeaturedProducts().map(buildProductCard).join('');
}

function renderHighlightedGrid() {
  const container = document.getElementById('highlighted-grid');
  if (!container) return;
  container.innerHTML = getHighlightedProducts().map(buildProductCard).join('');
}