/* ============ auth.js ============ */

function togglePassword(id, btn) {
  const input = document.getElementById(id);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
}

function showMsg(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = 'message show ' + type;
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 4000);
}

function redirectAfterLoading(btn, url, delay) {
  btn.classList.add('loading');
  setTimeout(() => {
    btn.classList.remove('loading');
    window.location.href = url;
  }, delay || 1000);
}

/* ---------- منطق ثبت‌نام (فقط در register.html) ---------- */
const regForm = document.getElementById('registerForm');
if (regForm) {
  regForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const user = document.getElementById('regUser').value.trim();
    const pass = document.getElementById('regPass').value;
    const pass2 = document.getElementById('regPass2').value;

    if (user.length < 3) {
      return showMsg('registerMsg', 'نام کاربری باید حداقل ۳ کاراکتر باشد.', 'error');
    }
    if (pass.length < 4) {
      return showMsg('registerMsg', 'رمز عبور باید حداقل ۴ کاراکتر باشد.', 'error');
    }
    if (pass !== pass2) {
      return showMsg('registerMsg', 'رمزهای عبور یکسان نیستند.', 'error');
    }
    if (localStorage.getItem('user_' + user)) {
      return showMsg('registerMsg', 'این نام کاربری قبلاً ثبت شده است.', 'error');
    }

    localStorage.setItem('user_' + user, pass);
    showMsg('registerMsg', 'ثبت‌نام موفق! در حال انتقال...', 'success');
    redirectAfterLoading(this.querySelector('.btn'), 'login.html', 1200);
  });
}

/* ---------- منطق ورود (فقط در login.html) ---------- */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    const stored = localStorage.getItem('user_' + user);

    if (!stored) {
      return showMsg('loginMsg', 'کاربری با این نام یافت نشد.', 'error');
    }
    if (stored !== pass) {
      return showMsg('loginMsg', 'رمز عبور اشتباه است.', 'error');
    }

    localStorage.setItem('loggedInUser', user);
    showMsg('loginMsg', 'ورود موفق! در حال انتقال...', 'success');
    redirectAfterLoading(this.querySelector('.btn'), 'main.html', 1000);
  });

  // اگر کاربر قبلاً وارد شده بود، مستقیم برود به صفحه اصلی
  if (localStorage.getItem('loggedInUser')) {
    window.location.href = 'main.html';
  }
}

/* ---------- منطق صفحه اصلی (فقط در main.html) ---------- */
const mainPage = document.getElementById('mainPage');
if (mainPage) {
  const user = localStorage.getItem('loggedInUser');
  if (!user) {
    // محافظت از صفحه: اگر وارد نشده، برگرد به login
    window.location.href = 'login.html';
  } else {
    document.getElementById('welcomeUser').textContent = user;
  }
}

function logout() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'login.html';
}
/* ============ auth.js (به‌روزشده) ============ */

function togglePassword(id, btn) {
  const input = document.getElementById(id);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
}

function showMsg(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = 'message show ' + type;
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 4000);
}

function redirectAfterLoading(btn, url, delay) {
  btn.classList.add('loading');
  setTimeout(() => {
    btn.classList.remove('loading');
    window.location.href = url;
  }, delay || 1000);
}

/* ---------- ثبت‌نام ---------- */
const regForm = document.getElementById('registerForm');
if (regForm) {
  regForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const user = document.getElementById('regUser').value.trim();
    const pass = document.getElementById('regPass').value;
    const pass2 = document.getElementById('regPass2').value;

    if (user.length < 3) return showMsg('registerMsg', 'نام کاربری باید حداقل ۳ کاراکتر باشد.', 'error');
    if (pass.length < 4) return showMsg('registerMsg', 'رمز عبور باید حداقل ۴ کاراکتر باشد.', 'error');
    if (pass !== pass2) return showMsg('registerMsg', 'رمزهای عبور یکسان نیستند.', 'error');
    if (localStorage.getItem('user_' + user)) return showMsg('registerMsg', 'این نام کاربری قبلاً ثبت شده است.', 'error');

    localStorage.setItem('user_' + user, pass);
    showMsg('registerMsg', 'ثبت‌نام موفق! در حال انتقال...', 'success');
    redirectAfterLoading(this.querySelector('.btn'), 'index.html', 1200);
  });
}

/* ---------- ورود ---------- */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    const stored = localStorage.getItem('user_' + user);

    if (!stored) return showMsg('loginMsg', 'کاربری با این نام یافت نشد.', 'error');
    if (stored !== pass) return showMsg('loginMsg', 'رمز عبور اشتباه است.', 'error');

    localStorage.setItem('loggedInUser', user);
    showMsg('loginMsg', 'ورود موفق! در حال انتقال...', 'success');
    redirectAfterLoading(this.querySelector('.btn'), 'index.html', 1000);
  });
}

/* ---------- دکمه‌های هدر (ورود/ثبت‌نام یا نام کاربر) ---------- */
function renderAuthButtons() {
  const container = document.getElementById('authButtons');
  if (!container) return;
  const user = localStorage.getItem('loggedInUser');

  if (user) {
    container.innerHTML = `
      <span class="welcome-chip">👋 ${user}</span>
      <a href="upload.html" class="header-btn primary">+ آپلود محصول</a>
      <button class="header-btn danger" onclick="logout()">خروج</button>
    `;
  } else {
    container.innerHTML = `
      <a href="login.html" class="header-btn">ورود</a>
      <a href="register.html" class="header-btn primary">ثبت‌نام</a>
    `;
  }
}

function logout() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'index.html';
}

/* ---------- محافظت از صفحات خاص ---------- */
function requireLogin() {
  const user = localStorage.getItem('loggedInUser');
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

document.addEventListener('DOMContentLoaded', renderAuthButtons);