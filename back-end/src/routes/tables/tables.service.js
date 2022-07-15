const knex = require("../../db/connection.js");

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

// READ
function read(tableId) {
  return knex("tables")
    .select("*")
    .where({ table_id: tableId })
    .first();
};

// UPDATE
function update(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
};

// DESTROY
function destroy(tableId) {
  return knex ("tables")
  .where({ "table_id": tableId })
  .del();
}

module.exports = {
  list,
  create,
  read,
  update,
  destroy,
};