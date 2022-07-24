const knex = require("../../db/connection.js");

// LIST
function list() {
  return knex("tables").select("*").orderBy("table_name", "asc");
}

// CREATE
function create(newTable) {
  return knex("tables")
    .insert(newTable, "*")
    .then((createdTable) => createdTable[0]);
}

// READ
function read(tableId) {
  return knex("tables").select("*").where({ table_id: tableId }).first();
}

// UPDATE
function update(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*");
}

// UNSEAT
function finish({ table_id, reservation_id }) {
  return knex.transaction((trx) => {
    return knex("reservations")
      .transacting(trx)
      .where({ reservation_id })
      .update({ status: "finished" })
      .then(() => {
        return knex("tables")
          .transacting(trx)
          .where({ table_id })
          .update({ reservation_id: null })
          .returning("*");
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
}

// DESTROY
function destroy(tableId) {
  return knex("tables").where({ table_id: tableId }).del();
}

module.exports = {
  list,
  create,
  read,
  update,
  finish,
  destroy,
};
