const service = require("./reservations.service");
const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");
const logger = require("../../logger.js")

////////////////////////////
//      ROUTE LOGGER      //
////////////////////////////

const log = true

////////////////////////////
//       VALIDATION       //
////////////////////////////

// VERIFY IS A DATE
function isADate(dateString){
  const regexp = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  return regexp.test(dateString);
};

// VALIDATE STATUS
function validateStatus(req, res, next) {
  const { data } = req.body
  // log && console.log("\nvalidateStatus()")
  const validStatus = ["booked", "seated", "finished", "cancelled"];

  // Returns 400 if 'status' is not valid
  if (!validStatus.includes(data.status)) {
    log && console.log(`validateStatus() - 400 ${data.status} is not a valid status.`)
    return next({
      status: 400,
      message: `${data.status} is not a valid status.`
    });
  }

  // Returns 400 if 'status' is empty
  if (!data.status) {
    log && console.log("validateStatus() - 400 Status is empty.")
    return next({
      status: 400,
      message: "Status is empty."
    })
  }
  
  log && console.log("\nvalidateStatus() - Status valid.")
  return next()
}

// VALIDATE DATE
function validateName(req, res, next, data){
  const reqFirstName = data.first_name;
  const reqLastName = data.last_name;
  // Validate first_name
  if (!reqFirstName || reqFirstName.length <= 0) {
    log && console.log("\nvalidateName() - 400 Reservation must include a first_name field.")
    return next({
      status: 400,
      message: "Reservation must include a first_name field."
    });
  }
  // Validate last_name
  if (!reqLastName || reqLastName.length <= 0) {
    log && console.log("\nvalidateName() - 400 Reservation must include a last_name field.")
    return next({
      status: 400,
      message: "Reservation must include a last_name field."
    });
  }
};

// VALIDATE MOBILE PHONE
function validateMobilePhone(req, res, next, data) {
  const mobileNumber = data.mobile_number;
  if (!mobileNumber) {
    log && console.log("\nvalidateMobilePhone() - 400 Reservation must include a mobile_number.")
    return next({
      status: 400,
      message: "Reservation must include a mobile_number."  
    });
  }
}

// VALIDATE PEOPLE
function validatePeople(req, res, next, data) {
  // log && console.log("\nvalidPeople()")

  // Returns 400 if party size is zero
  if (data.people <= 0) {
    log && console.log(`validatePeople() - 400 Your party cannot have zero people.`)
    return next({
      status: 400,
      message: `Your party cannot have zero people.`
    });
  }

  // Returns 400 if party size is not a number
  if (typeof data.people !== "number") {
    log && console.log(`validatePeople() - 400 Property 'people' must be a number.`)
    return next({
      status: 400,
      message: `Property 'people' must be a number.`,
    });
  }
}

// VALIDATE DATE
function validateDate(req, res, next, data) {
  const inputDate = new Date(data.reservation_date + " 23:59:59.999Z");
  const compareDate = new Date();
  inputDate.setHours(0, 0, 0, 0);
  compareDate.setHours(0, 0, 0, 0);
  
  // Returns 400 if reservation_date is missing or empty
  if (!data.reservation_date) {
    log && console.log(`validateDate() - 400 Request 'reservation_date' empty.`)
    return next({
      status: 400,
      message: `Request 'reservation_date' empty.`,
    });
  }

  // Returns 400 if reservation_date is not a date
  if (!isADate(data.reservation_date)) {
    log && console.log(`validateDate() - 400 Request 'reservation_date' must be a date.`)
    return next({
      status: 400,
      message: `Request 'reservation_date' must be a date.`,
    });
  }

  // Returns 400 if reservation_date is not in the future
  if (inputDate < compareDate) {
    log && console.log(`validateDate() - 400 Reservation must be made for a day in the future.`)
    return next({
      status: 400,
      message: `Reservation must be made for a day in the future.`,
    });
  }
  
  // Returns 400 if user attempts to make reservation on a Tuesday 
  if (inputDate.getUTCDay() === 2) {
    log && console.log(`validateDate() - 400 Reservation cannot be made. The restaurant is closed on Tuesdays.`)
    return next({
      status: 400,
      message: `Reservation cannot be made. The restaurant is closed on Tuesdays.`
    });
  }

  // Returns 400 if reservation_time is missing or empty
  if (!data.reservation_time) {
    log && console.log(`400 Request 'reservation_time' empty.`)
    return next({
      status: 400,
      message: `Request 'reservation_time' empty.`,
    });
  }
  
  // Returns 400 if reservation_time is not between 10:30AM & 9:30PM
  if (data.reservation_time < "10:30" || data.reservation_time > "21:30") {
    log && console.log(`400 Request 'reservation_time' must be between 10:30AM & 9:30PM.`)
    return next({
      status: 400,
      message: `Request 'reservation_time' must be between 10:30AM & 9:30PM.`,
    });
  }
}

//  VALIDATE REQUEST DATA
function dataValidation(req, res, next) {
  log && console.log("\ndataValidation()")
  const { data } = req.body;
  if (!data) {
    log && console.log("\ndataValidation() - 400 Please fill in required fields.")
    return next({
      status: 400,
      message: "Please fill in required fields."
    })
  }
  
  // VALIDATION HELPERS
  validateName(req, res, next, data)
  validateMobilePhone(req, res, next, data)
  validatePeople(req, res, next, data)
  validateDate(req, res, next, data)

  log && console.log("\ndataValidation() - All tables data is valid.")
  return next()
}

// CHECK IF RESERVATION EXISTS
async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId);

  if (!reservation) {
    log && console.log(`reservationExists() - 400 Reservation ${reservationId} cannot be found.`)
    return next({
      status: 404,
      message: `Reservation ${reservationId} cannot be found.`
    })
  } else {
    res.locals.reservation = reservation
    log && console.log("reservationExists() - Reservation exists.\nres.locals.reservation assigned: ", reservation)
    return next()
  }
}

//////////////////////
//       CRUD       //
//////////////////////

// GET "/"
async function list(req, res, next) {
  res.json({ data: await service.list() })
}

// SEARCH FOR RESERVATION - PARENT
// GET "/search"
async function search(req, res, next) {
  if (req.query.mobile_number) {
    searchMobile(req, res, next)
  }
  if (req.query.date) {
    searchDate(req, res, next)
  }
}

// HELPER - SEARCH FOR RESERVATION BY MOBILE NUMBER
async function searchMobile(req, res, next) {
  let { mobile_number = "xxx-xxx-xxxx" } = req.query;
  res.json({ data: await service.searchMobile(mobile_number) });
}

// HELPER - SEARCH FOR RESERVATION BY DATE
async function searchDate(req, res, next) {
  let { date } = req.query;

  log && console.log("req.query.date:", date)
  const response = await service.searchDate(date)
  const filteredResponse = response.filter((reservation) => {
    return (reservation.status !== "finished")
  }) 
  log && console.log(
    "searchdate() - date: ", date,
    "\nResponse: ", filteredResponse
  )
  res.json({ data: filteredResponse });
}

// CREATE NEW RESERVATION
// POST "/"
async function create(req, res, next) {
  log && console.log("create()...")
  const { status } = req.body.data

  // Returns 400 if status is 'seated'
  if (status === "seated") {
    log && console.log("create() - 400 Status seated.")
    return next({
      status: 400,
      message: `Status seated.`
    })

  }

  // Returns 400 if status is 'finished'
  if (status === "finished") {
    log && console.log("create() - 400 Status finished.")
    return next({
      status: 400,
      message: `Status finished.`
    })
  }

  const newReservation = {
    ...req.body.data,
    status: "booked"
  }
  // Returns 201 if status is 'booked'
  log && console.log("create() - 201 Status booked.", newReservation)
  res.status(201).json({
    data: await service.create(newReservation)
  });
}

// GET SPECIFIC RESERVATION
// GET "/:reservationId"
async function read(req, res, next) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

// UPDATE EXISTING RESERVATION
// PUT "/:reservationId"
async function update(req, res, next) {
  const { data } = req.body
  const inputDate = new Date(data.reservation_date + " 23:59:59.999Z");
  const compareDate = new Date();
  inputDate.setHours(0, 0, 0, 0);
  compareDate.setHours(0, 0, 0, 0);

  // send 400 if reservation is not in the future
  if (inputDate < compareDate) {
    log && console.log("400 Reservation must occur in the future to be updated.")
    next({
      status: 400,
      message: `Reservation must occur in the future to be updated.`
    })
  }
  
  // send 200 and update the reservation
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id
  }
  log && console.log("\nupdate() - Reservation updated: ", updatedReservation)
  res
    .status(200)
    .json({
      data: (await service.update(updatedReservation))[0]
    });
}

// UPDATE SEATING STATUS
// PUT "/:reservationId/status"
async function statusUpdate(req, res, next) {  
  const reqReservationStatus = req.body.data.status
  const currentReservationStatus = res.locals.reservation.status

  ///////////////////////////////
  // !!!!!! IMPORTANT !!!!!!!! //
  ///////////////////////////////
  // Return 400 if status is currently finished (a finished reservation cannot be updated)
  if (currentReservationStatus === "finished") {
    log && console.log("statusUpdate() - 400 Status finished. Cannot update a finished reservation.")
    return next({
      status: 400,
      message: 'Status finished. Cannot update a finished reservation.'
    });

  }


  // Return 200 and update status
  const updatedStatus = {
    ...res.locals.reservation,
    status: reqReservationStatus
  }
  const response = await service.update(updatedStatus)
  log && console.log("statusUpdate() - 200 Status updated: ", response)
  res.status(200).json({
    data: response[0]
  })
}

// DELETE RESERVATION
// DELETE "/:reservationId"
async function destroy(req, res, next) {
  const { reservation } = res.locals;
  await service.destroy(reservation.reservation_id);
  res.sendStatus(204);
}

module.exports = {
  // GET "/"
  search: [
    asyncErrorBoundary(logger.logReservationSearch),
    asyncErrorBoundary(search)
  ],
  // POST "/"
  create: [
    asyncErrorBoundary(logger.logReservationCreate),
    asyncErrorBoundary(dataValidation),
    asyncErrorBoundary(create),
  ],
  // GET "/:reservationId"
  read: [
    asyncErrorBoundary(logger.logReservationRead),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(read)
  ],
  // PUT "/:reservationId"
  update: [
    asyncErrorBoundary(logger.logReservationUpdate),
    asyncErrorBoundary(dataValidation),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(update),
  ],
  // DELETE "/:reservationId"
  destroy: [
    asyncErrorBoundary(logger.logReservationDestroy),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(destroy)
  ],
  // PUT "/:reservationId/status"
  statusUpdate: [
    asyncErrorBoundary(logger.logReservationStatusUpdate),
    asyncErrorBoundary(validateStatus),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(statusUpdate),
  ],
};
