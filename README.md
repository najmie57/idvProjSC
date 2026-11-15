# SportsHub - Sports Complex Booking System

A responsive, front-end-only web application for booking **Badminton**, **Futsal** and **Pickle Ball** courts.
Built as a static site (HTML, CSS, JavaScript), so it runs on GitHub Pages with no backend or database.

- **Live site:** _add your GitHub Pages link here_
- **Repository:** _add your GitHub repository link here_

## Features

| Requirement | What was built |
|---|---|
| Authentication | Diagonal split-screen Login and Register page (stacks vertically on mobile) with hardcoded demo accounts, clear error messages, and a login guard on every page |
| Navigation | Responsive Bootstrap navbar. On desktop it starts collapsed with only the trophy button; clicking it slides the page links out to the right (keyboard accessible). On mobile it uses the normal hamburger menu. Logout and the theme toggle stay visible |
| Dashboard | 4 summary cards, 2 charts, and an upcoming-bookings table |
| Data views (3) | Bookings table (search + sport/status filters), Facilities card grid (sport filter), Members table (search) |
| Data visualisation (2) | Doughnut chart of bookings per sport and a stacked bar chart of daily bookings for the last 7 days, both built from the sample data |
| Extra page | New Booking form with validation, a 1 to 4 hour length option, live price (peak rate after 18:00 is added per hour) and double-booking prevention for the whole time range |
| Dark mode | Light theme by default, toggle button in the navbar and on the login page (choice is remembered) |

Content organisation: every page has a unique `<title>`, meta description, one `<h1>`, semantic sections (`header`, `main`, `section`) and consistent headings.

## How to test the login

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | Admin |
| `user` | `user123` | Member |

- Wrong credentials show an error message.
- You can also create an account on the **Register** tab (saved in your browser's localStorage only).
- Newly registered accounts also appear on the Members page (Basic plan, joined today).
- Bookings made on the New Booking form are saved in localStorage and appear on the Bookings page.
- The desktop navbar starts collapsed after each login, then stays expanded or collapsed as you left it until you log out.

## Frameworks and libraries

- Bootstrap **5.3.3** (CDN, pinned version)
- Bootstrap Icons **1.11.3** (CDN)
- Chart.js **4.4.1** (CDN)
- Google Font: Plus Jakarta Sans

## Project structure

```
sports-complex/
├── index.html          Login / Register
├── dashboard.html      Summary cards + charts
├── bookings.html       Bookings table
├── facilities.html     Courts grid
├── members.html        Members table
├── booking-form.html   New booking form
├── css/style.css       Theme and custom styles
└── js/
    ├── data.js         Sample datasets
    ├── auth.js         Simulated login/register
    ├── main.js         Navbar, theme toggle, login guard
    ├── pages.js        Table, grid and form logic
    └── charts.js       Chart.js charts
```

## Run locally (Laragon)

Copy the folder to `C:\laragon\www\idv web SC\sports-complex` and open `http://localhost/idv%20web%20SC/sports-complex/`.
No PHP or MySQL is used. Opening with VS Code Live Server works too.

## Deploy to GitHub Pages

1. Push the project to a GitHub repository (files at the repository root).
2. Go to **Settings > Pages**, set the source to the `main` branch and the `/ (root)` folder, then save.
3. Open the link GitHub shows after a minute or two.
