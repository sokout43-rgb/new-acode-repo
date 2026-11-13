/* ============ shop.js (نسخه اصلاح‌شده برای وب‌سرور) ============ */

const CATEGORIES = ['همه', 'تیشرت', 'پیراهن', 'شلوار', 'جوراب', 'کفش', 'کیف', 'کلاه', 'اکسسوری'];

/* ---------- هدر و منو ---------- */
function initHeader(activePage) {
  const el = document.getElementById('siteHeader');
  if (!el) return;
  const user = localStorage.getItem('loggedInUser');
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  el.innerHTML = `
    <header class="shop-header">
      <div class="header-inner">
        <a href="index.html" class="logo">🛍️ <span>پوشاک لند | Pushak Land</span></a>

        <button class="hamburger" onclick="toggleMobileMenu()" aria-label="منو">
          <span></span><span></span><span></span>
        </button>

        <nav class="nav-links" id="mainNav">
          <a href="index.html" class="${activePage==='index'?'active':''}">صفحه اصلی</a>
          
          <div class="nav-dropdown">
            <a href="products.html" class="${activePage==='products'?'active':''}" onclick="toggleDropdown(event)">محصولات ▾</a>
            <div class="dropdown-menu" id="dropdownMenu">
              ${CATEGORIES.filter(c=>c!=='همه').map(c =>
                `<a href="products.html?cat=${encodeURIComponent(c)}">${c}</a>`).join('')}
            </div>
          </div>

          <a href="cart.html" class="${activePage==='cart'?'active':''}">سبد خرید ${cartCount>0?`<span class="cart-badge">${cartCount}</span>`:''}</a>
          <a href="about.html" class="${activePage==='about'?'active':''}">درباره ما</a>
          <a href="contact.html" class="${activePage==='contact'?'active':''}">ارتباط با ما</a>
        </nav>

        <div class="auth-buttons">
          ${user
            ? `<span class="welcome-chip">👋 ${user}</span>
               <button class="header-btn danger" onclick="logout()">خروج</button>`
            : `<a href="login.html" class="header-btn">ورود</a>
               <a href="register.html" class="header-btn primary">ثبت‌نام</a>`}
        </div>
      </div>
    </header>
  `;
}

function toggleMobileMenu() {
  document.getElementById('mainNav').classList.toggle('open');
  document.querySelector('.hamburger').classList.toggle('open');
  const dropdown = document.getElementById('dropdownMenu');
  if (dropdown) dropdown.classList.remove('open');
}

function toggleDropdown(e) {
  if (window.innerWidth <= 900) {
    e.preventDefault();
    const dropdown = document.getElementById('dropdownMenu');
    if (dropdown) dropdown.classList.toggle('open');
  }
}

/* ---------- اسلایدر ---------- */
function initSlider() {
  const slides = document.querySelectorAll('.hero-slider .slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  if (!slides.length) return;
  let i = 0;
  function show(n) {
    slides.forEach((s, k) => s.classList.toggle('active', k === n));
    dots.forEach((d, k) => d.classList.toggle('active', k === n));
    i = n;
  }
  dots.forEach(d => d.onclick = () => show(+d.dataset.i));
  setInterval(() => show((i + 1) % slides.length), 5000);
}

/* ---------- خواندن محصولات از فایل JSON ---------- */
async function getProducts() {
  try {
    // خواندن با اضافه کردن زمان به انتهای آدرس برای جلوگیری از کش شدن
    const response = await fetch('products.json?t=' + new Date().getTime());
    
    if (!response.ok) {
      throw new Error('فایل پیدا نشد (کد وضعیت: ' + response.status + ')');
    }
    
    const data = await response.json();
    if (data && data.length > 0) {
      return data;
    } else {
      throw new Error('فایل JSON خالی است');
    }
  } catch (error) {
    console.error('🚨 خطا در خواندن محصولات:', error.message);
    console.warn('به جای فایل، از داده‌های تستی استفاده می‌شود.');
    
    // داده‌های تستی در صورت بروز خطا
    return [
      { id: "1", name: "تیشرت نخی مردانه (تستی)", price: 350000, category: "تیشرت", desc: "تیشرت با کیفیت بالا", image: "" },
      { id: "2", name: "کفش اسپرت سفید (تستی)", price: 950000, category: "کفش", desc: "کفش سبک و راحت", image: "" },
      { id: "3", name: "کیف چرم دست‌دوز (تستی)", price: 1200000, category: "کیف", desc: "کیف چرم طبیعی", image: "" }
    ];
  }
}

function escapeHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function productCardHtml(p) {
  return `
    <a href="product.html?id=${p.id}" class="product-card">
      <div class="product-image">
        ${p.image ? `<img src="${p.image}" alt="${escapeHtml(p.name)}" onerror="this.src=''">` : `<span class="placeholder-img">🖼️</span>`}
        <span class="product-category">${escapeHtml(p.category)}</span>
      </div>
      <div class="product-info">
        <h3>${escapeHtml(p.name)}</h3>
        <div class="product-footer">
          <span class="product-price">${Number(p.price).toLocaleString('fa-IR')} تومان</span>
        </div>
      </div>
    </a>`;
}

/* ---------- نمایش محصولات در صفحه اصلی ---------- */
async function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  
  grid.innerHTML = '<p style="color:#fff; text-align:center; grid-column:1/-1;">در حال بارگذاری...</p>';
  const products = await getProducts();
  
  grid.innerHTML = products.length
    ? products.slice(0, 8).map(productCardHtml).join('')
    : `<div class="empty-state"><span>📦</span><p>هنوز محصولی ثبت نشده است.</p></div>`;
}

/* ---------- صفحه محصولات ---------- */
function initCategoryTabs() {
  const tabs = document.getElementById('categoryTabs');
  if (!tabs) return;
  const params = new URLSearchParams(location.search);
  const active = params.get('cat') || 'همه';
  tabs.innerHTML = CATEGORIES.map(c =>
    `<a href="products.html?cat=${encodeURIComponent(c)}" class="cat-tab ${c===active?'active':''}">${c}</a>`
  ).join('');
}

async function renderProductsPage() {
  const grid = document.getElementById('productsGrid');
  const empty = document.getElementById('emptyState');
  if (!grid) return;
  
  grid.innerHTML = '<p style="color:#fff; text-align:center; grid-column:1/-1;">در حال بارگذاری...</p>';
  
  const params = new URLSearchParams(location.search);
  const cat = params.get('cat') || 'همه';
  let products = await getProducts();
  
  if (cat !== 'همه') {
    products = products.filter(p => p.category === cat);
  }

  if (!products.length) {
    grid.style.display = 'none';
    if (empty) empty.style.display = 'block';
    return;
  }
  
  grid.style.display = 'grid';
  grid.innerHTML = products.map(productCardHtml).join('');
}

/* ---------- صفحه جزئیات محصول ---------- */
async function renderProductDetail() {
  const box = document.getElementById('productDetail');
  if (!box) return;
  
  box.innerHTML = '<p style="color:#fff; text-align:center;">در حال بارگذاری...</p>';
  
  const id = new URLSearchParams(location.search).get('id');
  const products = await getProducts();
  const p = products.find(x => String(x.id) === String(id));

  if (!p) {
    box.innerHTML = `<div class="empty-state"><span>❌</span><p>محصول یافت نشد.</p>
      <a href="products.html" class="btn">بازگشت به محصولات</a></div>`;
    return;
  }
  
  box.innerHTML = `
    <div class="product-detail">
      <div class="detail-image">
        ${p.image ? `<img src="${p.image}" alt="${escapeHtml(p.name)}" onerror="this.src=''">` : `<span class="placeholder-img">🖼️</span>`}
      </div>
      <div class="detail-info">
        <span class="product-category inline">${escapeHtml(p.category)}</span>
        <h1>${escapeHtml(p.name)}</h1>
        <p class="detail-price">${Number(p.price).toLocaleString('fa-IR')} تومان</p>
        <p class="detail-desc">${escapeHtml(p.desc || '')}</p>
        <div class="qty-selector">
          <label>تعداد:</label>
          <input type="number" id="qtyInput" value="1" min="1" max="99">
        </div>
        <button class="btn" onclick="addToCart('${p.id}', '${escapeHtml(p.name)}', ${p.price}, '${p.image}')">افزودن به سبد خرید 🛒</button>
        <a href="products.html" class="back-link">← بازگشت به محصولات</a>
      </div>
    </div>`;
}

/* ---------- سبد خرید ---------- */
function addToCart(id, name, price, image) {
  const qty = Number(document.getElementById('qtyInput')?.value || 1);
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find(i => String(i.id) === String(id));
  
  if (existing) existing.qty += qty;
  else cart.push({ id, name, price, image, qty });
  
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('✅ محصول به سبد خرید اضافه شد.');
  initHeader('');
}

function renderCart() {
  const box = document.getElementById('cartContent');
  if (!box) return;
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

  if (!cart.length) {
    box.innerHTML = `<div class="empty-state"><span>🛒</span><p>سبد خرید شما خالی است.</p>
      <a href="products.html" class="btn">شروع خرید</a></div>`;
    return;
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  box.innerHTML = `
    <div class="cart-list">
      ${cart.map(i => `
        <div class="cart-item">
          <div class="cart-img">${i.image ? `<img src="${i.image}">` : '🖼️'}</div>
          <div class="cart-info">
            <h3>${escapeHtml(i.name)}</h3>
            <p class="cart-price">${Number(i.price).toLocaleString('fa-IR')} تومان</p>
          </div>
          <div class="cart-qty">
            <button onclick="changeQty('${i.id}', -1)">−</button>
            <span>${i.qty}</span>
            <button onclick="changeQty('${i.id}', 1)">+</button>
          </div>
          <button class="cart-remove" onclick="removeFromCart('${i.id}')">✕</button>
        </div>`).join('')}
    </div>
    <div class="cart-summary">
      <div class="cart-total">مجموع: <strong>${total.toLocaleString('fa-IR')} تومان</strong></div>
      <button class="btn" onclick="checkout()">تکمیل خرید</button>
    </div>`;
}

function changeQty(id, delta) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const item = cart.find(i => String(i.id) === String(id));
  if (!item) return;
  item.qty += delta;
  if (item.qty < 1) cart = cart.filter(i => String(i.id) !== String(id));
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  initHeader('cart');
}

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart = cart.filter(i => String(i.id) !== String(id));
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  initHeader('cart');
}

function checkout() {
  const user = localStorage.getItem('loggedInUser');
  if (!user) {
    alert('برای تکمیل خرید ابتدا وارد شوید.');
    location.href = 'login.html';
    return;
  }
  alert('✅ سفارش شما با موفقیت ثبت شد! (دمو)');
  localStorage.removeItem('cart');
  location.href = 'index.html';
}

function logout() {
  localStorage.removeItem('loggedInUser');
  location.href = 'index.html';
}