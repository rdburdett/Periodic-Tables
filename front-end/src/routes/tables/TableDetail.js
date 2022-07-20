import FinishTable from "./FinishTable"

function TableDetail ({ tables = [] }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          <tr className="bg-dark text-white">
            <th scope="col">#</th>
            <th scope="col">Description</th>
            <th scope="col">Capacity</th>
            <th scope="col">Availability</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {!tables && "No available tables."}
          {tables.map((table) => (
            <tr key={table.table_id}>
            <th scope="row">{table.table_id}</th>
            <td>{table.table_name}</td>
            <td>{table.capacity}</td>
      
            <td data-table-id-status={table.table_id}>
              {table.reservation_id ? "occupied" : "free"}
            </td>
            {/*'Finish' button will be displayed if the table is occupied */}
              <td>{table.reservation_id && <FinishTable table_id={table.table_id} />}</td>
              
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableDetail