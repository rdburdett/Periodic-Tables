import React from "react";
import ReservationCard from "./ReservationCard";

function ReservationsList({ hideCancelled = false, reservations = [] }) {
  return reservations.length > 0 ? (
    <div className="row">
      {reservations.map((reservation, index) => {
        const validStatus = ((
          reservation.status !== "booked"))

        return hideCancelled && validStatus ? null : (
          <div key={index} className="col-sm-6 col-md-4 col-lg-4 mb-3">
            <ReservationCard
              key={index}
              reservation={reservation}
              index={index}
            />
          </div>
        );
      })}
    </div>
  ) : (
    "No reservations found for this date."
  );
}

export default ReservationsList;
