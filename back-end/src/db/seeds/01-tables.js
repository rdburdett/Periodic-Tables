const tables = require("../data/01-tables-data");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex.raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE")
  await knex('tables').insert(tables);
};