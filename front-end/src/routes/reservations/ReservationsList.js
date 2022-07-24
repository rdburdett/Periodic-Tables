import React from "react";
import ReservationCard from "./ReservationCard";

function ReservationsList({ hideCancelled = false, reservations = [] }) {
  const reservationList = (
    // Main list column
    <div id="reservation-mapped-list" className="row">
      {reservations.map((reservation, index) => {
        // Mapped reservation card
        return (
          reservation.status !== "cancelled" && (
            <div
              key={reservation.reservation_id}
              className="col-6 col-sm-6 col-md-4 col-lg-4 mb-3"
            >
              <ReservationCard
                key={reservation.reservation_id}
                reservation={reservation}
                index={index}
              />
            </div>
          )
        );
      })}
    </div>
  );
  return reservations.length > 0
    ? reservationList
    : "No reservations found for this date.";
}

export default ReservationsList;
