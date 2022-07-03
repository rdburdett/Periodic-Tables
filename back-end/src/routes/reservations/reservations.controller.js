const service = require("./reservations.service");
const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");

// Validate request properties
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

  const invalidFields = Object.keys(data).filter((field) => {
    return !validFields.has(field);
  }
  );

  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  next();
};

// Validate request data
function dataValidation(req, res, next) {
  const { data } = req.body;
  
  // Validate people
  if (data.people <= 0)
    return next({ status: 400, message: "Your party cannot have zero people" });
  
  if (typeof data.people !== "number") {
    return next({
      status: 400,
      message: "Property people must be a number.",
    });
  }

  // Validate date
  let inputDate = new Date(data.reservation_date + " 23:59:59.999Z");
  let compareDate = new Date();
  inputDate.setHours(0, 0, 0, 0);
  compareDate.setHours(0, 0, 0, 0);

  if (inputDate < compareDate)
    return next({
      status: 400,
      message: `Reservation cannot be made for a day in the future`,
    });
  if (inputDate.getUTCDay() === 2)
    return next({ status: 400, message: "Reservation cannot be made. The restaurant is closed on Tuesdays." });
  if (data.reservation_time < "10:30" || data.reservation_time > "21:30")
    return next({
      status: 400,
      message: "reservation_time must be between 10:30AM & 9:30PM",
    });
  next();
}

async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const error = {
    status: 404,
    message: `Reservation ${reservationId} cannot be found.`
  };

  const reservation = await service.read(reservationId);

  if (reservation) {
    res.locals.reservation = reservation;
    return next()
  } else return next(error);

  // reservation ?
  //   (res.locals.reservation = reservation, next())
  //   : next(error);
}

// CREATE NEW RESERVATION
async function create(req, res, next) {
  // let newReservation = await service.create(req.body);
  // if (newReservation instanceof Error)
  //   return next({ message: newReservation.message });

  res.status(201).json({
    data: await service.create(req.body.data)
  });
}

// UPDATE EXISTING RESERVATION
async function update(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
    post_id: res.locals.reservation.reservation_id
  }

  res.json({
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

async function statusUpdate(req, res, next) {
  const updatedStatus = {
    ...res.locals.reservation,
    status: req.body.status
  }

  res.json({
    data: await service.update(updatedStatus)[0]
  })

  // const {
  //   reservation: { reservation_id: reservationId, ...reservation },
  // } = res.locals;

  // const updatedReservation = { ...reservation, ...req.body };

  // let newReservation = await service.update(reservationId, updatedReservation);

  // newReservation = await service.read(reservationId);

  // if (newReservation instanceof Error)
  //   return next({ message: newReservation.message });

  // res.json({ data: newReservation });
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
