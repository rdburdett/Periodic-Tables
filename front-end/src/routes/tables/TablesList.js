import TableCard from "./TableCard";

const log = true;

function TablesList({ tables, reservations }) {
  log && console.log("tables: ", tables);
  log && console.log("reservations: ", reservations);

  return (
    <div className="card-columns">
      {!tables && "No available tables."}
      {tables.map((table) => (
        <TableCard
          key={table.table_id}
          table={table}
          reservations={reservations}
        />
      ))}
    </div>
  );
}

export default TablesList;
