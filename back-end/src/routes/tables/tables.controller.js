const service = require("./tables.service.js");

const VALID_PROPERTIES = ["table_name", "capacity", "reservation_id", "status"];

function propertyValidation(req, res, next) {
  const data = ({} = req.body);
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

async function tableExists(req, res, next) {
  const error = { status: 404, message: `Table cannot be found.` };
  const { tableId } = req.params;
  if (!tableId) return next(error);

  let table = await service.read(tableId);
  if (!table) return next(error);
  res.locals.table = table;
  next();
}

// CREATE NEW TABLE
async function create(req, res, next) {
  let newTable = await service.create(req.body);
  if (newTable instanceof Error) return next({ message: newTable.message });

  res.status(201).json({ data: newTable });
}

// UPDATE EXISTING TABLE
async function update(req, res, next) {
  const {
    table: { table_id: tableId, ...table },
  } = res.locals;
  const updatedTable = { ...table, ...req.body };
  let newTable = await service.update(tableId, updatedTable);
  newTable = await service.read(tableId);
  if (newTable instanceof Error) return next({ message: newTable.message });
  res.json({ data: newTable });
}

// SEAT RESERVATION
async function seat(req, res, next) {
  const {
    table: { table_id: tableId, ...table },
  } = res.locals;
  const error = { status: 400, message: `Table occupied.` };
  if (table.status === "Occupied") return next(error);

  const updatedTable = { ...table, ...req.body, status: "Occupied" };

  let newTable = await service.update(tableId, updatedTable);
  newTable = await service.read(tableId);
  if (newTable instanceof Error) return next({ message: newTable.message });
  res.json({ data: newTable });
}

// UNSEAT RESERVATION
async function unseat(req, res, next) {
  const {
    table: { table_id: tableId, ...table },
  } = res.locals;
  const error = { status: 400, message: `Table not occupied.` };
  if (table.status !== "Occupied") return next(error);

  const updatedTable = { ...table, status: "Free" };

  let newTable = await service.update(tableId, updatedTable);
  newTable = await service.read(tableId);
  if (newTable instanceof Error) return next({ message: newTable.message });
  res.json({ data: newTable });
}

// DELETE TABLE
async function destroy(req, res, next) {
  const { table } = res.locals;
  await service.destroy(table.table_id);
  res.sendStatus(204);
}

// LIST ALL TABLES
async function list(req, res, next) {
  let table = await service.list();
  if (table instanceof Error) return next({ message: table.message });
  res.json({ data: table });
}

// GET SPECIFIC TABLE
async function read(req, res, next) {
  const { table } = res.locals;
  res.json({ data: table });
}

module.exports = {
  create: [propertyValidation, create],
  update: [propertyValidation, tableExists, update],
  seat: [tableExists, seat],
  unseat: [tableExists, unseat],
  destroy: [tableExists, destroy],
  list: [list],
  read: [tableExists, read],
};
