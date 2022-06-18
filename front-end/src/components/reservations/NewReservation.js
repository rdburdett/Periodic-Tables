import React, { useState } from "react";

function NewReservation() {
  const { reservation, setReservation } = useState("mock reservation")

  return (
    <div className="container">
      <h2>New Reservation</h2>
      <h3>Create a New Reservation</h3>
      <div>Form here</div>
      <div>{reservation}</div>
      <button>Cancel</button><button>Create</button>
    </div>
  )
}

export default NewReservation