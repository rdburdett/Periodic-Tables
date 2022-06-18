// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
exports.up = function(knex) {
  return knex.schema.createTable("tables", (table) => {
    table.increments("table_id").primary();
    table.string("table_name");
    table.integer("capacity");
    table.integer("reservation_id");
    table.string("status").notNullable().defaultTo("Free");
    table.timestamps(true, true);
  });
};


// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
exports.down = function(knex) {
  return knex.schema.dropTable("tables");
};
