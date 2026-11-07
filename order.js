// ---------- Settings ----------
const TAX_RATE = 0.16;
const PROMOS = { VIBE10: 0.10, LATTELOVE: 0.15 }; // code: discount

// ---------- Menu data ----------
const MENU = [
  { id: 1,  name: 'Cafe Latte',          price: 650,  cat: 'Espresso' },
  { id: 2,  name: 'Cafe Mocha',          price: 720,  cat: 'Espresso' },
  { id: 3,  name: 'Caramel Macchiato',   price: 1160, cat: 'Espresso' },
  { id: 4,  name: 'Cappuccino',          price: 800,  cat: 'Espresso' },
  { id: 5,  name: 'Double Espresso',     price: 1200, cat: 'Espresso' },
  { id: 6,  name: 'Iced Coffee',         price: 980,  cat: 'Iced' },
  { id: 7,  name: 'Iced Tea',            price: 850,  cat: 'Iced' },
  { id: 8,  name: 'Mocha Latte',         price: 1080, cat: 'Iced' },
  { id: 9,  name: 'Frappe Latte',        price: 1250, cat: 'Iced' },
  { id: 10, name: 'Egg Cheese Sandwich', price: 650,  cat: 'Sandwiches' },
  { id: 11, name: 'Bacon, Egg & Cheese', price: 750,  cat: 'Sandwiches' },
  { id: 12, name: 'Bologna',             price: 800,  cat: 'Sandwiches' },
  { id: 13, name: 'Croque-Monsieur',     price: 980,  cat: 'Sandwiches' }
];

// ---------- State ----------
let cart = {};
let activeCat = 'All';
let searchText = '';
let activePromo = null;

try {
  cart = JSON.parse(localStorage.getItem('brewsterCart')) || {};
} catch (e) {
  cart = {};
}

function saveCart() {
  try { localStorage.setItem('brewsterCart', JSON.stringify(cart)); } catch (e) {}
}

function rs(n) {
  return 'Rs. ' + Math.round(n).toLocaleString('en-PK');
}

function findItem(id) {
  return MENU.find(m => m.id === id);
}

// Sab hisaab ek jagah
function calc() {
  let subtotal = 0;
  Object.keys(cart).forEach(id => {
    const item = findItem(Number(id));
    if (item) subtotal += item.price * cart[id];
  });
  const discount = activePromo ? subtotal * PROMOS[activePromo] : 0;
  const tax = (subtotal - discount) * TAX_RATE;
  return { subtotal, discount, tax, total: subtotal - discount + tax };
}

// ---------- Product list (filter + search) ----------
const productList = document.getElementById('product-list');

function renderProducts() {
  const text = searchText.toLowerCase();
  const list = MENU.filter(m =>
    (activeCat === 'All' || m.cat === activeCat) &&
    m.name.toLowerCase().includes(text)
  );

  if (list.length === 0) {
    productList.innerHTML = '<p class="empty-search">Nothing found 😅 try another word.</p>';
    return;
  }

  const categories = [...new Set(list.map(m => m.cat))];
  let html = '';
  categories.forEach(cat => {
    html += `<h4 class="cat-title">${cat}</h4><div class="product-grid">`;
    list.filter(m => m.cat === cat).forEach(item => {
      html += `
        <div class="product">
          <div>
            <p class="p-name">${item.name}</p>
            <p class="p-price">${rs(item.price)}</p>
          </div>
          <button class="add-btn" data-id="${item.id}">+ Add</button>
        </div>`;
    });
    html += '</div>';
  });
  productList.innerHTML = html;
}

productList.addEventListener('click', e => {
  const btn = e.target.closest('.add-btn');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
});

document.getElementById('filters').addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  activeCat = btn.dataset.cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts();
});

document.getElementById('search').addEventListener('input', e => {
  searchText = e.target.value.trim();
  renderProducts();
});

// ---------- Cart ----------
const cartItemsBox = document.getElementById('cart-items');

function renderCart() {
  const ids = Object.keys(cart);

  if (ids.length === 0) {
    cartItemsBox.innerHTML = '<p class="empty">Cart khali hai. Menu se items add karein.</p>';
  } else {
    let html = '';
    ids.forEach(id => {
      const item = findItem(Number(id));
      if (!item) return;
      const qty = cart[id];
      html += `
        <div class="cart-row">
          <div class="c-info">
            <p class="c-name">${item.name}</p>
            <p class="c-line">${rs(item.price)} x ${qty} = ${rs(item.price * qty)}</p>
          </div>
          <div class="qty">
            <button data-act="minus" data-id="${id}">−</button>
            <span>${qty}</span>
            <button data-act="plus" data-id="${id}">+</button>
          </div>
        </div>`;
    });
    cartItemsBox.innerHTML = html;
  }

  const t = calc();
  document.getElementById('subtotal').textContent = rs(t.subtotal);
  document.getElementById('tax-label').textContent = Math.round(TAX_RATE * 100) + '%';
  document.getElementById('tax').textContent = rs(t.tax);
  document.getElementById('total').textContent = rs(t.total);

  const discRow = document.getElementById('discount-row');
  if (activePromo && t.discount > 0) {
    discRow.style.display = 'flex';
    document.getElementById('promo-label').textContent = activePromo;
    document.getElementById('discount').textContent = '- ' + rs(t.discount);
  } else {
    discRow.style.display = 'none';
  }
}

cartItemsBox.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.dataset.id;

  if (btn.dataset.act === 'plus') cart[id]++;
  if (btn.dataset.act === 'minus') {
    cart[id]--;
    if (cart[id] <= 0) delete cart[id];
  }
  saveCart();
  renderCart();
});

document.getElementById('clear-cart').addEventListener('click', () => {
  cart = {};
  saveCart();
  renderCart();
});

// ---------- Promo code ----------
const promoMsg = document.getElementById('promo-msg');

document.getElementById('apply-promo').addEventListener('click', () => {
  const code = document.getElementById('promo-input').value.trim().toUpperCase();
  if (PROMOS[code]) {
    activePromo = code;
    promoMsg.textContent = `Code applied: ${Math.round(PROMOS[code] * 100)}% off 🎉`;
    promoMsg.className = 'ok';
  } else {
    activePromo = null;
    promoMsg.textContent = 'Invalid code 😕';
    promoMsg.className = '';
  }
  renderCart();
});

// ---------- Delivery address ----------
const orderType = document.getElementById('order-type');
const addressBox = document.getElementById('cust-address');

orderType.addEventListener('change', () => {
  addressBox.style.display = orderType.value === 'Delivery' ? 'block' : 'none';
});

// ---------- Place order ----------
const errorMsg = document.getElementById('error-msg');
const overlay = document.getElementById('receipt-overlay');

document.getElementById('place-order').addEventListener('click', () => {
  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const type = orderType.value;
  const address = addressBox.value.trim();

  if (Object.keys(cart).length === 0) {
    errorMsg.textContent = 'Pehle kuch items add karein.';
    return;
  }
  if (!name || !phone) {
    errorMsg.textContent = 'Naam aur phone number zaroori hain.';
    return;
  }
  if (type === 'Delivery' && !address) {
    errorMsg.textContent = 'Delivery ke liye address likhein.';
    return;
  }
  errorMsg.textContent = '';

  const t = calc();
  let itemsHtml = '';
  Object.keys(cart).forEach(id => {
    const item = findItem(Number(id));
    if (!item) return;
    itemsHtml += `<div class="bill-row"><span>${item.name} x ${cart[id]}</span><span>${rs(item.price * cart[id])}</span></div>`;
  });
  if (activePromo) {
    itemsHtml += `<div class="bill-row discount"><span>Promo ${activePromo}</span><span>- ${rs(t.discount)}</span></div>`;
  }

  const orderNo = 'BR-' + Math.floor(1000 + Math.random() * 9000);

  document.getElementById('receipt-info').innerHTML =
    `Order No: <b>${orderNo}</b><br>${name} | ${phone}<br>${type}` +
    (type === 'Delivery' ? `<br>${address}` : '');
  document.getElementById('receipt-items').innerHTML = itemsHtml;
  document.getElementById('receipt-total').textContent =
    rs(t.total) + ` (incl. ${Math.round(TAX_RATE * 100)}% tax)`;

  overlay.classList.add('show');

  cart = {};
  activePromo = null;
  promoMsg.textContent = '';
  document.getElementById('promo-input').value = '';
  saveCart();
  renderCart();
});

document.getElementById('close-receipt').addEventListener('click', () => {
  overlay.classList.remove('show');
});

// ---------- Start ----------
renderProducts();
renderCart();