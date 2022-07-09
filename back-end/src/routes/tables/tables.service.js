const knex = require("../../db/connection.js");

// READ
function read(tableId) {
  return knex("tables")
    .select("*")
    .where({ table_id: tableId })
    .first();
};

// LIST
function list() {
  return knex("tables")
    .select("*")
    .orderBy("table_name", "asc");
};

// CREATE
function create(newTable) {
  return knex("tables")
    .insert(newTable, "*")
    .then((createdTable) => createdTable[0]);
};


function update(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.tableId })
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