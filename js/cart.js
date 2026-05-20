let cart = JSON.parse(localStorage.getItem('dyv_cart') || '[]');

function saveCart() {
  localStorage.setItem('dyv_cart', JSON.stringify(cart));
}

function addToCart(productId) {
  const product = getProductById(productId);
  if (!product) return;
  const existing = cart.find(item => item.id === productId);
  if (existing) { existing.qty += 1; }
  else { cart.push({ id: productId, qty: 1 }); }
  saveCart();
  updateCartUI();
  showCartNotification(product.nombre);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId);
  else { saveCart(); updateCartUI(); }
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const countEl = document.getElementById('cart-count');
  if (countEl) countEl.textContent = totalItems;

  const itemsEl = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');
  const totalEl = document.getElementById('cart-total-price');
  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Tu cesta está vacía.</p>';
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  let html = '';
  let total = 0;
  cart.forEach(item => {
    const p = getProductById(item.id);
    if (!p) return;
    const subtotal = p.precio * item.qty;
    total += subtotal;
    html += `
      <div class="cart-item">
        <img src="${p.imagen}" alt="${p.nombre}" class="cart-item__img"/>
        <div class="cart-item__info">
          <p class="cart-item__name">${p.nombre}</p>
          <p class="cart-item__price">${p.precio.toFixed(2).replace('.', ',')}€</p>
          <div class="cart-item__qty">
            <button onclick="changeQty(${p.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${p.id}, 1)">+</button>
          </div>
        </div>
        <button class="cart-item__remove" onclick="removeFromCart(${p.id})">✕</button>
      </div>`;
  });

  itemsEl.innerHTML = html;
  if (footerEl) footerEl.style.display = 'block';
  if (totalEl) totalEl.textContent = total.toFixed(2).replace('.', ',') + '€';
}

function showCartNotification(nombre) {
  let notif = document.getElementById('cart-notif');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'cart-notif';
    notif.className = 'cart-notif';
    document.body.appendChild(notif);
  }
  notif.textContent = `✔ ${nombre} añadido`;
  notif.classList.add('show');
  setTimeout(() => notif.classList.remove('show'), 2500);
}

function toggleCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (!drawer) return;
  drawer.classList.toggle('open');
  overlay.classList.toggle('show');
  document.body.classList.toggle('no-scroll');
}

document.addEventListener('DOMContentLoaded', updateCartUI);