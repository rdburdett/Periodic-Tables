# Restaurant Reservation System Backend

See main project info [here](../README.md).

# API
## Reservations Route

The reservations route allows for create, read, update, and delete functionality as well as the ability to search by mobile_number and by date.

All existing `/reservations` endpoints and their CRUD functionality:

| Request | Route | Description |
| ------- | ----- | ----------- |
| GET | `/reservations` | List all reservations 
| POST | `/reservations` | Create new reservation
| GET | `/reservations/search` | Search for an existing reservation by mobile or date
| GET | `/reservations/:reservationId` | Get a reservation by ID
| PUT | `/reservations/:reservationId` | Modify an existing reservation
| DELETE | `/reservations/:reservationId` | Delete a reservation
| PUT | `/reservations/:reservationId/status` | Modify the status of an existing reservation

## Tables Route

The tables route allows for create, read, update, delete functionality as well as the ability to 'seat' and 'unseat' a reservation from a table.

All existing `/tables` endpoints and their CRUD functionality:

| Request | Route | Description |
| ------- | ----- | ----------- |
| GET | `/tables` | List all tables
| POST | `/tables` | Create a new table
| GET | `/tables/:tableId` | Get a table by ID
| PUT | `/tables/:tableId` | Modify an existing table
| DELETE | `/tables/:tableId` | Delete a table
| PUT | `/tables/:tableId/seat` | Seat a reservation at a table
| DELETE | `/tables/:tableId/seat` | Unseat a reservation from a table
