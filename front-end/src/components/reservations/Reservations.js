import React from "react";
import Card from "./Card";

function Reservations({ reservations = [] }) {
  console.log("reservations: ", reservations)
  
  return reservations.length > 0 ? (
    <div className="container">
      {reservations.map((element, index) => (
      <Card key={index} reservation={element} />
    ))}
    </div>
  ) : "No current reservations"
}

export default Reservations