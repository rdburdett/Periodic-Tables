import TableCard from "./TableCard";


function TablesList({ tables, reservations }) {

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
