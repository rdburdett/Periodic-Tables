const service = require("./tables.service.js");
const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");

function hasData(req, res, next) {
  const { data } = req.body;
  if(!data){
    return next({
      status: 400,
      message: "Please fill in required fields."
    })
  }
  next()
}

// VALIDATE REQUEST PROPERTIES
function propertyValidation(req, res, next) {
  const { data } = req.body;
  const validFields = new Set([
    "table_name",
    "capacity",
    "reservation_id",
    "status"
  ]);
  
  const invalidFields = Object
    .keys(data)
    .filter((field) => !validFields.has(field)
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
  const { tableId } = req.params;
  const error = { status: 404, message: `Table ${tableId} cannot be found.` };
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
  create: [
    asyncErrorBoundary(hasData),
    asyncErrorBoundary(propertyValidation),
    asyncErrorBoundary(create)],
  update: [
    asyncErrorBoundary(hasData),
    asyncErrorBoundary(propertyValidation),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(update)
  ],
  seat: [
    asyncErrorBoundary(hasData),
    asyncErrorBoundary(propertyValidation),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(seat)
  ],
  unseat: [
    asyncErrorBoundary(hasData),
    asyncErrorBoundary(propertyValidation),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(unseat)
  ],
  destroy: [
    asyncErrorBoundary(hasData),
    asyncErrorBoundary(propertyValidation),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(destroy)
  ],
  list: [
    asyncErrorBoundary(list)
  ],
  read: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(read)
  ],
};
