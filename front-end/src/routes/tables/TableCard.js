import FinishTable from "./FinishTable";
import { groomStatus } from "../../utils/tools";

function TableCard({ table, index, reservations }) {
  const { table_name, capacity, status, reservation_id } = table;

  // Get reservation name from table's reservation_id
  const resName = reservations.filter(
    (reservation) => reservation.reservation_id === table.reservation_id
  )[0];

  const show = Boolean(table.reservation_id) && reservations.length;
  return (
    <div className="card bg-secondary border-0 rounded-bottom my-4">
      {/* Last name as header */}
      <div className="card-header">
        <h3 className="">{table_name}</h3>
      </div>

      {/* Card title */}
      <div className="card-body">
        {/* Occupied/Free heading */}
        <h5 data-table-id-status={table.table_id} className="text-light">
          <span
            className={`oi ${
              !table.reservation_id
                ? "oi-circle-check brand-color mr-2"
                : "oi-person text-warning mr-2"
            }`}
          />
          {`${groomStatus(status)}`}
        </h5>

        {/* Card text */}
        <p className="card-text">
          {show && `Name: ${resName && resName.last_name}`}
          <br />
          {show && `Reservation ID: ${reservation_id}`}
          <br />
          {`Capacity: ${capacity}`}
        </p>
      </div>

      {/* Finish button */}
      <div className="btn-group w-100">
        {table.reservation_id ? (
          <FinishTable
            table_id={table.table_id}
            reservation_id={table.reservation_id}
          />
        ) : (
          <span className="py-2 p-1 btn text-white disabled">Unoccupied</span>
        )}
      </div>
    </div>
  );
}

export default TableCard;
