/* pages.js - renders the data views and handles the booking form.
   Each init function runs only on its own page (matched with <body data-page="...">). */

const STATUS_BADGE = {Confirmed:'success', Pending:'warning', Completed:'info', Cancelled:'danger', Active:'success', Inactive:'secondary',
                      Available:'success', Maintenance:'warning', Premium:'primary', Basic:'secondary', Student:'info'};
const badge = t => `<span class="badge text-bg-${STATUS_BADGE[t] || 'secondary'}">${esc(t)}</span>`;
const SPORT_IMAGE = {'Badminton':'bad1.png', 'Futsal':'fut1.png', 'Pickle Ball':'pick1.jpg'};
const formatDate = iso => { const [y,m,d] = iso.split('-'); return new Date(y, m-1, d).toLocaleDateString('en-GB', {day:'numeric', month:'short', year:'numeric'}); };
const rm = n => 'RM ' + Number(n).toFixed(2);

// ---------- Dashboard: summary cards + upcoming bookings ----------
function initDashboard() {
  const all = getBookings(), live = all.filter(b => b.status !== 'Cancelled'), today = isoDate(0);
  const revenue = live.filter(b => ['Completed','Confirmed'].includes(b.status)).reduce((s, b) => s + b.amount, 0);
  const free = FACILITIES.filter(f => f.status === 'Available').length;
  const stats = [
    ["Today's bookings", live.filter(b => b.date === today).length, 'bi-calendar-event', 'success'],
    ['Revenue', rm(revenue), 'bi-cash-coin', 'primary'],
    ['Courts open', `${free} of ${FACILITIES.length}`, 'bi-grid-3x3-gap', 'info'],
    ['Active members', getMembers().filter(m => m.status === 'Active').length, 'bi-people', 'warning']
  ];
  document.getElementById('welcome').textContent = 'Welcome back, ' + currentUser().name;
  document.getElementById('statCards').innerHTML = stats.map(s => `
    <div class="col-6 col-lg-3"><div class="card h-100"><div class="card-body d-flex align-items-center gap-3">
      <div class="stat-icon bg-${s[3]}-subtle text-${s[3]}-emphasis"><i class="bi ${s[2]}"></i></div>
      <div><div class="small text-body-secondary">${s[0]}</div><div class="fs-5 fw-bold">${s[1]}</div></div>
    </div></div></div>`).join('');
  const next = live.filter(b => b.date >= today).sort((a, b) => (a.date + a.hour).localeCompare(b.date + b.hour)).slice(0, 5);
  document.getElementById('upcomingRows').innerHTML = next.map(b => `<tr><td>${formatDate(b.date)}</td><td>${b.time}</td>
    <td>${esc(b.facilityName)}</td><td>${esc(b.customer)}</td><td>${badge(b.status)}</td></tr>`).join('') ||
    '<tr><td colspan="5" class="text-center text-body-secondary py-4">No upcoming bookings yet. Create a booking to see it here.</td></tr>';
}

// ---------- Bookings table with search + filters ----------
function initBookings() {
  const q = document.getElementById('searchBox'), st = document.getElementById('statusFilter'), sp = document.getElementById('sportFilter');
  const body = document.getElementById('bookingRows'), count = document.getElementById('rowCount');
  const newId = new URLSearchParams(location.search).get('new');
  if (newId) { const a = document.getElementById('newAlert'); a.textContent = `Booking ${newId} created. It is pending confirmation.`; a.classList.remove('d-none'); }

  function draw() {
    const t = q.value.toLowerCase();
    const rows = getBookings()
      .filter(b => (!st.value || b.status === st.value) && (!sp.value || b.sport === sp.value) &&
                   (b.id + b.customer + b.facilityName).toLowerCase().includes(t))
      .sort((a, b) => (b.date + b.hour).localeCompare(a.date + a.hour)); // newest first
    count.textContent = rows.length;
    body.innerHTML = rows.map(b => `<tr><td class="fw-semibold">${b.id}</td><td>${esc(b.customer)}</td>
      <td>${esc(b.facilityName)}</td><td>${formatDate(b.date)}</td><td>${b.time}</td><td>${b.hours} hr${b.hours > 1 ? 's' : ''}</td>
      <td>${rm(b.amount)}</td><td>${badge(b.status)}</td></tr>`).join('') ||
      '<tr><td colspan="8" class="text-center text-body-secondary py-4">No bookings match your filters. Clear the search to see all.</td></tr>';
  }
  [q, st, sp].forEach(el => el.addEventListener('input', draw));
  draw();
}

// ---------- Facilities card grid with sport filter ----------
function initFacilities() {
  const grid = document.getElementById('facilityGrid'), btns = document.querySelectorAll('[data-sport]');
  function draw(sport) {
    grid.innerHTML = FACILITIES.filter(f => !sport || f.sport === sport).map(f => `
      <div class="col-sm-6 col-lg-4"><div class="card h-100">
        <div class="facility-banner sport-${f.sport.replace(' ', '').toLowerCase()}">
          <img src="images/${SPORT_IMAGE[f.sport]}" alt="${esc(f.sport)}">
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h2 class="h6 fw-bold mb-0">${esc(f.name)}</h2>${badge(f.status)}
          </div>
          <p class="small text-body-secondary mb-3">${f.type} &middot; up to ${f.capacity} players</p>
          <div class="fw-bold">${rm(f.price)}<span class="small fw-normal text-body-secondary"> / hour</span></div>
          <div class="small text-body-secondary">Peak from ${PEAK_FROM}:00: ${rm(f.price * PEAK_RATE)}</div>
        </div>
        <div class="card-footer bg-transparent border-0 pb-3">
          ${f.status === 'Available' ? `<a class="btn btn-primary btn-sm w-100" href="booking-form.html?facility=${f.id}">Book this court</a>`
                                     : '<button class="btn btn-secondary btn-sm w-100" disabled>Under maintenance</button>'}
        </div></div></div>`).join('');
  }
  btns.forEach(b => b.addEventListener('click', () => {
    btns.forEach(x => x.classList.remove('active')); b.classList.add('active'); draw(b.dataset.sport);
  }));
  draw('');
}

// ---------- Members table with search ----------
function initMembers() {
  const q = document.getElementById('searchBox'), body = document.getElementById('memberRows');
  const bookings = getBookings();
  function draw() {
    const t = q.value.toLowerCase();
    const rows = getMembers().filter(m => (m.name + m.email + m.id + (m.username || '')).toLowerCase().includes(t));
    body.innerHTML = rows.map(m => `<tr><td class="fw-semibold">${m.id}</td><td>${esc(m.name)}</td>
      <td>${m.email ? esc(m.email) : '@' + esc(m.username)}<div class="small text-body-secondary">${m.phone || 'Registered online'}</div></td><td>${badge(m.plan)}</td>
      <td>${formatDate(m.joined)}</td><td>${bookings.filter(b => b.customer === m.name && b.status !== 'Cancelled').length}</td>
      <td>${badge(m.status)}</td></tr>`).join('') ||
      '<tr><td colspan="7" class="text-center text-body-secondary py-4">No members found. Try a different name or email.</td></tr>';
  }
  q.addEventListener('input', draw); draw();
}

// ---------- New booking form (duration + validation + double-booking check) ----------
function initForm() {
  const form = document.getElementById('bookForm'), alertBox = document.getElementById('formAlert');
  const sport = document.getElementById('bfSport'), fac = document.getElementById('bfFacility'),
        date = document.getElementById('bfDate'), dur = document.getElementById('bfDuration'),
        slot = document.getElementById('bfSlot'), name = document.getElementById('bfName'),
        price = document.getElementById('bfPrice'), note = document.getElementById('bfNote');
  name.value = currentUser().name;
  date.min = date.value = isoDate(0);
  [...new Set(FACILITIES.map(f => f.sport))].forEach(s => sport.add(new Option(s, s)));
  for (let h = 1; h <= MAX_HOURS; h++) dur.add(new Option(h + (h === 1 ? ' hour' : ' hours'), h));

  // Facility list depends on the chosen sport (maintenance courts are hidden)
  function fillFacilities(selected) {
    fac.innerHTML = '<option value="">Choose a court</option>';
    FACILITIES.filter(f => f.sport === sport.value && f.status === 'Available').forEach(f => fac.add(new Option(f.name, f.id)));
    if (selected) fac.value = selected;
    fillSlots();
  }
  // Start times: only those where the WHOLE booking fits before closing; any overlap with another booking is disabled
  function fillSlots() {
    const prev = slot.value, hours = +dur.value || 1;
    slot.innerHTML = '<option value="">Choose a start time</option>';
    if (fac.value && date.value) {
      const f = facById(fac.value); let open = 0;
      SLOT_HOURS.filter(h => h + hours <= CLOSE_HOUR).forEach(h => {
        const taken = isTaken(fac.value, date.value, h, hours);
        const o = new Option(`${rangeLabel(h, hours)}  (${rm(rangePrice(f, h, hours))}${h + hours > PEAK_FROM ? ', incl. peak' : ''})${taken ? ' - unavailable' : ''}`, h);
        o.disabled = taken; slot.add(o); if (!taken) open++;
      });
      if (!open) slot.options[0].text = 'No start time fits this length. Try fewer hours or another date';
      if (prev && slot.querySelector(`option[value="${prev}"]:not(:disabled)`)) slot.value = prev;   // keep the choice if still valid
    }
    showPrice();
  }
  function showPrice() {
    const ok = fac.value && slot.value;
    price.textContent = ok ? rm(rangePrice(facById(fac.value), +slot.value, +dur.value)) : 'RM 0.00';
    note.textContent = ok ? `${rangeLabel(+slot.value, +dur.value)} (${dur.value} hr${+dur.value > 1 ? 's' : ''})` : '';
  }
  sport.addEventListener('change', () => fillFacilities());
  [fac, date, dur].forEach(el => el.addEventListener('change', fillSlots));
  slot.addEventListener('change', showPrice);

  // Preselect a court when arriving from the Facilities page (?facility=BD1)
  const pre = facById(new URLSearchParams(location.search).get('facility'));
  if (pre) { sport.value = pre.sport; fillFacilities(pre.id); }

  form.addEventListener('submit', e => {
    e.preventDefault();
    form.classList.add('was-validated');
    if (!form.checkValidity()) return;
    // Re-check right before saving in case the time was taken meanwhile
    if (isTaken(fac.value, date.value, +slot.value, +dur.value)) {
      alertBox.textContent = 'That time has just been booked. Pick another start time.'; alertBox.classList.remove('d-none'); fillSlots(); return;
    }
    const id = 'BK' + String(getBookings().length + 1).padStart(3, '0');
    const saved = JSON.parse(localStorage.getItem('sc_new_bookings') || '[]');
    saved.push(makeBooking(id, name.value.trim(), fac.value, date.value, +slot.value, 'Pending', +dur.value));
    localStorage.setItem('sc_new_bookings', JSON.stringify(saved));
    location.href = 'bookings.html?new=' + id;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const init = {dashboard: initDashboard, bookings: initBookings, facilities: initFacilities, members: initMembers, newbooking: initForm}[document.body.dataset.page];
  if (init) init();
});
