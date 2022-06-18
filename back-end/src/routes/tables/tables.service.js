const knex = require("../../db/connection.js");

function read(tableId) {
  return knex("tables")
    .select("*")
    .where({ table_id: tableId })
    .first();
};

function list() {
  return knex("tables")
    .select("*")
    .orderBy("table_name", "asc");
};

function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*");
};

function update(tableId, updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: tableId })
    .update(updatedTable, "*");
};

function destroy(reservationId) {
  return knex("tables")
    .where({ reservation_id: reservationId })
    .del();
};

module.exports = {
  list,
  create,
  read,
  update,
  destroy,
};