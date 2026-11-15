/* data.js - sample datasets (no backend needed). Dates are generated
   relative to today so the dashboard always looks current. */

// ---- Facilities: price = RM per hour (off-peak) ----
const FACILITIES = [
  {id:'BD1', name:'Badminton Court 1', sport:'Badminton',   price:20, capacity:4,  type:'Indoor',  status:'Available'},
  {id:'BD2', name:'Badminton Court 2', sport:'Badminton',   price:20, capacity:4,  type:'Indoor',  status:'Available'},
  {id:'BD3', name:'Badminton Court 3', sport:'Badminton',   price:20, capacity:4,  type:'Indoor',  status:'Available'},
  {id:'BD4', name:'Badminton Court 4', sport:'Badminton',   price:20, capacity:4,  type:'Indoor',  status:'Maintenance'},
  {id:'FS1', name:'Futsal Court A',    sport:'Futsal',      price:80, capacity:10, type:'Indoor',  status:'Available'},
  {id:'FS2', name:'Futsal Court B',    sport:'Futsal',      price:80, capacity:10, type:'Indoor',  status:'Available'},
  {id:'PB1', name:'Pickle Ball Court 1', sport:'Pickle Ball', price:30, capacity:4, type:'Outdoor', status:'Available'},
  {id:'PB2', name:'Pickle Ball Court 2', sport:'Pickle Ball', price:30, capacity:4, type:'Outdoor', status:'Available'},
  {id:'PB3', name:'Pickle Ball Court 3', sport:'Pickle Ball', price:30, capacity:4, type:'Outdoor', status:'Available'}
];

// ---- Time slots: hourly, 08:00 - 22:00. Peak pricing from 18:00 ----
const SLOT_HOURS = [8,9,10,11,12,13,14,15,16,17,18,19,20,21];
const PEAK_FROM = 18, PEAK_RATE = 1.25;
const CLOSE_HOUR = 22;   // the complex closes at 22:00, so a booking must end by then
const MAX_HOURS = 4;     // longest single booking
const pad = n => String(n).padStart(2, '0');
const slotLabel = h => `${pad(h)}:00 - ${pad(h + 1)}:00`;
const slotPrice = (f, h) => Math.round(f.price * (h >= PEAK_FROM ? PEAK_RATE : 1) * 100) / 100;
const facById = id => FACILITIES.find(f => f.id === id);
// Booking length helpers: price adds up hour by hour, so peak hours inside a booking are charged at the peak rate
const rangeLabel = (start, hours) => `${pad(start)}:00 - ${pad(start + hours)}:00`;
const rangePrice = (f, start, hours) => { let t = 0; for (let h = start; h < start + hours; h++) t += slotPrice(f, h); return Math.round(t * 100) / 100; };

// Returns YYYY-MM-DD for today + offset days
function isoDate(offset) {
  const d = new Date(); d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// ---- Members ----
const MEMBERS = [
  {id:'M001', name:'Aiman Hakim',    email:'aiman@example.com',  phone:'012-345 6781', plan:'Premium', joined:'2024-02-11', status:'Active'},
  {id:'M002', name:'Sara Lim',       email:'sara@example.com',   phone:'013-221 4402', plan:'Basic',   joined:'2024-03-05', status:'Active'},
  {id:'M003', name:'Daniel Tan',     email:'daniel@example.com', phone:'016-778 9023', plan:'Premium', joined:'2024-04-19', status:'Active'},
  {id:'M004', name:'Nurul Izzah',    email:'nurul@example.com',  phone:'017-334 1180', plan:'Student', joined:'2024-06-02', status:'Active'},
  {id:'M005', name:'Kumar Raj',      email:'kumar@example.com',  phone:'019-882 3341', plan:'Basic',   joined:'2024-07-23', status:'Active'},
  {id:'M006', name:'Mei Ling',       email:'meiling@example.com',phone:'011-2345 6677',plan:'Student', joined:'2024-08-14', status:'Active'},
  {id:'M007', name:'Farid Hassan',   email:'farid@example.com',  phone:'014-556 7812', plan:'Premium', joined:'2024-09-01', status:'Active'},
  {id:'M008', name:'Aisyah Rahman',  email:'aisyah@example.com', phone:'018-900 2231', plan:'Basic',   joined:'2024-10-12', status:'Inactive'},
  {id:'M009', name:'Jason Wong',     email:'jason@example.com',  phone:'012-778 4509', plan:'Basic',   joined:'2025-01-08', status:'Active'},
  {id:'M010', name:'Priya Nair',     email:'priya@example.com',  phone:'016-120 8844', plan:'Student', joined:'2025-02-27', status:'Active'}
];

// Seed members + every account created on the Register tab (stored in localStorage by auth.js)
function getMembers() {
  let users = [];
  try { users = JSON.parse(localStorage.getItem('sc_users') || '[]'); } catch (e) {}
  return MEMBERS.concat(users.map((u, i) => ({
    id: 'M' + String(MEMBERS.length + i + 1).padStart(3, '0'), name: u.name, username: u.username,
    email: '', phone: '', plan: 'Basic', joined: u.joined || isoDate(0), status: 'Active'
  })));
}

// ---- Seed bookings: [customer, facilityId, dayOffset, startHour, status, hours (optional, default 1)] ----
const SEED = [
  ['Aiman Hakim','BD1',-6,20,'Completed'],['Sara Lim','FS1',-6,21,'Completed'],
  ['Daniel Tan','PB1',-5,19,'Completed',2],['Nurul Izzah','BD2',-5,20,'Completed'],
  ['Kumar Raj','FS2',-4,20,'Completed',2],['Mei Ling','BD1',-4,19,'Completed',2],
  ['Farid Hassan','FS1',-3,21,'Completed'],['Aisyah Rahman','PB2',-3,18,'Cancelled'],
  ['Jason Wong','BD3',-3,20,'Completed'],['Priya Nair','PB1',-2,19,'Completed'],
  ['Aiman Hakim','BD2',-2,20,'Completed'],['Daniel Tan','FS1',-2,20,'Completed',2],
  ['Sara Lim','BD1',-1,19,'Completed'],['Kumar Raj','FS2',-1,21,'Completed'],
  ['Mei Ling','PB3',-1,17,'Completed'],['Farid Hassan','FS1',0,20,'Confirmed',2],
  ['Nurul Izzah','BD3',0,19,'Confirmed'],['Jason Wong','PB2',0,18,'Pending'],
  ['Aisyah Rahman','BD1',0,20,'Confirmed'],['Priya Nair','FS2',1,20,'Pending'],
  ['Aiman Hakim','BD3',1,19,'Confirmed',2],['Daniel Tan','PB1',2,18,'Confirmed',2]
];

// Builds one booking object from its parts (hours = booking length, default 1)
function makeBooking(id, customer, fid, date, hour, status, hours = 1) {
  const f = facById(fid);
  return {id, customer, facilityId: fid, facilityName: f.name, sport: f.sport, date, hour, hours,
          time: rangeLabel(hour, hours), amount: rangePrice(f, hour, hours), status};
}

// Seed bookings + any bookings created through the New Booking form (localStorage)
function getBookings() {
  const base = SEED.map((s, i) => makeBooking('BK' + String(i + 1).padStart(3, '0'), s[0], s[1], isoDate(s[2]), s[3], s[4], s[5] || 1));
  let extra = [];
  try { extra = JSON.parse(localStorage.getItem('sc_new_bookings') || '[]'); } catch (e) {}
  return base.concat(extra.map(b => Object.assign({hours: 1}, b)));   // older saved bookings have no 'hours' -> 1
}

// True if ANY hour of the requested range overlaps an existing booking (cancelled bookings free the slot)
const isTaken = (fid, date, hour, hours = 1) =>
  getBookings().some(b => b.facilityId === fid && b.date === date && b.status !== 'Cancelled' &&
                          hour < b.hour + b.hours && b.hour < hour + hours);
