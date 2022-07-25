import React from "react";
import ReservationCard from "./ReservationCard";

function ReservationsList({ reservations = [] }) {
    const reservationList = (
        // Main list column
        <div id="reservation-mapped-list" className="card-columns">
            {/* Map reservation cards, filtering out 'cancelled' reservations */}
            {reservations.map(
                (reservation, index) =>
                    reservation.status !== "cancelled" && (
                        <ReservationCard
                            key={reservation.reservation_id}
                            reservation={reservation}
                            index={index}
                        />
                    )
            )}
        </div>
    );

    return reservations.length > 0
        ? reservationList
        : "No reservations found for this date.";
}

export default ReservationsList;
