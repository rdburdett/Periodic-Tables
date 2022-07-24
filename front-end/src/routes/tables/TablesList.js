import TableCard from "./TableCard";

const log = true;

function TablesList({ tables, reservations }) {
    log && console.log("tables: ", tables);
    log && console.log("reservations: ", reservations);

    // Get reservation name from table's reservation_id
    const getReservationName = (table) => {
        return reservations.filter(
            (reservation) => reservation.reservation_id === table.reservation_id
        );
    };

    return (
        <div className="card-columns">
            {!tables && "No available tables."}
            {tables.map((table) => (
                <TableCard
                    key={table.table_id}
                    table={table}
                    // reservationName={
                    //     // table.reservation_id ? getReservationName(table)[0].last_name : null
                    // }
                />
            ))}
        </div>
    );
}

export default TablesList;
