import FinishTable from "./FinishTable";

function TableDetail({ tables = [], reservations = [] }) {
  console.log("tables: ", tables);
  console.log("reservations: ", reservations)
  const getReservationName = (tableResId) => {
    return (reservations.filter((reservation) => reservation.reservation_id === tableResId)[0].last_name)
  }
  return (
    <div className="table-responsive">
      <table className="table table-striped bg-dark text-white">
        <thead>
          <tr className="">
            <th scope="col">Table</th>
            <th scope="col">Reservation</th>
            <th scope="col">Capacity</th>
            <th scope="col">Availability</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {!tables && "No available tables."}
          {tables.map((table) => (
            <tr key={table.table_id}>
              {/* <th scope="row">{table.table_id}</th> */}
              <th scope="row">{table.table_name}</th>
              <td>
                {table.reservation_id ? getReservationName(table.reservation_id) : null }
              </td>
              <td>{table.capacity}</td>

              <td data-table-id-status={table.table_id}>
                {table.reservation_id ? (
                  <span className="text-warning">occupied</span>
                ) : (
                  <span className="text-success">available</span>
                )}
              </td>
              {/*'Finish' button will be displayed if the table is occupied */}
              <td>
                {table.reservation_id && (
                  <FinishTable table_id={table.table_id} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableDetail;
