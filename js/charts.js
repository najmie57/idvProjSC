/* charts.js - Chart.js visualisations (dashboard). Both charts use real data from data.js. */
let sportCharts = [];
const SPORT_COLORS = {'Badminton':'#16a34a', 'Futsal':'#0ea5e9', 'Pickle Ball':'#f59e0b'};

function renderCharts() {
  sportCharts.forEach(c => c.destroy()); sportCharts = [];
  // Match chart text/grid colours to the active light/dark theme
  Chart.defaults.color = getComputedStyle(document.body).color;
  Chart.defaults.borderColor = 'rgba(128,128,128,.2)';
  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";

  const sports = Object.keys(SPORT_COLORS);
  const active = getBookings().filter(b => b.status !== 'Cancelled'); // cancelled bookings are not counted

  // Chart 1: share of bookings per sport (doughnut)
  sportCharts.push(new Chart(document.getElementById('sportChart'), {
    type: 'doughnut',
    data: {labels: sports, datasets: [{data: sports.map(s => active.filter(b => b.sport === s).length),
           backgroundColor: sports.map(s => SPORT_COLORS[s]), borderWidth: 0}]},
    options: {maintainAspectRatio: false, cutout: '62%', plugins: {legend: {position: 'bottom'}}}
  }));

  // Chart 2: bookings per day for the last 7 days, stacked by sport (bar)
  const offsets = [-6,-5,-4,-3,-2,-1,0];
  const labels = offsets.map(o => { const [y,m,d] = isoDate(o).split('-'); return new Date(y, m-1, d).toLocaleDateString('en-GB', {weekday:'short', day:'numeric'}); });
  sportCharts.push(new Chart(document.getElementById('weeklyChart'), {
    type: 'bar',
    data: {labels, datasets: sports.map(s => ({label: s, backgroundColor: SPORT_COLORS[s], borderRadius: 4,
           data: offsets.map(o => active.filter(b => b.sport === s && b.date === isoDate(o)).length)}))},
    options: {maintainAspectRatio: false, plugins: {legend: {position: 'bottom'}},
              scales: {x: {stacked: true, grid: {display: false}}, y: {stacked: true, beginAtZero: true, ticks: {precision: 0}}}}
  }));
}

document.addEventListener('DOMContentLoaded', () => {
  renderCharts();
  window.addEventListener('themechange', renderCharts); // redraw when dark mode is toggled
});
