# SportsHub Sports Complex Booking System

SportsHub is a responsive, front-end-only sports complex booking application for:

- Badminton
- Futsal
- Pickle Ball

The project is built with HTML, CSS and vanilla JavaScript. It does not require PHP, MySQL, Node.js or a backend server. Demo data and changes made in the browser are stored in `localStorage` and `sessionStorage`.

## Features

- Login and registration with client-side validation
- Protected application pages with logout support
- Responsive navigation with desktop menu toggle and mobile hamburger menu
- Light and dark themes, remembered in the browser
- Dashboard summary cards and Chart.js visualisations
- Bookings table with search, sport and status filters
- Facilities grid with sport filters and court availability
- Members table with search
- New booking form with:
  - 1 to 4 hour booking durations
  - Availability checking for the complete booking range
  - Double-booking prevention
  - Peak pricing from 18:00
  - Closing time of 22:00
- Responsive layout for desktop, tablet and mobile screens

## Demo accounts

Use either account on the login page:

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | Admin |
| `user` | `user123` | Member |

You can also use the **Register** tab to create an account. New accounts and bookings are saved only in the current browser's storage and are not shared with other users or browsers.

## Run locally with Laragon

This repository is already laid out as a Laragon web-root project:

```text
C:\laragon\www\idvProjSC
```

1. Make sure the project folder is located at `C:\laragon\www\idvProjSC`.
2. Start **Apache** in Laragon. No MySQL service is needed.
3. Open the following URL in a browser:

   [http://localhost/idvProjSC/](http://localhost/idvProjSC/)

4. The login page is `index.html`. After logging in, use the navigation links to open the dashboard, bookings, facilities, members and new booking pages.

If you place the project in a different folder directly under `C:\laragon\www`, replace `idvProjSC` in the URL with that folder's name. Do not add a second `sports-complex` directory; the HTML files are at the repository root.

## Run with VS Code Live Server

Because this is a static site, it can also be opened with the **Live Server** extension:

1. Open `C:\laragon\www\idvProjSC` in VS Code.
2. Right-click [index.html](index.html) and choose **Open with Live Server**.
3. Use the local URL shown by VS Code, usually similar to `http://127.0.0.1:5500/index.html`.

Opening [index.html](index.html) directly with `file://` may work for some features, but a local web server is recommended for consistent browser behaviour.

## Project structure

```text
idvProjSC/
├── index.html              Login and registration
├── dashboard.html          Summary cards, charts and upcoming bookings
├── bookings.html           Bookings table and filters
├── facilities.html         Sports complex court grid
├── members.html            Members table and search
├── booking-form.html       New booking form
├── css/
│   └── style.css           Theme and responsive styles
├── images/
│   ├── bad1.png            Badminton image
│   ├── fut1.png            Futsal image
│   └── pick1.jpg           Pickle Ball image
└── js/
    ├── data.js             Facilities, members and booking data
    ├── auth.js             Login and registration logic
    ├── main.js             Theme, navigation and login guard
    ├── pages.js            Page rendering and booking form logic
    └── charts.js            Chart.js dashboard charts
```

## External libraries

The pages load these pinned libraries from jsDelivr, so an internet connection is needed when first loading the site:

- Bootstrap 5.3.3
- Bootstrap Icons 1.11.3
- Chart.js 4.4.1
- Google Font: Plus Jakarta Sans

## Reset browser data

To clear accounts, bookings and theme preferences created during testing, clear site data for the local URL in the browser's developer tools. The application uses these storage keys:

- `sc_users` - registered accounts
- `sc_new_bookings` - bookings created through the form
- `sc_theme` - saved theme
- `sc_user` and `sc_nav_open` - current login session and navigation state

## Deploy to GitHub Pages

The project can be hosted as a static GitHub Pages site:

1. Push the repository contents, including the HTML files, `css`, `images` and `js` folders, to the repository root.
2. In GitHub, open **Settings > Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the `main` branch and the `/ (root)` folder, then save.
5. Open the published URL shown by GitHub Pages.

The application still remains front-end-only after deployment. Each visitor has their own browser-local accounts and bookings; there is no shared database.

## Repository

[github.com/najmie57/idvProjSC](https://github.com/najmie57/idvProjSC)
