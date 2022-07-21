const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../../errors/methodNotAllowed");

/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 *
 * Routes available:
 * "/"" get: list all tables., post: add a new table
 * "/:tablesId" get: list a single table, put: update an existing table, delete: delete an existing table
 * "/tablesID/seat" put: set a table status to Occupied. delete: set a table to "free"
 */

router
  .route("/")
  .post(controller.create)
  .get(controller.list)
  .all(methodNotAllowed);
router
  .route("/:tableId")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.destroy)
  .all(methodNotAllowed);
router
  .route("/:tableId/seat")
  .put(controller.seat)
  .delete(controller.unseat)
  .all(methodNotAllowed);

module.exports = router;
