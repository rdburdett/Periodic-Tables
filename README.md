# Periodic Tables: Restaurant Reservation System

Periodic Tables is a web application which can be used by restaurants to track reservations and table seating status. The app allows for creation of new tables, creation and editing of reservations, and the ability to 'seat' and 'unseat' reservations at specific tables.

> ### Deployed app: [Periodic Tables](https://restaurant-reservation-app-kappa.vercel.app/dashboard)

## Design

### Desktop

<img src="./media/screenshots/desktop-dashboard.png" alt="desktop-dashboard" width="48%"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="./media/screenshots/desktop-tables.png" alt="desktop-tables" width="48%"/>

### Tablet

<img src="./media/screenshots/ipad-dashboard.png" alt="ipad-dashboard" width="300"/>

### Mobile

<img src="./media/screenshots/mobile-dashboard.png" alt="mobile-dashboard" width="23%"/>&nbsp;&nbsp;&nbsp;<img src="./media/screenshots/mobile-dashboard-empty.png" alt="mobile-dashboard-empty" width="23%"/>&nbsp;&nbsp;&nbsp;<img src="./media/screenshots/mobile-reservations.png" alt="mobile-reservation" width="23%"/>&nbsp;&nbsp;&nbsp;<img src="./media/screenshots/mobile-tables.png" alt="mobile-tables" width="23%"/>

#### Additional Pages

<img src="./media/screenshots/page-reservation-create.png" alt="page-reservation-create" width="23%"/>&nbsp;&nbsp;&nbsp;<img src="./media/screenshots/page-reservation-edit.png" alt="page-reservation-edit" width="23%"/>&nbsp;&nbsp;&nbsp;<img src="./media/screenshots/page-reservation-search.png" alt="page-reservation-search" width="23%"/>&nbsp;&nbsp;&nbsp;<img src="./media/screenshots/page-table-create.png" alt="page-table-create" width="23%"/>


## API

Visit [API documentation](./back-end//README.md) for detailed instructions.


## Technologies
> *Technologies used in this app*

### Frontend:
- [Javascript](http://knexjs.org/)
- [React](http://knexjs.org/)
- [Bootstrap](http://knexjs.org/)
- [HTML5](http://knexjs.org/)
- [CSS](http://knexjs.org/)

### Backend:
- [Node](http://knexjs.org/)
- [Express](http://knexjs.org/)
- [Knex](http://knexjs.org/)
- [PostgreSQL](http://knexjs.org/)

## Installation

1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URL's to your database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.

