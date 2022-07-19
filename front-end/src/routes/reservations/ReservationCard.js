import React from "react";

function ReservationCard({ reservation }) {
  return (
    <div className="container card">
      <h2 className="card-header">{reservation.last_name}</h2>
      <div className="card-body">
        <h3>{reservation.first_name} </h3>
        {reservation.reservation_date}
      </div>
    </div>
  )
}

export default ReservationCard