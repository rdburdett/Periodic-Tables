const service = require("./reservations.service");
const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");


// VALIDATE REQUEST PROPERTIES
function hasValidFields(req, res, next) {
  const { data = {} } = req.body
  const validFields = new Set([
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
    "status",
    "created_at",
    "updated_at",
    "reservation_id"
  ]);

  const invalidFields = Object
    .keys(data)
    .filter((field) => !validFields.has(field));

  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  next();
};

function validatePeople(req, res, next, data) {
  if (data.people <= 0)
    return next({
      status: 400,
      message: `Your party cannot have zero people.`
    });

  if (typeof data.people !== "number") {
    return next({
      status: 400,
      message: `Property 'people' must be a number.`,
    });
  }
}

// validateDate helper
function isADate(dateString){
  const regexp = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  return regexp.test(dateString);
};

function validateDate(req, res, next, data) {
  let inputDate = new Date(data.reservation_date + " 23:59:59.999Z");
  let compareDate = new Date();
  inputDate.setHours(0, 0, 0, 0);
  compareDate.setHours(0, 0, 0, 0);
  
  // Returns 400 if reservation_date is missing or empty
  if (!data.reservation_date) {
    return next({
      status: 400,
      message: `Request 'reservation_date' empty.`,
    });
  }

  // Returns 400 if reservation_date is not a date
  if (!isADate(data.reservation_date)) {
    return next({
      status: 400,
      message: `Request 'reservation_date' empty.`,
    });
  }

  // Returns 400 if reservation_date is not in the future
  if (inputDate < compareDate) {
    return next({
      status: 400,
      message: `Reservation must be made for a day in the future`,
    });
  }
  
  // Returns 400 if user attempts to make reservation on a Tuesday 
  if (inputDate.getUTCDay() === 2) {
    return next({
      status: 400,
      message: `Reservation cannot be made. The restaurant is closed on Tuesdays.`
    });
  }

  // Returns 400 if reservation_time is missing or empty
  if (!data.reservation_time) {
    return next({
      status: 400,
      message: `Request 'reservation_time' empty.`,
    });
  }
  
  // Returns 400 if reservation_time is not between 10:30AM & 9:30PM
  if (data.reservation_time < "10:30" || data.reservation_time > "21:30") {
    return next({
      status: 400,
      message: `'reservation_time' must be between 10:30AM & 9:30PM`,
    });
  }

}

function validateStatus(req, res, next, data) {
  const validStatus = ["booked", "seated", "finished", "cancelled"];

  if (!data.status) {
    console.log(data)
    return next({
      status: 400,
      message: "Status is empty."
    })
  }

  if(data.reservation.status === "finished") {
    return next({
      status: 400,
      message: "Cannot update reservation which is 'finished"
    })
  }

  if(!validStatus.includes(data.status)) {
    return next({
      status: 400,
      message: `${data.status} is not a valid status`
    });
  }
}

function validateName(req, res, next, data){
  const reqFirstName = data.first_name;
  const reqLastName = data.last_name;
  // Validate first_name
  if (!reqFirstName || reqFirstName.length <= 0) {
    return next({
      status: 400,
      message: "Reservation must include a first_name field"
    });
  }
  // Validate last_name
  if(!reqLastName || reqLastName.length <= 0){
    return next({
      status: 400,
      message: "Reservation must include a last_name field"
    });
  }
};

function validateMobilePhone(req, res, next, data) {
  const mobileNumber = data.mobile_number;
  if (!mobileNumber) {
    return next({
      status: 400,
      message: "Reservation must include a mobile_number"  
    });
  }
}

//  Validate request data
function dataValidation(req, res, next) {
  const { data } = req.body;
  if(!data){
    next({
      status: 400,
      message: "Please fill in required fields"
    })
  }
  
  // Validation helpers
  validateName(req, res, next, data)
  validateMobilePhone(req, res, next, data)
  validatePeople(req, res, next, data)
  validateDate(req, res, next, data)
  // validateStatus(req, res, next, data)

  next()
}

// CHECK IF RESERVATION EXISTS
async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId);

  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation ${reservationId} cannot be found.`
    })
  }
  res.locals.reservation = reservation
  next()
}
// CREATE NEW RESERVATION
async function create(req, res, next) {
  res.status(201).json({
    data: await service.create(req.body.data)
  });
}

// UPDATE EXISTING RESERVATION
async function update(req, res, next) {
  let inputDate = new Date(data.reservation_date + " 23:59:59.999Z");
  let compareDate = new Date();
  inputDate.setHours(0, 0, 0, 0);
  compareDate.setHours(0, 0, 0, 0);

  const updatedReservation = {
    ...req.body.data,
    post_id: res.locals.reservation.reservation_id
  }
  if (inputDate < compareDate) {
    console.log("past input date")
    next({
      status: 400,
      message: `Reservation must occur in the future to be updated.`
    })
  }

  res.status(201).json({
    data: (await service.update(updatedReservation))[0]
  });
}

// DELETE RESERVATION
async function destroy(req, res, next) {
  const { reservation } = res.locals;
  await service.destroy(reservation.reservation_id);
  res.sendStatus(204);
}

// SEARCH FOR RESERVATION
async function search(req, res, next) {
  let { mobile_number = "xxx-xxx-xxxx" } = req.query;

  let reservations = await service.search(mobile_number);

  if (reservations instanceof Error)
    return next({ message: reservations.message });
  res.json({ data: reservations });
}

// GET SPECIFIC RESERVATION
async function read(req, res, next) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

// LIST BY DATE
async function listByDate(req, res, next) {
  const { reservation_date } = req.query;
  const error = { status: 404, message: "Reservation Date cannot be found." };
  if (!reservation_date) return next(error);
  let reservations = await service.listByDate(reservation_date);
  if (reservations instanceof Error) return next({ message: reservations.message });

  res.json({ data: reservations });

  res.json({
    data:
      await service.listByDate(reservation_date)
  })
}

// UPDATE SEATING STATUS
async function statusUpdate(req, res, next) {
  const updatedStatus = {
    ...res.locals.reservation,
    status: req.body.status
  }

  res.json({
    data: await service.update(updatedStatus)[0]
  })
}

module.exports = {
  create: [
    asyncErrorBoundary(hasValidFields),
    asyncErrorBoundary(dataValidation),
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(hasValidFields),
    asyncErrorBoundary(dataValidation),
    asyncErrorBoundary(reservationExists),
    update,
  ],
  statusUpdate: [
    asyncErrorBoundary(hasValidFields),
    asyncErrorBoundary(reservationExists),
    statusUpdate,
  ],
  destroy: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)],
  search: [asyncErrorBoundary(search)],
  listByDate: [asyncErrorBoundary(listByDate)],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
};
