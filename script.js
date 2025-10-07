// --- Simple cart using localStorage ---
function getCart(){ try { return JSON.parse(localStorage.getItem('cart')||'[]'); } catch { return []; } }
function saveCart(c){ localStorage.setItem('cart', JSON.stringify(c)); }
function updateCartCount(){
  const c = getCart();
  const count = c.reduce((sum, item)=> sum + item.qty, 0);
  $('#cartCount').text(count);
}
function addToCart(product){
  const cart = getCart();
  const idx = cart.findIndex(it => it.id === product.id);
  if (idx >= 0) cart[idx].qty += 1;
  else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
  saveCart(cart);
  updateCartCount();
}

// jQuery ready
$(function () {
  updateCartCount();

  // Highlight active nav link
  const path = location.pathname.split('/').pop() || 'index.html';
  $('.navbar .nav-link').each(function(){
    const href = $(this).attr('href');
    if (href === path) $(this).addClass('active');
  });

  // Load featured products on Home
  if ($('#featuredProducts').length) {
    $.getJSON('sneakers.json', function(data){
      const featured = data.slice(0, 4);
      const $wrap = $('#featuredProducts');
      featured.forEach(p => $wrap.append(productCard(p, 'col-6 col-md-3')));
      $wrap.hide().fadeIn(500);
    });
  }

  // Products page: load + filters
  if ($('#productGrid').length) {
    $.getJSON('sneakers.json', function(data){
      window._products = data;
      fillBrandFilter(data);
      renderProducts(data);
    });

    $('#searchInput, #brandSelect, #sortSelect').on('input change', function(){
      applyFilters();
    });
  }

  // Contact form validation + Ajax (simulated)
  $('#contactForm').on('submit', function(e){
    e.preventDefault();
    const form = this;

    const name = $('#name').val().trim();
    const email = $('#email').val().trim();
    const message = $('#message').val().trim();
    const emailOk = /^[\w\.-]+@[\w\.-]+\.[A-Za-z]{2,}$/.test(email);

    setValidity('#name', name.length >= 2);
    setValidity('#email', emailOk);
    setValidity('#message', message.length >= 10);

    if (!emailOk || name.length < 2 || message.length < 10) return;

    $.ajax({
      url: 'assets/mock-endpoint.json',
      method: 'POST',
      data: JSON.stringify({ name, email, message, ts: Date.now() }),
      contentType: 'application/json',
      success: function(){ $('#formAlert').removeClass('d-none').hide().fadeIn(200); form.reset(); },
      error: function(){ $('#formAlert').removeClass('d-none').hide().fadeIn(200); form.reset(); }
    });
  });
});

function setValidity(selector, ok) {
  const $el = $(selector);
  if (ok) $el.removeClass('is-invalid').addClass('is-valid');
  else $el.removeClass('is-valid').addClass('is-invalid');
}

function productCard(p, colClass='col-6 col-md-4 col-lg-3') {
  return `<div class="${colClass}">
    <div class="card h-100 product-card">
      <img class="card-img-top" src="${p.image}" alt="${p.name}">
      <div class="card-body d-flex flex-column">
        <h3 class="h6 card-title mb-1">${p.name}</h3>
        <p class="text-muted small mb-2">${p.brand}</p>
        <div class="mt-auto d-flex justify-content-between align-items-center">
          <span class="fw-semibold">$${p.price.toFixed(2)}</span>
          <button class="btn btn-sm btn-primary add-btn" data-id="${p.id}">Add</button>
        </div>
      </div>
    </div>
  </div>`;
}

function fillBrandFilter(data) {
  const brands = [...new Set(data.map(p => p.brand))].sort();
  const $sel = $('#brandSelect');
  brands.forEach(b => $sel.append(`<option value="${b}">${b}</option>`));
}

function renderProducts(list) {
  const $grid = $('#productGrid');
  $grid.empty();
  list.forEach(p => $grid.append(productCard(p)));
  $('.add-btn').off('click').on('click', function(){
    const id = $(this).data('id');
    const p = window._products ? window._products.find(x => x.id === id) : null;
    if (p) addToCart(p);
    $(this).closest('.card').addClass('shadow').fadeOut(150).fadeIn(150).removeClass('shadow');
  });
}

function applyFilters() {
  let list = [...window._products];
  const q = $('#searchInput').val().toLowerCase();
  const brand = $('#brandSelect').val();
  const sort = $('#sortSelect').val();

  if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  if (brand) list = list.filter(p => p.brand === brand);
  switch (sort) {
    case 'name-asc': list.sort((a,b)=>a.name.localeCompare(b.name)); break;
    case 'name-desc': list.sort((a,b)=>b.name.localeCompare(a.name)); break;
    case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
  }
  renderProducts(list);
}

function renderCart(){
  const cart = getCart();
  updateCartCount();
  const $empty = $('#cartEmpty');
  const $wrap = $('#cartTableWrap');
  const $body = $('#cartBody').empty();

  if (!cart.length){
    $wrap.addClass('d-none'); $empty.removeClass('d-none');
    $('#grandTotal').text('$0.00');
    return;
  }
  $empty.addClass('d-none'); $wrap.removeClass('d-none');

  let grand = 0;
  cart.forEach((it, idx)=>{
    const total = it.price * it.qty;
    grand += total;
    $body.append(`
      <tr>
        <td>
          <div class="d-flex align-items-center gap-3">
            <img src="${it.image}" alt="${it.name}" style="width:64px;height:64px;object-fit:cover;border-radius:8px;">
            <div>
              <div class="fw-semibold">${it.name}</div>
              <div class="text-muted small">#${it.id}</div>
            </div>
          </div>
        </td>
        <td>$${it.price.toFixed(2)}</td>
        <td>
          <div class="input-group input-group-sm" style="max-width:140px;">
            <button class="btn btn-outline-secondary btn-dec" data-idx="${idx}">-</button>
            <input class="form-control text-center qty-input" data-idx="${idx}" value="${it.qty}">
            <button class="btn btn-outline-secondary btn-inc" data-idx="${idx}">+</button>
          </div>
        </td>
        <td>$${total.toFixed(2)}</td>
        <td><button class="btn btn-outline-danger btn-sm btn-del" data-idx="${idx}">Remove</button></td>
      </tr>
    `);
  });
  $('#grandTotal').text(`$${grand.toFixed(2)}`);

  $('.btn-inc').off().on('click', function(){ const i=+$(this).data('idx'); const c=getCart(); c[i].qty++; saveCart(c); renderCart(); });
  $('.btn-dec').off().on('click', function(){ const i=+$(this).data('idx'); const c=getCart(); c[i].qty=Math.max(1,c[i].qty-1); saveCart(c); renderCart(); });
  $('.qty-input').off().on('change', function(){ const i=+$(this).data('idx'); const v=Math.max(1,parseInt($(this).val()||'1',10)); const c=getCart(); c[i].qty=v; saveCart(c); renderCart(); });
  $('.btn-del').off().on('click', function(){ const i=+$(this).data('idx'); const c=getCart(); c.splice(i,1); saveCart(c); renderCart(); });
  $('#clearCart').off().on('click', function(){ saveCart([]); renderCart(); });
}
// === Checkout Page Logic ===
if (document.getElementById('checkout-form')) {
  const checkoutItems = document.getElementById('checkout-items');
  const checkoutTotal = document.getElementById('checkout-total');
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  // Render order summary
  if (cart.length > 0) {
    let total = 0;
    cart.forEach(item => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `${item.name} <span>$${item.price.toFixed(2)} × ${item.qty}</span>`;
      checkoutItems.appendChild(li);
      total += item.price * item.qty;
    });
    checkoutTotal.textContent = `$${total.toFixed(2)}`;
  } else {
    checkoutItems.innerHTML = '<li class="list-group-item text-center">Your cart is empty.</li>';
  }

  // Handle form submit
  $('#checkout-form').on('submit', function (e) {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    localStorage.removeItem('cart');
    $('#checkout-form').hide();
    $('#success-message').removeClass('d-none');
    // also update the cart badge in navbar if it exists
    $('#cartCount').text('0');
  });
}

