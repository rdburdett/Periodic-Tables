const tablesService = require("./tables.service.js");
const reservationsService = require("../reservations/reservations.service.js");
const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");
const logger = require("../../logger.js")

////////////////////////////
//       VALIDATION       //
////////////////////////////

// VALIDATE TABLE NAME
function validateTableName(req, res, next, data) {
  const tableName = data.table_name;

  // Validate table_name
  if (!tableName) {
    return next({
      status: 400,
      message: "Request must include a table_name field.",
    });
  }

  if (tableName.length <= 1) {
    return next({
      status: 400,
      message: "Request 'table_name' must be longer than one character.",
    });
  }

  log && console.log("'table_name' is valid", tableName,)
}

// VALIDATE CAPACITY
function validateCapacity(req, res, next, data) {
  const capacity = data.capacity;
  // Validate capacity
  if (!capacity || capacity.length <= 0) {
    return next({
      status: 400,
      message: "Request must include a capacity field.",
    });
  }

  if (typeof capacity !== "number") {
    return next({
      status: 400,
      message: "Request 'capacity' must be a number.",
    });
  }
}

// VALIDATE RESERVATION ID
function validateReservationId(req, res, next, data) {
  const reservationId = data.reservation_id;
  if (!reservationId || reservationId.length === 0) {
    return next({
      status: 400,
      message: "Request must contain 'reservation_id'.",
    });
  }
  return next();
}

// VALIDATE TALBES DATA
function tablesDataValidation(req, res, next) {
  const { data } = req.body;
  if (!data) {
    return next({
      status: 400,
      message: "Please fill in required fields.",
    });
  }

  // VALIDATION HELPERS
  validateTableName(req, res, next, data);
  validateCapacity(req, res, next, data);

  return next();
}

// VALIDATE SEATS DATA
function seatsDataValidation(req, res, next) {
  const { data } = req.body;
  if (!data) {
    return next({
      status: 400,
      message: "Please fill in required fields.",
    });
  }

  // VALIDATION HELPERS
  validateReservationId(req, res, next, data);

  return next();
}

// RESERVATION EXISTS
async function reservationExists(req, res, next) {
  const reservationId = req.body.data.reservation_id;
  if (!reservationId) {
    return next({
      status: 404,
      message: `Please enter a reservation_id.`,
    });
  }

  const reservation = await reservationsService.read(reservationId);

  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation ID ${reservationId} cannot be found.`
    });
  } else {
    res.locals.reservation = reservation;
    return next();
  };
}

// TABLE EXISTS
async function tableExists(req, res, next) {
  const { tableId } = req.params;
  const table = await tablesService.read(tableId);

  if (!table) {
    return next({
      status: 404,
      message: `Table ${tableId} cannot be found.`,
    });
  } else {
    res.locals.table = table;
    return next();
  };
}

// HAS CAPACITY
async function hasCapacity(req, res, next) {
  const { data: { reservation_id} } = req.body;
  const { tableId } = req.params
  const reservation = await reservationsService.read(reservation_id)
  const table = await tablesService.read(tableId)

  if (reservation.people > table.capacity) {
    return next({
      status: 400,
      message: `Table capacity not large enough.`,
    });
  }
}

// IS OCCUPIED
async function isOccupied(req, res, next) {
  const { tableId } = req.params
  const table = await tablesService.read(tableId)

  if (table.status !== "Occupied") {
    return next({
      status: 400,
      message: "Table not occupied."
    })
  }
  return next()
}

//////////////////////
//       CRUD       //
//////////////////////

// LIST ALL TABLES
async function list(req, res, next) {
  const tables = await tablesService.list()
  res.json({ data: tables });
}

// CREATE NEW TABLE
async function create(req, res, next) {
  const response = await tablesService.create({
    ...req.body.data,
    status: "Free",
    reservation_id: null,
  })
  res.status(201).json({
    data: response,
  });
}

// GET SPECIFIC TABLE
async function read(req, res, next) {
  res.json({ data: res.locals.table });
}

// UPDATE EXISTING TABLE
async function update(req, res, next) {
  const { tableId } = req.params;
  const table = await tablesService.read(tableId);

  const updatedTable = {
    ...req.body.data,
    table_id: table.table_id,
  };

  const response = await tablesService.update(updatedTable)
  res.status(200).json({
    data: response[0],
  });
}

// SEAT RESERVATION
async function seat(req, res, next) {
  const reservationId = req.body.data.reservation_id;
  const reservation = await reservationsService.read(reservationId);

  // check if table is Free
  const { tableId } = req.params;
  const table = await tablesService.read(tableId);

  if (table.status !== "Free") {
    return next({
      status: 400,
      message: "Table occupied."
    })
  }

  // check capacity
  if (reservation.people > table.capacity) {
    return next({
      status: 400,
      message: "Table capacity not large enough."
    });
  }

  // returns 400 if reservation is already seated
  if (reservation.status === "seated") {
    return next({
      status: 400,
      message: "Reservation is already seated."
    });
  }

  // update current table to occupied
  const updatedTable = {
    ...table,
    reservation_id: reservationId,
    status: "Occupied"
  };
  await tablesService.update(updatedTable)

  // update current reservation to seated
  const updatedReservation = {
    ...reservation,
    status: "seated"
  };
  await reservationsService.update(updatedReservation)

  // send 200 and updated table
  res
    .status(200)
    .json({
      data: updatedTable
    })
}

// UNSEAT RESERVATION
async function unseat(req, res, next) {
  const { table } = res.locals;
  const reservation = await reservationsService.read(table.reservation_id);

  ////////
  // check to make sure table.status is currently occupied
  if (table.status !== "Occupied") {
    return next({
      status: 400,
      message: `Table not occupied.`,
    });
  }
  
  ////////
  // update current reservation to 'finished'
  const updatedReservation = {
    ...reservation,
    status: "finished"
  }
  await reservationsService.update(updatedReservation)

  ////////
  // update current table to 'Free'
  const updatedTable = {
    ...table,
    reservation_id: null,
    status: "Free"
  }
  await tablesService.update(updatedTable)

  ////////
  // send 200 and updated table
  ////////
  res
    .status(200)
    .json({
      data: updatedTable,
    });
}

// FINISH TABLE
async function finish(req, res) {
  const { table } = res.locals;

  res.status(200).json({ data: await tablesService.finish(table) });
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
    logger.logTableCreate,
    asyncErrorBoundary(tablesDataValidation),
    asyncErrorBoundary(create),
  ],
  // GET "/"
  list: [
    logger.logTableList,
    asyncErrorBoundary(list),
  ],
  // GET /:tableId
  read: [
    logger.logTableRead,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(read),
  ],
  // PUT /:tableId
  update: [
    logger.logTableUpdate,
    asyncErrorBoundary(seatsDataValidation),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(update),
  ],
  // DELETE /:tableId
  destroy: [
    logger.logTableDestroy,
    asyncErrorBoundary(tablesDataValidation),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(destroy),
  ],
  // PUT /:tableId/seat
  seat: [
    logger.logTableSeat,
    asyncErrorBoundary(seatsDataValidation),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(hasCapacity),
    asyncErrorBoundary(seat),
  ],
  // DELETE /:tableId/seat
  unseat: [
    logger.logTableUnseat,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(isOccupied),
    // asyncErrorBoundary(unseat),
    asyncErrorBoundary(finish)
  ],
};
