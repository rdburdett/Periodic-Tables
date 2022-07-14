const tablesService = require("./tables.service.js");
const reservationsService = require("../reservations/reservations.service.js");
const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");

////////////////////////////
//      ROUTE LOGGER      //
////////////////////////////

let tasks = []
const log = true

function logTasks() {
  log && console.log(tasks.join("\n"))
  tasks = []
  // return next()
}
////////////////////////////

function logCreate(req, res, next) {
  tasks = []
  console.log("POST /\n", req.params, "\n", req.body)
  next()
}
function logList(req, res, next) {
  tasks = []
  console.log("GET /\n", req.params, "\n", req.body)
  next()
}
function logRead(req, res, next) {
  tasks = []
  console.log("GET /:tableId\n", req.params, "\n", req.body)
  next()
}
function logUpdate(req, res, next) {
  tasks = []
  console.log("PUT /:tableId\n", req.params, "\n", req.body)
  next()
}
function logDestroy(req, res, next) {
  tasks = []
  console.log("DELETE /:tableId\n", req.params, "\n", req.body)
  next()
}
function logSeat(req, res, next) {
  tasks = []
  console.log("PUT /:tableId/seat\n", req.params, "\n", req.body)
  next()
}
function logUnseat(req, res, next) {
  tasks = []
  console.log("DELETE /:tableId/seat\n", req.params, "\n", req.body)
  next()
}

////////////////////////////
//   VALIDATION HELPERS   //
////////////////////////////

// DONE
function validateTableName(req, res, next, data) {
  console.log("\nvalidTableName()")
  const tableName = data.table_name;

  // Validate table_name
  if (!tableName) {
    console.log("400 Request must include a table_name field.")
    return next({
      status: 400,
      message: "Request must include a table_name field.",
    });
  }

  if (tableName.length <= 1) {
    console.log("400 Request table_name must be longer than one character.")
    return next({
      status: 400,
      message: "Request 'table_name' must be longer than one character.",
    });
  }

  console.log("'table_name' is valid", tableName,)
  logTasks()
}

// DONE
function validateCapacity(req, res, next, data) {
  console.log("\nvalidateCapacity()")
  const capacity = data.capacity;
  // Validate capacity
  if (!capacity || capacity.length <= 0) {
    console.log("400 Request must include a capacity field.")
    return next({
      status: 400,
      message: "Request must include a capacity field.",
    });
  }

  if (typeof capacity !== "number") {
    console.log("400 Request 'capacity' must be a number.")
    return next({
      status: 400,
      message: "Request 'capacity' must be a number.",
    });
  }
  console.log("'capacity' is valid: ", capacity)
}

// DONE
function validateReservationId(req, res, next, data) {
  console.log("\nvalidateReservationId()")
  const reservationId = data.reservation_id;
  if (!reservationId || reservationId.length === 0) {
    console.log("400 Request must contain 'reservation_id'.")
    return next({
      status: 400,
      message: "Request must contain 'reservation_id'.",
    });
  }
  console.log("Reservation ID is valid: ", reservationId)
  return next();
}

////////////////////////////
//  VALIDATE REQUEST DATA //
////////////////////////////

// VALIDATE TALBES DATA
// DONE
function tablesDataValidation(req, res, next) {
  console.log("\ntablesDataValidation()")
  const { data } = req.body;
  if (!data) {
    console.log("400 Please fill in required fields.")
    return next({
      status: 400,
      message: "Please fill in required fields.",
    });
  }

  // VALIDATION HELPERS
  validateTableName(req, res, next, data);
  validateCapacity(req, res, next, data);

  console.log("All tables data is valid.")
  return next();
}

// VALIDATE SEATS DATA
//
function seatsDataValidation(req, res, next) {
  console.log("\nseatsDataValidation()")
  const { data } = req.body;
  if (!data) {
    console.log("400 Please fill in required fields.")
    return next({
      status: 400,
      message: "Please fill in required fields.",
    });
  }

  // VALIDATION HELPERS
  validateReservationId(req, res, next, data);

  console.log("Seats data is valid.\n")
  return next();
}

// RESERVATION EXISTS
// DONE
async function reservationExists(req, res, next) {
  console.log("\nreservationExists()")
  const reservationId = req.body.data.reservation_id;
  if (!reservationId) {
    console.log("404 Please enter a reservation_id.")
    return next({
      status: 404,
      message: `Please enter a reservation_id.`,
    });
  }

  const reservation = await reservationsService.read(reservationId);

  if (!reservation) {
    console.log(`404 Reservation ID ${reservationId} cannot be found.`)
    return next({
      status: 404,
      message: `Reservation ID ${reservationId} cannot be found.`
    });
  } else {
    res.locals.reservation = reservation
    console.log("res.locals.reservation assigned: ", res.locals.reservation)
  };
  console.log("Reservation exists")
  return next()
}

// TABLE EXISTS
// DONE
async function tableExists(req, res, next) {
  console.log("\ntableExists()")
  const { tableId } = req.params;
  const table = await tablesService.read(tableId);

  if (!table) {
    console.log(`404 Table ${tableId} cannot be found.`)
    return next({
      status: 404,
      message: `Table ${tableId} cannot be found.`,
    });
  } else {
    res.locals.table = table;
    console.log("res.locals.table assigned", res.locals.table)
  } 
  return next()
}

async function hasCapacity(req, res, next) {
  console.log("\nhasCapacity()")
  const { data: { reservation_id} } = req.body;
  const { tableId } = req.params
  const reservation = await reservationsService.read(reservation_id)
  const table = await tablesService.read(tableId)

  if (reservation.people > table.capacity) {
    console.log("400 Table capacity not large enough.")
    return next({
      status: 400,
      message: `Table capacity not large enough.`,
    });
  }
}

async function isAvailable(req, res, next) {
  const { tableId } = req.params
  const table = await tablesService.read(tableId)

  if (table.status !== "Available") {
    console.log("400 Table occupied.")
    return next({
      status: 400,
      message: "Table occupied."
    })
  }
  return next()
}

// CREATE NEW TABLE
// DONE
async function create(req, res, next) {
  console.log("create()")
  res.status(201).json({
    data: await tablesService.create(req.body.data),
  });
}

// LIST ALL TABLES
async function list(req, res, next) {
  console.log("list()")
  res.json({ data: await tablesService.list() });
}

// GET SPECIFIC TABLE
async function read(req, res, next) {
  res.json({ data: res.locals.table });
}

// UPDATE EXISTING TABLE
// working on
async function update(req, res, next) {
  console.log("update()")
  const { tableId } = req.params;
  const table = await tablesService.read(tableId);
  // console.log("update table: ", table)

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
  console.log("seat()")
  const reservationId = req.body.data.reservation_id;
  const reservation = await reservationsService.read(reservationId);

  // check if table is available
  const { tableId } = req.params;
  const table = await tablesService.read(tableId);

  if (table.status !== "Available") {
    console.log("400 Table occupied.")
    logTasks()
    return next({
      status: 400,
      message: "Table occupied."
    })
  }

  // check capacity
  if (reservation.people > table.capacity) {
    console.log("400 Table capacity not large enough.")
    return next({
      status: 400,
      message: "Table capacity not large enough."
    });
  }

  ////////

  const updatedTable = {
    ...table,
    reservation_id: reservationId,
    status: "Seated"
  };
  console.log("Updated table: ", updatedTable)

  res
    .status(200)
    .json({
      data: await tablesService.update(updatedTable)
    })
}

// UNSEAT RESERVATION
async function unseat(req, res, next) {
  const reservationId = req.body.data.reservation_id;
  const reservation = await reservationsService.read(reservationId);

  // const { table } = res.locals;
  const { tableId } = req.params;
  const table = await tablesService.read(tableId);

  console.log("unseat()")
  const validStatus = ["Occupied", "Seated"]

  if (!validStatus.includes(table.status)) {
    console.log("400 Table not occupied")
    return next({
      status: 400,
      message: `Table not occupied.`,
    });
  }

  
  await reservationsService.update(updatedReservation)
  const updatedReservation = {
    ...table,
    status: "Available"
  }
  console.log("Updated reservation: ", updatedReservation)

  const updatedTable = {
    ...reservation,
    status: "Finished"
  }
  console.log("Updated table: ", updatedTable)
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
  logTasks()
  res.sendStatus(204);
}

module.exports = {
  // POST "/"
  create: [
    logCreate,
    asyncErrorBoundary(tablesDataValidation),
    asyncErrorBoundary(create),
    // logTasks
  ],
  // GET "/"
  list: [
    logList,
    asyncErrorBoundary(list),
    // logTasks
  ],
  // GET /:tableId
  read: [
    logRead,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(read),
    // logTasks
  ],
  // PUT /:tableId
  update: [
    logUpdate,
    asyncErrorBoundary(seatsDataValidation),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(update),
    // logTasks
  ],
  // DELETE /:tableId
  destroy: [
    logDestroy,
    asyncErrorBoundary(tablesDataValidation),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(destroy),
    // logTasks
  ],
  // PUT /:tableId/seat
  seat: [
    logSeat,
    asyncErrorBoundary(seatsDataValidation),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(hasCapacity),
    asyncErrorBoundary(seat),
    // logTasks
  ],
  // DELETE /:tableId/seat
  unseat: [
    logUnseat,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(unseat),
    // logTasks
  ],
};
