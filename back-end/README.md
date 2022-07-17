# Capstone: Restaurant Reservation System Backend

See [../README.md](../README.md) for detailed instructions.

# Routes

<!-- Reservations -->
GET `/reservations` 
POST `/reservations` 
GET `/reservations/search` 
GET `/reservations/:reservationId`
PUT `/reservations/:reservationId`
DELETE `/reservations/:reservationId`
PUT `/reservations/:reservationId/status`

<!-- Tables -->
POST `/tables`
GET `/tables`
GET `/tables/:tableId`
PUT `/tables/:tableId`
DELETE `/tables/:tableId`
PUT `/tables/:tableId/seat`
DELETE `/tables/:tableId/seat`

## Reservations
All existing '/reservations' endpoints and their CRUD functionality and subfunction names.

<!-- List all reservations -->
GET `/reservations` 
[list]

<!-- Create a new reservation -->
POST `/reservations` 
[dataValidation] 
[create]

<!-- Search for reservation by either date or phone number -->
<!-- NOTE: GET requests to /reservations require a query parameter of 'date' or 'mobile_number' -->
GET `/reservations/search` 
[search]

<!-- Get a specific reservation by id -->
GET `/reservations/:reservationId`
[reservationExists]
[read]

<!-- Modify an existing reservation by id -->
PUT `/reservations/:reservationId`
[dataValidation]
[reservationExists]
[update] 

<!-- Delete a reservation by id -->
DELETE `/reservations/:reservationId`
[reservationExists]
[destroy]

<!-- Update a reservation status by id -->
PUT `/reservations/:reservationId/status`
[validateStatus]
[reservationExists]
[statusUpdate]

## Tables
All existing '/tables' endpoints and their CRUD functionality.

<!-- Create a new table -->
POST `/tables`
[tablesDataValidation]
[create]

<!-- List all tables -->
GET `/tables`
[list]

<!-- Find a specific table by id -->
GET `/tables/:tableId`
[tableExists]
[read]

<!-- Update a table by id -->
PUT `/tables/:tableId`
[seatsDataValidation]
[tableExists]
[update]

<!-- Delete a table by id -->
DELETE `/tables/:tableId`
[tablesDataValidation]
[tableExists]
[destroy]

<!-- Seat a reservation at a table -->
PUT `/tables/:tableId/seat`
[seatsDataValidation]
[reservationExists]
[tableExists]
[hasCapacity]
[seat]

<!-- Unseat a reservation from a table -->
DELETE `/tables/:tableId/seat`
[tableExists]
[isOccupied]
[unseat]

