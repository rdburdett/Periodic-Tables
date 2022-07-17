const knex = require("../../db/connection.js");

// LIST
function list() {
  return knex("reservations")
    .select("*");
};

// SEARCH MOBILE
function searchMobile(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
};

// LIST BY DATE
function searchDate(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time", "asc");
};

// CREATE
function create(reservation) {
  return knex("reservations")
    .insert(reservation, "*")
    .then((createdReservation) => createdReservation[0]);
};

// READ
function read(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
};

// UPDATE
function update(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*");
};

// DELETE
function destroy(reservationId) {
  return knex("reservations")
    .where({ reservation_id: reservationId })
    .del();
};



module.exports = {
  list,
  searchMobile,
  searchDate,
  create,
  read,
  update,
  destroy,
};