const service = require("./tables.service");
const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");

////////////////////////////
//   VALIDATION HELPERS   //
////////////////////////////

// DONE
function validateTableName(req, res, next, data){
  const reqTableName = data.table_name;
  // Validate table_name
  if (!reqTableName || reqTableName.length <= 1) {
    return next({
      status: 400,
      message: "Request must include a table_name field."
    });
  }
};

// DONE
function validateCapacity(req, res, next, data){
  const reqCapacity = data.capacity;
  // Validate capacity
  if (!reqCapacity || reqCapacity.length <= 0) {
    return next({
      status: 400,
      message: "Request must include a capacity field."
    });
  }

  if (typeof(reqCapacity) !== "number") {
    return next({
      status: 400,
      message: "Request 'capacity' must be a number."
    });
  }
};

// DONE
function validateReservationId(req, res, next, data){
  const reqReservationId = data.reservation_id;
  // Validate reservation_name
  if (!reqReservationId || reqReservationId.length <= 1) {
    return next({
      status: 400,
      message: "Request must contain 'reservation_id'."
    });
  }
};

////////////////////////////
//  VALIDATE REQUEST DATA //
////////////////////////////

// VALIDATE TALBES DATA
// DONE
function tablesDataValidation(req, res, next) {
  const { data } = req.body;
  if(!data){
    return next({
      status: 400,
      message: "Please fill in required fields."
    })
  }
  
  // VALIDATION HELPERS
  validateTableName(req, res, next, data)
  validateCapacity(req, res, next, data)

  next()
}

// VALIDATE SEATS DATA
// 
function seatsDataValidation(req, res, next) {
  const { data } = req.body;
  if(!data){
    return next({
      status: 400,
      message: "Please fill in required fields."
    })
  }
  
  // VALIDATION HELPERS
  validateReservationId(req, res, next, data)
  // validateTableName

  next()
}

// RESERVATION EXISTS
// DONE
async function reservationExists(req, res, next) {
  const reservationId = req.body.data.reservation_id;
  const reservation = await service.read(reservationId);

  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation ID ${reservationId} cannot be found.`
    })
  }

  res.locals.reservation = reservation;
  next();
}

// TABLE EXISTS
// DONE
async function tableExists(req, res, next) {
  const { tableId } = req.params;
  const table = await service.read(tableId);
  console.log(table)

  if (!table) {
    return next({
      status: 404,
      message: `Table ${tableId} cannot be found.`
    })
  }

  res.locals.table = table;
  next();
}

// CREATE NEW TABLE 
// DONE
async function create(req, res, next) {
  res.status(201).json({
    data: await service.create(req.body.data)
  });
}

// UPDATE EXISTING TABLE
// working on
async function update(req, res, next) {


  const updatedTable = {
    ...req.body.data,
    table_id: res.locals.table.table_id
  }

  res.status(200).json({
    data : (await service.update(updatedTable))[0]
  })

}

// SEAT RESERVATION
async function seat(req, res, next) {
  const {
    table: { table_id: tableId, ...table },
  } = res.locals;
  const error = { status: 400, message: `Table occupied.` };
  if (table.status === "Occupied") return next(error);

  const updatedTable = { ...table, ...req.body, status: "Occupied" };

  let newTable = await service.update(tableId, updatedTable);
  newTable = await service.read(tableId);
  if (newTable instanceof Error) return next({ message: newTable.message });
  res.json({ data: newTable });
}

// UNSEAT RESERVATION
async function unseat(req, res, next) {
  const { table } = res.locals.table
  
  if (table.status !== "Occupied") {
    next({
      status: 400,
      message: `Table not occupied.`
    });
  }
  
  const updatedTable = {
    ...req.body.data,
    post_id: res.locals.table.table_id
  }
    
  // const updatedTable = {
  //   ...table,
  //   status: "Free"
  // }


  res.status(201).json({
    data: (await service.update(updatedTable))[0]
  });
}

// DELETE TABLE
async function destroy(req, res, next) {
  const { table } = res.locals;
  await service.destroy(table.table_id);
  res.sendStatus(204);
}

// LIST ALL TABLES - WORKING
async function list(req, res, next) {
  res.json({ data: await service.list() });
}

// GET SPECIFIC TABLE
async function read(req, res, next) {
  const { table } = res.locals;
  res.json({ data: table });
}

module.exports = {
  // POST "/"
  create: [
    asyncErrorBoundary(tablesDataValidation),
    asyncErrorBoundary(create)],
  // GET "/"
  list: [
    asyncErrorBoundary(list)
  ],
  // GET /:tableId
  read: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(read)
  ],
  // PUT /:tableId
  update: [
    asyncErrorBoundary(seatsDataValidation),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(update)
  ],
  // DELETE /:tableId
  destroy: [
    asyncErrorBoundary(tablesDataValidation),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(destroy)
  ],
  // PUT /:tableId/seat
  seat: [
    asyncErrorBoundary(seatsDataValidation),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(seat)
  ],
  // DELETE /:tableId/seat
  unseat: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(unseat)
  ],
};
