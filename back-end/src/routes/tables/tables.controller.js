const tablesService = require("./tables.service.js");
const reservationsService = require("../reservations/reservations.service.js");
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
  // console.log("reqReservationId", reqReservationId)
  // Validate reservation_name
  if (!reqReservationId || reqReservationId.length === 0) {
    return next({
      status: 400,
      message: "Request must contain 'reservation_id'."
    });
  }
  next()
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

  next()
}

// RESERVATION EXISTS
// DONE
async function reservationExists(req, res, next) {
  const reservationId = req.body.data.reservation_id;
  console.log("1. req.body.data.reservation_id: ", req.body.data.reservation_id)

  const reservation = await reservationsService.read(reservationId);
  console.log("1. Does reservation exist? ", reservation)

  if (!reservation) {
    console.log("1. Reservation does not exist: ", reservation)

    return next({
      status: 404,
      message: `Reservation ID ${reservationId} cannot be found.`
    })

  } else {
    res.locals.reservation = reservation;
    console.log("1. Yes, reservationExists locals assign: ", res.locals.reservation)
    return next()
  }
  next()
}

// TABLE EXISTS
// DONE
async function tableExists(req, res, next) {
  const { tableId } = req.params;
  const table = await tablesService.read(tableId);
  console.log("2. Does table exist? ", table)

  if (!table) {
    console.log("2. Table does not exist: ", table)

    return next({
      status: 404,
      message: `Table ${tableId} cannot be found.`
    })
  } else {

    res.locals.table = await table;
    console.log("2. Yes, table locals assign: ", res.locals.table)

    return next()
  }
  next()
}

// CREATE NEW TABLE 
// DONE
async function create(req, res, next) {
  res.status(201).json({
    data: await tablesService.create(req.body.data)
  });
}

// UPDATE EXISTING TABLE
// working on
async function update(req, res, next) {
  const { tableId } = req.params;
  const table = await tablesService.read(tableId);
  // console.log("update table: ", table)

  const updatedTable = {
    ...req.body.data,
    table_id: table.table_id
  }

  res.status(200).json({
    data : (await tablesService.update(updatedTable))
  })

}

// SEAT RESERVATION
async function seat(req, res, next) {
  console.log("3. seat res.locals: ", res.locals)

  // get tableId
  const { tableId } = req.params
  console.log("4. tableId: ", tableId)

  // get reservation
  const reservationId = req.body.data.reservation_id;
  console.log("5. reservationId: ", reservationId)

  const reservation = await reservationsService.read(reservationId);
  console.log("6. reservation: ", reservation)

  console.log("7. res.locals: ", res.locals)
  // get table
  // const table = await tablesService.read(tableId);
  // console.log("table: ", table, "status: ", table.status)

  
  
  // if (table.status !== "Available") {
  //   console.log("Not Available")
  //   return next({
  //     status: 400,
  //     message: "Table occupied."
  //   })
  // }
  
  
  // if (table.capacity >= reservation.people) {
  //   console.log("capacity enough")
  //   res.sendStatus(200).json({
  //       data: (await tablesService.update(updatedTable))[0]
  //   })
    // const updatedTable = {
    //   ...table,
    //   reservation_id: reservationId,
    //   status: "Seated"
    // };
    
    // console.log("updatedTable: ", updatedTable)
    // const response = (await tablesService.update(updatedTable))[0]
    // console.log("response", response)
    // console.log(await tablesService.read(tableId))
    // console.log("body", res.body)
    // console.log("status", res.status)

    // console.log("----------------------------------")
    // return res.sendStatus(200)

    // res.status(200).json({
    //   data: response
    // })
  // } else {
  //   console.log("not enough")
  //   return next({
  //     status: 400,
  //     message: `Table has insufficient capacity.`
  //   })
  // }

}

// UNSEAT RESERVATION
async function unseat(req, res, next) {
  const { table } = res.locals
  
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
    data: (await tablesService.update(updatedTable))[0]
  });
}

// DELETE TABLE
async function destroy(req, res, next) {
  const { table } = res.locals;
  await tablesService.destroy(table.table_id);
  res.sendStatus(204);
}

// LIST ALL TABLES - WORKING
async function list(req, res, next) {
  res.json({ data: await tablesService.list() });
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
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(seat)
  ],
  // DELETE /:tableId/seat
  unseat: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(unseat)
  ],
};
