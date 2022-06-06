const knex = require("../../db/connection.js");

function read(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
};

function list() {
  return knex("reservations")
    .select("*");
};
function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*");
};
function update(reservationId, updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
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