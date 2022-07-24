import React from "react";
import ReservationCard from "./ReservationCard";

function ReservationsList({ hideCancelled = false, reservations = [] }) {
  const reservationList = (
    <div className="row">
      {reservations.map((reservation, index) => {
        const validStatus = (
          (reservation.status === "booked") ||
          (reservation.status === "seated")
        )

        return hideCancelled && validStatus ? (
          <div key={reservation.reservation_id} className="col-6 col-sm-6 col-md-4 col-lg-4 mb-3">
            <ReservationCard
              key={index}
              reservation={reservation}
              index={index}
              isSeated={reservation.status==="seated"}
            />
          </div>
        ) : null;
      })}
    </div>
  )
  return reservations.length > 0 ? (
    reservationList
  ) : (
    "No reservations found for this date."
  );
}

export default ReservationsList;
