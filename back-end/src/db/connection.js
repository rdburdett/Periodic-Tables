const environment = process.env.NODE_ENV || "development";
const config = require("../../knexfile")[environment];
const knex = require("../../node_modules/knex/knex")(config, {useNullAsDefault: true});

module.exports = knex;
