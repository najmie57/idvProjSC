/* main.js - shared on every page: theme, login guard, navbar, footer */

// 1) Apply saved theme immediately (avoids a light/dark flash)
document.documentElement.setAttribute('data-bs-theme', localStorage.getItem('sc_theme') || 'light');

// 2) Helpers
function currentUser() { try { return JSON.parse(sessionStorage.getItem('sc_user')); } catch (e) { return null; } }
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// 3) Login guard: protected pages redirect to login, login page redirects when already signed in
const onLoginPage = /(^|\/)(index\.html)?$/.test(location.pathname);
if (!onLoginPage && !currentUser()) location.replace('index.html');
if (onLoginPage && currentUser()) location.replace('dashboard.html');

// 4) Menu items: [page key, label, icon, link]
const NAV_ITEMS = [
  ['dashboard','Dashboard','bi-speedometer2','dashboard.html'],
  ['bookings','Bookings','bi-calendar-check','bookings.html'],
  ['facilities','Facilities','bi-grid-3x3-gap','facilities.html'],
  ['members','Members','bi-people','members.html'],
  ['newbooking','New Booking','bi-plus-circle','booking-form.html']
];

document.addEventListener('DOMContentLoaded', () => {
  const user = currentUser(), host = document.getElementById('app-nav');

  // Build the same responsive navbar + footer on every page
  if (host && user) {
    const page = document.body.dataset.page;
    // The navbar is collapsed after a fresh login, then keeps whatever state the user left it in (per browser tab)
    const navOpen = sessionStorage.getItem('sc_nav_open') === '1';
    host.innerHTML = `
    <nav class="navbar navbar-expand-lg bg-body border-bottom sticky-top" aria-label="Main navigation">
      <div class="container-fluid px-3 px-lg-4">
        <!-- Mobile/tablet: normal brand link (unchanged behaviour) -->
        <a class="navbar-brand fw-bold d-lg-none" href="dashboard.html"><i class="bi bi-trophy-fill text-primary me-2"></i>SportsHub</a>

        <!-- CHANGE 2 (desktop only): the trophy is a toggle button that shows/hides the page links -->
        <button class="nav-trophy d-none d-lg-inline-flex me-lg-3" type="button" id="navTrophy"
                aria-controls="navLinks" aria-expanded="${navOpen}" aria-label="${navOpen ? 'Hide' : 'Show'} navigation menu" title="Menu">
          <i class="bi bi-trophy-fill" aria-hidden="true"></i>
        </button>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainMenu"
                aria-controls="mainMenu" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
        <div class="collapse navbar-collapse" id="mainMenu">
          <!-- Page links: slide out to the right of the trophy on desktop, normal vertical list on mobile -->
          <div class="nav-links ${navOpen ? 'is-open' : ''}" id="navLinks"><div class="nav-links-inner">
            <ul class="navbar-nav mb-2 mb-lg-0">
              ${NAV_ITEMS.map(n => `<li class="nav-item"><a class="nav-link ${n[0] === page ? 'active' : ''}" href="${n[3]}"
                 ${n[0] === page ? 'aria-current="page"' : ''}><i class="bi ${n[2]} me-1"></i>${n[1]}</a></li>`).join('')}
            </ul>
          </div></div>
          <!-- Theme toggle, user and logout stay visible on desktop so they are always reachable -->
          <div class="d-flex align-items-center gap-2 ms-lg-auto">
            <button class="btn btn-outline-secondary btn-sm" data-theme-toggle aria-label="Toggle dark mode"><i class="bi"></i></button>
            <span class="small text-body-secondary d-none d-lg-inline">${esc(user.name)} (${esc(user.role)})</span>
            <button class="btn btn-primary btn-sm" id="logoutBtn"><i class="bi bi-box-arrow-right me-1"></i>Logout</button>
          </div>
        </div>
      </div>
    </nav>`;
    // Trophy toggle (desktop): expands/collapses the links. aria-expanded + aria-label keep it accessible.
    const trophy = document.getElementById('navTrophy'), links = document.getElementById('navLinks');
    const setOpen = open => {
      links.classList.toggle('is-open', open);
      sessionStorage.setItem('sc_nav_open', open ? '1' : '0');   // remember across pages until logout
      trophy.setAttribute('aria-expanded', String(open));
      trophy.setAttribute('aria-label', open ? 'Hide navigation menu' : 'Show navigation menu');
    };
    trophy.addEventListener('click', () => setOpen(trophy.getAttribute('aria-expanded') !== 'true')); // Enter/Space work natively on <button>
    host.addEventListener('keydown', e => {              // Esc closes the menu and returns focus to the trophy
      if (e.key === 'Escape' && trophy.getAttribute('aria-expanded') === 'true') { setOpen(false); trophy.focus(); }
    });
    document.body.insertAdjacentHTML('beforeend', `
      <footer class="site-footer">
        <div class="container">
          <div class="row g-4">
            <div class="col-md-5"><a class="footer-brand" href="dashboard.html">SportsHub</a><p class="mb-0">Your passion for sports, our passion for service.</p></div>
            <div class="col-6 col-md-3"><h2 class="h6 text-white">Quick links</h2>${NAV_ITEMS.map(n => `<a href="${n[3]}">${n[1]}</a>`).join('')}</div>
            <div class="col-6 col-md-4"><h2 class="h6 text-white">Reach us</h2><p class="mb-1">sportshub@gmail.com</p><p class="mb-0">+60 3-1234 5678</p></div>
          </div>
          <div class="footer-bottom">&copy; 2026 SportsHub Sports Complex &middot; All rights reserved</div>
        </div>
      </footer>`);
    document.getElementById('logoutBtn').addEventListener('click', () => {
      sessionStorage.removeItem('sc_user'); sessionStorage.removeItem('sc_nav_open'); location.href = 'index.html';
    });
  }

  // 5) Theme toggle (works on the login page and in the navbar)
  const setIcons = () => {
    const dark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    document.querySelectorAll('[data-theme-toggle] i').forEach(i => i.className = 'bi ' + (dark ? 'bi-sun-fill' : 'bi-moon-stars-fill'));
  };
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', next);
    localStorage.setItem('sc_theme', next);
    setIcons();
    window.dispatchEvent(new Event('themechange')); // lets charts redraw in the new colours
  }));
  setIcons();
});
