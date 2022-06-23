const service = require("./reservations.service");
const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];

function propertyValidation(req, res, next) {
  const { data } = req.body;
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

function dataValidation(req, res, next) {
  const { data } = req.body;
  let inputDate = new Date(data.reservation_date + " 23:59:59.999Z");
  let compareDate = new Date();
  inputDate.setHours(0, 0, 0, 0);
  compareDate.setHours(0, 0, 0, 0);
  if (data.people <= 0)
    return next({ status: 400, message: "Your party cannot have zero people" });
  if (inputDate < compareDate)
    return next({
      status: 400,
      message: `Reservation cannot be made for a day in the past`,
    });
  if (inputDate.getUTCDay() === 2)
    return next({ status: 400, message: "No Reservations on Tuesdays" });
  if (data.reservation_time < "10:30" || data.reservation_time > "21:30")
    return next({
      status: 400,
      message: "Reservation must be between 10:30AM & 9:30PM",
    });
  next();
}

async function reservationExists(req, res, next) {
  const error = { status: 404, message: "Reservation cannot be found." };
  const { reservationId } = req.params;
  if (!reservationId) return next(error);

  let reservation = await service.read(reservationId);
  if (!reservationId) return next(error);
  res.locals.reservation = reservation;
  next();
}

// CREATE NEW RESERVATION
async function create(req, res, next) {
  let newReservation = await service.create(req.body);
  if (newReservation instanceof Error)
    return next({ message: newReservation.message });

  res.status(201).json({ data: newReservation });
}

// UPDATE EXISTING RESERVATION
async function update(req, res, next) {
  const {
    reservation: { reservation_id: reservationId, ...reservation },
  } = res.locals;
  const updatedReservation = { ...reservation, ...req.body };
  let newReservation = await service.update(reservationId, updatedReservation);
  newReservation = await service.read(reservationId);
  if (newReservation instanceof Error)
    return next({ message: newReservation.message });
  res.json({ data: newReservation });
}

// DELETE RESERVATION
async function destroy(req, res, next) {
  const { reservation } = res.locals;
  await service.destroy(reservation.reservation_id);
  res.sendStatus(204);
}

// SEARCH FOR RESERVATION
async function search(req, res, next) {
  let { mobile_number } = req.query;
  if (!mobile_number) mobile_number = "xxx-xxx-xxxx";
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
}

async function statusUpdate(req, res, next) {
  const {
    reservation: { reservation_id: reservationId, ...reservation },
  } = res.locals;
  const updatedReservation = { ...reservation, ...req.body };
  let newReservation = await service.update(reservationId, updatedReservation);
  newReservation = await service.read(reservationId);
  if (newReservation instanceof Error)
    return next({ message: newReservation.message });
  res.json({ data: newReservation });
}

module.exports = {
  create: [
    asyncErrorBoundary(propertyValidation),
    asyncErrorBoundary(dataValidation),
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(propertyValidation),
    asyncErrorBoundary(dataValidation),
    asyncErrorBoundary(reservationExists),
    update,
  ],
  statusUpdate: [
    asyncErrorBoundary(propertyValidation),
    asyncErrorBoundary(reservationExists),
    statusUpdate,
  ],
  destroy: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)],
  search: [asyncErrorBoundary(search)],
  listByDate: [asyncErrorBoundary(listByDate)],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
};
