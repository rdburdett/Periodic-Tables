import React from "react";

function Card({ reservation }) {
  return (
    <div className="container">
      <h2>Card</h2>
      <h3>{reservation.first_name}, {reservation.last_name}</h3>
      <div>{reservation.reservation_date}</div>
    </div>
  )
}

export default Card