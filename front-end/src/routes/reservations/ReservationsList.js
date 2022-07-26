import React from "react";
import ReservationCard from "./ReservationCard";
import NewCard from "./NewCard";

function ReservationsList({ reservations = [] }) {
    const reservationList = (
        // Main list column
        <div>
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
            <NewCard />
            </div>

        </div>
    );

    const addNewCard = (
        <div id="add-card" className="card-columns">
            <p className="text-secondary">
                No reservations found for this date.
            </p>
            <NewCard />
        </div>
    );

    return reservations.length > 0 ? reservationList : addNewCard;
}

export default ReservationsList;
