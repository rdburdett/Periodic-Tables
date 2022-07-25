import React from "react";

import FinishTable from "./FinishTable";
import { groomStatus } from "../../utils/tools";

function TableCard({ table, index, reservationName }) {
    const { table_name, capacity, status, reservation_id } = table;

    const show = Boolean(table.reservation_id);
    return (
        <div className="card bg-secondary border-0 rounded-bottom my-3">
            {/* Last name as header */}
            <div className="card-header">
                <h3 className="">{table_name}</h3>
            </div>

            {/* Card title */}
            <div className="card-body">
                {/* Occupied/Free heading */}
                <h5
                    data-table-id-status={table.table_id}
                    className="text-light"
                >
                    <span
                        className={`oi ${
                            !table.reservation_id
                                ? "oi-circle-check brand-color"
                                : "oi-person text-warning"
                        }`}
                    />
                    {` ${groomStatus(status)}`}
                </h5>

                {/* Card text */}
                <p className="card-text">
                    {show && `Name: ${reservationName}`}
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
                    <span className="btn text-white disabled">Unoccupied</span>
                )}
            </div>
        </div>
    );
}

export default TableCard;
