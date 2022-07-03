const knex = require("../../db/connection.js");

// READ
function read(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
};

// LIST
function list() {
  return knex("reservations")
    .select("*");
};

// CREATE
function create(reservation) {
  return knex("reservations")
    .insert(reservation, "*")
    .then((createdReservation) => createdReservation[0]);
};


function update(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*");
};


function destroy(reservationId) {
  return knex("reservations")
    .where({ reservation_id: reservationId })
    .del();
};


function listByDate(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: "Finished" })
    .whereNot({ status: "Cancelled" })
    .orderBy("reservation_time", "asc");
};


function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
};

module.exports = {
  list,
  search,
  create,
  read,
  update,
  destroy,
  listByDate,
};