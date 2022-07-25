import React from "react";
import { Link, useHistory } from "react-router-dom";

import { updateReservationStatus } from "../../utils/api";
import { groomPhone, groomStatus, generateAvatar } from "../../utils/tools";

function ReservationCard({ reservation }) {
    const {
        first_name,
        last_name,
        people,
        status,
        mobile_number,
        reservation_id,
        reservation_time,
    } = reservation;

    const history = useHistory();

    // Handle cancel button action
    const handleCancel = async ({ target }) => {
        const abortController = new AbortController();
        const confirmedCancel = window.confirm(
            `Do you want to cancel this reservation? This cannot be undone.`
        );
        if (confirmedCancel) {
            async function deleteData() {
                try {
                    await updateReservationStatus(
                        {
                            ...reservation,
                            status: "cancelled",
                        },
                        abortController.signal
                    );
                    history.go(0);
                } catch (error) {
                    if (error.name === "AbortError") {
                        // Ignore `AbortError`
                        console.log("Aborted");
                    } else {
                        throw error;
                    }
                }
            }
            deleteData();
        }
    };

    return (
        <div className="card bg-secondary border-0 rounded-bottom my-3">
            {/* Last name as header */}
            <div className="card-header">
                <h2 className="card-title">{last_name}</h2>
                {/* Card avatar image */}
                <img
                    src={generateAvatar(reservation_id)}
                    className=" card-img-top"
                    alt="reservation avatar"
                />
            </div>

            {/* Card main body */}
            <div className="card-body">
                <h4 className="card-title">
                    {first_name} {last_name}
                    <br />
                    {reservation_time}
                </h4>
                {/* Card title with status */}
                <h5 className="text-light">{groomStatus(status)}</h5>
                <p
                    className="card-text"
                    data-reservation-id-status={reservation_id}
                >
                    Party of {people}
                    <br />


                    Reservation ID: {reservation_id}
                    <br />
                    {groomPhone(mobile_number)}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="btn-group w-100">
                {/* Cancel button */}
                {status === "seated" ? null : (
                    <button
                        onClick={handleCancel}
                        className="p-1 btn btn-secondary btn-shade hover-danger animate"
                        value={reservation_id}
                        data-reservation-id-cancel={reservation_id}
                    >
                        Cancel
                    </button>
                )}

                {/* Edit button */}
                <Link
                    to={`/reservations/${reservation_id}/edit`}
                    className="p-1 btn btn-secondary btn-shade hover-warning animate"
                >
                    Edit
                </Link>

                {/* Seat button */}
                {status === "seated" ? null : (
                    <Link
                        to={`/reservations/${reservation_id}/seat`}
                        className="p-1 btn rounded-right btn-secondary btn-shade hover-brand-color animate"
                    >
                        Seat
                    </Link>
                )}
            </div>
        </div>
    );
}

export default ReservationCard;
