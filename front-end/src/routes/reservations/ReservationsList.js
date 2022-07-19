import React from "react";
import ReservationCard from "./ReservationCard";

function ReservationsList({ reservations = [] }) {  
  return reservations.length > 0 ? (
    <div className="container card-group">
      {reservations.map((reservation, index) => (
        <ReservationCard key={index} reservation={reservation} />
      ))}
    </div>
  ) : "No current reservations for this date."
}

export default ReservationsList