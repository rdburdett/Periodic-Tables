import React from "react";
import ReservationCard from "./ReservationCard";

function ReservationsList({ reservations = [] }) {
  return reservations.length > 0 ? (
    <div className="row">
      {reservations.map((reservation, index) => (
        <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-3">
          <ReservationCard
            key={index}
            reservation={reservation}
            index={index}
          />
        </div>
      ))}
    </div>
  ) : (
    "No current reservations for this date."
  );
}

export default ReservationsList;
