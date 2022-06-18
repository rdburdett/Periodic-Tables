const reservations = require("../data/00-reservations-data");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex.raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")
  // Insert seed data
  await knex("reservations").insert(reservations)
};
