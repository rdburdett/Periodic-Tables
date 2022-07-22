function logger(req, res, next)  {
  // console.clear()
  console.log("\n",
    "-----------------------------\n",
    "<//////    Request    //////>\n",
    "-----------------------------\n",
    req.method, req.originalUrl, "\n",
    "-----------------------------\n",
    "req.query: \n", req.query, "\n",
    "req.params: \n", req.params, "\n",
    "req.body: \n", req.body, "\n",
  )
  next()
}

///////////////////////////////////
//   RESERVATIONS ROUTE LOGGER   //
///////////////////////////////////

const log = false

////////////////////////////

function logReservationSearch(req, res, next) {
  log && console.log(
    "GET /\n", 
    "req.params: ", req.params, "\n", 
    "req.body: ", req.body
    )
  next()
}
function logReservationCreate(req, res, next) {
  log && console.log(
    "POST /\n", 
    "req.params: ", req.params, "\n", 
    "req.body: ", req.body
    )
  next()
}
function logReservationRead(req, res, next) {
  log && console.log(
    "GET /:reservationId\n", 
    "req.params: ", req.params, "\n", 
    "req.body: ", req.body
    )
  next()
}
function logReservationUpdate(req, res, next) {
  log && console.log(
    "PUT /:reservationId\n", 
    "req.params: ", req.params, "\n", 
    "req.body: ", req.body
    )
  next()
}
function logReservationDestroy(req, res, next) {
  log && console.log(
    "DELETE /:reservationId\n", 
    "req.params: ", req.params, "\n", 
    "req.body: ", req.body
    )
  next()
}
function logReservationStatusUpdate(req, res, next) {
  log && console.log(
    "PUT /:reservationId/status\n", 
    "req.params: ", req.params, "\n", 
    "req.body: ", req.body
    )
  next()
}

/////////////////////////////
//   TABLES ROUTE LOGGER   //
/////////////////////////////

function logTableCreate(req, res, next) {
  log && console.log("POST /\n", req.params, "\n", req.body)
  next()
}
function logTableList(req, res, next) {
  log && console.log("GET /\n", req.params, "\n", req.body)
  next()
}
function logTableRead(req, res, next) {
  log && console.log("GET /:tableId\n", req.params, "\n", req.body)
  next()
}
function logTableUpdate(req, res, next) {
  log && console.log("PUT /:tableId\n", req.params, "\n", req.body)
  next()
}
function logTableDestroy(req, res, next) {
  log && console.log("DELETE /:tableId\n", req.params, "\n", req.body)
  next()
}
function logTableSeat(req, res, next) {
  log && console.log("PUT /:tableId/seat\n", req.params, "\n", req.body)
  next()
}
function logTableUnseat(req, res, next) {
  log && console.log("DELETE /:tableId/seat\n", req.params, "\n", req.body)
  next()
}

module.exports = {
  logger,
  logReservationSearch,
  logReservationCreate,
  logReservationRead,
  logReservationUpdate,
  logReservationDestroy,
  logReservationStatusUpdate,
  logTableCreate,
  logTableList,
  logTableRead,
  logTableUpdate,
  logTableDestroy,
  logTableSeat,
  logTableUnseat
}
