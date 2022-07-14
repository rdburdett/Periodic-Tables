const tablesService = require("./tables.service.js");
const reservationsService = require("../reservations/reservations.service.js");
const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");

////////////////////////////
//      ROUTE LOGGER      //
////////////////////////////

const log = true

////////////////////////////

function logCreate(req, res, next) {
  log && console.log("POST /\n", req.params, "\n", req.body)
  next()
}
function logList(req, res, next) {
  log && console.log("GET /\n", req.params, "\n", req.body)
  next()
}
function logRead(req, res, next) {
  log && console.log("GET /:tableId\n", req.params, "\n", req.body)
  next()
}
function logUpdate(req, res, next) {
  log && console.log("PUT /:tableId\n", req.params, "\n", req.body)
  next()
}
function logDestroy(req, res, next) {
  log && console.log("DELETE /:tableId\n", req.params, "\n", req.body)
  next()
}
function logSeat(req, res, next) {
  log && console.log("PUT /:tableId/seat\n", req.params, "\n", req.body)
  next()
}
function logUnseat(req, res, next) {
  log && console.log("DELETE /:tableId/seat\n", req.params, "\n", req.body)
  next()
}

////////////////////////////
//   VALIDATION HELPERS   //
////////////////////////////

// DONE
function validateTableName(req, res, next, data) {
  log && console.log("\nvalidTableName()")
  const tableName = data.table_name;

  // Validate table_name
  if (!tableName) {
    log && console.log("400 Request must include a table_name field.")
    return next({
      status: 400,
      message: "Request must include a table_name field.",
    });
  }

  if (tableName.length <= 1) {
    log && console.log("400 Request table_name must be longer than one character.")
    return next({
      status: 400,
      message: "Request 'table_name' must be longer than one character.",
    });
  }

  log && console.log("'table_name' is valid", tableName,)
}

// DONE
function validateCapacity(req, res, next, data) {
  log && console.log("\nvalidateCapacity()")
  const capacity = data.capacity;
  // Validate capacity
  if (!capacity || capacity.length <= 0) {
    log && console.log("400 Request must include a capacity field.")
    return next({
      status: 400,
      message: "Request must include a capacity field.",
    });
  }

  if (typeof capacity !== "number") {
    log && console.log("400 Request 'capacity' must be a number.")
    return next({
      status: 400,
      message: "Request 'capacity' must be a number.",
    });
  }
  log && console.log("'capacity' is valid: ", capacity)
}

// DONE
function validateReservationId(req, res, next, data) {
  log && console.log("\nvalidateReservationId()")
  const reservationId = data.reservation_id;
  if (!reservationId || reservationId.length === 0) {
    log && console.log("400 Request must contain 'reservation_id'.")
    return next({
      status: 400,
      message: "Request must contain 'reservation_id'.",
    });
  }
  log && console.log("Reservation ID is valid: ", reservationId)
  return next();
}

////////////////////////////
//  VALIDATE REQUEST DATA //
////////////////////////////

// VALIDATE TALBES DATA
// DONE
function tablesDataValidation(req, res, next) {
  log && console.log("\ntablesDataValidation()")
  const { data } = req.body;
  if (!data) {
    log && console.log("400 Please fill in required fields.")
    return next({
      status: 400,
      message: "Please fill in required fields.",
    });
  }

  // VALIDATION HELPERS
  validateTableName(req, res, next, data);
  validateCapacity(req, res, next, data);

  log && console.log("All tables data is valid.")
  return next();
}

// VALIDATE SEATS DATA
//
function seatsDataValidation(req, res, next) {
  log && console.log("\nseatsDataValidation()")
  const { data } = req.body;
  if (!data) {
    log && console.log("400 Please fill in required fields.")
    return next({
      status: 400,
      message: "Please fill in required fields.",
    });
  }

  // VALIDATION HELPERS
  validateReservationId(req, res, next, data);

  log && console.log("Seats data is valid.\n")
  return next();
}

// RESERVATION EXISTS
// DONE
async function reservationExists(req, res, next) {
  log && console.log("\nreservationExists()")
  const reservationId = req.body.data.reservation_id;
  if (!reservationId) {
    log && console.log("404 Please enter a reservation_id.")
    return next({
      status: 404,
      message: `Please enter a reservation_id.`,
    });
  }

  const reservation = await reservationsService.read(reservationId);

  if (!reservation) {
    log && console.log(`404 Reservation ID ${reservationId} cannot be found.`)
    return next({
      status: 404,
      message: `Reservation ID ${reservationId} cannot be found.`
    });
  } else {
    res.locals.reservation = reservation
    log && console.log("res.locals.reservation assigned: ", res.locals.reservation)
  };
  log && console.log("Reservation exists")
  return next()
}

// TABLE EXISTS
// DONE
async function tableExists(req, res, next) {
  log && console.log("\ntableExists()")
  const { tableId } = req.params;
  const table = await tablesService.read(tableId);

  if (!table) {
    log && console.log(`404 Table ${tableId} cannot be found.`)
    return next({
      status: 404,
      message: `Table ${tableId} cannot be found.`,
    });
  } else {
    res.locals.table = table;
    log && console.log("res.locals.table assigned", res.locals.table)
    return next()
  } 
  // return next()
}

async function hasCapacity(req, res, next) {
  log && console.log("\nhasCapacity()")
  const { data: { reservation_id} } = req.body;
  const { tableId } = req.params
  const reservation = await reservationsService.read(reservation_id)
  const table = await tablesService.read(tableId)

  if (reservation.people > table.capacity) {
    log && console.log("400 Table capacity not large enough.")
    return next({
      status: 400,
      message: `Table capacity not large enough.`,
    });
  }
}

async function isOccupied(req, res, next) {
  log && console.log("isOccupied()")
  const { tableId } = req.params
  const table = await tablesService.read(tableId)

  if (table.status !== "Occupied") {
    log && console.log("400 Table not occupied.")
    return next({
      status: 400,
      message: "Table not occupied."
    })
  }
  return next()
}

// CREATE NEW TABLE
// DONE
async function create(req, res, next) {
  log && console.log("create()")
  res.status(201).json({
    data: await tablesService.create(req.body.data),
  });
}

// LIST ALL TABLES
async function list(req, res, next) {
  log && console.log("list()")
  res.json({ data: await tablesService.list() });
}

// GET SPECIFIC TABLE
async function read(req, res, next) {
  res.json({ data: res.locals.table });
}

// UPDATE EXISTING TABLE
// working on
async function update(req, res, next) {
  log && console.log("update()")
  const { tableId } = req.params;
  const table = await tablesService.read(tableId);
  // log && console.log("update table: ", table)

  const updatedTable = {
    ...req.body.data,
    table_id: table.table_id,
  };

  res.status(200).json({
    data: await tablesService.update(updatedTable),
  });
}

// SEAT RESERVATION
async function seat(req, res, next) {
  log && console.log("seat()")
  const reservationId = req.body.data.reservation_id;
  const reservation = await reservationsService.read(reservationId);

  // check if table is available
  const { tableId } = req.params;
  const table = await tablesService.read(tableId);

  if (table.status !== "Available") {
    log && console.log("400 Table occupied.")
    return next({
      status: 400,
      message: "Table occupied."
    })
  }

  // check capacity
  if (reservation.people > table.capacity) {
    log && console.log("400 Table capacity not large enough.")
    return next({
      status: 400,
      message: "Table capacity not large enough."
    });
  }

  // TODO
  // returns 200 and changes reservation status to 'seated'
  // if (reservation.people > table.capacity) {
  //   log && console.log("400 Table capacity not large enough.")
  //   return next({
  //     status: 400,
  //     message: "Table capacity not large enough."
  //   });
  // }

  // returns 400 if reservation is already seated
  if (reservation.status === "Seated") {
    log && console.log("400 Reservation is already seated.")
    return next({
      status: 400,
      message: "Reservation is already seated."
    });
  }

  ////////

  const updatedTable = {
    ...table,
    reservation_id: reservationId,
    status: "Occupied"
  };
  log && console.log("Updated table: ", updatedTable)
  await tablesService.update(updatedTable)

  ////////

  const updatedReservation = {
    ...reservation,
    status: "Seated"
  };
  log && console.log("Updated reservation: ", updatedReservation)
  await reservationsService.update(updatedReservation)

  ////////
  res.sendStatus(200)
  // ////////
  // res
  //   .status(200)
  //   .json({
  //     data: await tablesService.update(updatedTable)
  //   })
}

// UNSEAT RESERVATION
async function unseat(req, res, next) {
  log && console.log("unseat()")
  const reservationId = req.body.data.reservation_id;
  const reservation = await reservationsService.read(reservationId);

  // const { table } = res.locals;
  const { tableId } = req.params;
  const table = await tablesService.read(tableId);

  const validStatus = ["Occupied", "Seated"]

  if (!validStatus.includes(table.status)) {
    log && console.log("400 Table not occupied")
    return next({
      status: 400,
      message: `Table not occupied.`,
    });
  }

  
  const updatedReservation = {
    ...table,
    status: "Available"
  }
  log && console.log("Updated reservation: ", updatedReservation)
  await reservationsService.update(updatedReservation)

  const updatedTable = {
    ...reservation,
    status: "Finished"
  }
  log && console.log("Updated table: ", updatedTable)
  await tablesService.update(updatedTable)

  res.sendStatus(200)
    // .json({
    //   data: (await tablesService.update(updatedTable)),
    // });
}

// DELETE TABLE
async function destroy(req, res, next) {
  const { table } = res.locals;
  await tablesService.destroy(table.table_id);
  res.sendStatus(204);
}

module.exports = {
  // POST "/"
  create: [
    logCreate,
    asyncErrorBoundary(tablesDataValidation),
    asyncErrorBoundary(create),
  ],
  // GET "/"
  list: [
    logList,
    asyncErrorBoundary(list),
  ],
  // GET /:tableId
  read: [
    logRead,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(read),
  ],
  // PUT /:tableId
  update: [
    logUpdate,
    asyncErrorBoundary(seatsDataValidation),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(update),
  ],
  // DELETE /:tableId
  destroy: [
    logDestroy,
    asyncErrorBoundary(tablesDataValidation),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(destroy),
  ],
  // PUT /:tableId/seat
  seat: [
    logSeat,
    asyncErrorBoundary(seatsDataValidation),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(hasCapacity),
    asyncErrorBoundary(seat),
  ],
  // DELETE /:tableId/seat
  unseat: [
    logUnseat,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(isOccupied),
    asyncErrorBoundary(unseat),
  ],
};
