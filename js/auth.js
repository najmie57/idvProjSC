/* auth.js - simulated authentication (no database).
   Hardcoded accounts + accounts created on the Register tab (kept in localStorage). */
const DEFAULT_USERS = [
  {username:'admin', password:'admin123', name:'Admin Aiman', role:'Admin'},
  {username:'user',  password:'user123',  name:'Sara Lim',    role:'Member'}
];
function getUsers() {
  try { return DEFAULT_USERS.concat(JSON.parse(localStorage.getItem('sc_users') || '[]')); }
  catch (e) { return DEFAULT_USERS; }
}
function showMsg(el, text, type) {
  el.className = 'alert alert-' + type; el.textContent = text; // shows error/success feedback
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm'), registerForm = document.getElementById('registerForm');
  const loginMsg = document.getElementById('loginMsg'), regMsg = document.getElementById('registerMsg');
  const loginUser = document.getElementById('loginUser'), loginPass = document.getElementById('loginPass');
  const showTab = tab => new bootstrap.Tab(document.getElementById(tab === 'register' ? 'register-tab' : 'login-tab')).show();
  const applyHash = () => showTab(location.hash === '#register' ? 'register' : 'login');

  document.querySelectorAll('[data-demo-user]').forEach(link => link.addEventListener('click', () => {
    const isAdmin = link.dataset.demoUser === 'admin';
    loginUser.value = isAdmin ? 'admin' : 'user';
    loginPass.value = isAdmin ? 'admin123' : 'user123';
    loginUser.focus();
  }));
  window.addEventListener('hashchange', applyHash);

  // ---- Login ----
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const u = loginUser.value.trim().toLowerCase();
    const p = loginPass.value;
    const user = getUsers().find(x => x.username === u && x.password === p);
    if (!user) { showMsg(loginMsg, 'Invalid username or password. Check your details and try again.', 'danger'); return; }
    sessionStorage.removeItem('sc_nav_open');   // navbar starts collapsed once per login session
    sessionStorage.setItem('sc_user', JSON.stringify({username: user.username, name: user.name, role: user.role}));
    location.href = 'dashboard.html';
  });

  // ---- Register ----
  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const u = document.getElementById('regUser').value.trim().toLowerCase();
    const p = document.getElementById('regPass').value, p2 = document.getElementById('regPass2').value;
    if (getUsers().some(x => x.username === u)) return showMsg(regMsg, 'That username is taken. Choose another one.', 'danger');
    if (p.length < 6) return showMsg(regMsg, 'Password must be at least 6 characters.', 'danger');
    if (p !== p2) return showMsg(regMsg, 'Passwords do not match.', 'danger');
    const saved = JSON.parse(localStorage.getItem('sc_users') || '[]');
    saved.push({username: u, password: p, name, role: 'Member', joined: isoDate(0)});   // 'joined' feeds the Members page
    localStorage.setItem('sc_users', JSON.stringify(saved));
    registerForm.reset();
    loginUser.value = u;
    history.replaceState(null, '', '#login');
    showMsg(loginMsg, 'Account created. Log in with your new username.', 'success');
    showTab('login');
  });

  applyHash();
});
