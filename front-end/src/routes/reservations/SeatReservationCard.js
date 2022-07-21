import React from "react";

import groomPhone from "../../utils/groomPhone";
import groomStatus from "../../utils/groomStatus";

// import deleteReservation from "../../utils/deleteReservation";

function SeatReservationCard({ reservation }) {
  const avatarUrl = `https://avatars.dicebear.com/api/bottts/reservation${
    reservation.reservation_id * 17
  }.svg`;

  return (
    <div className="card bg-secondary border-0 rounded-bottom my-3">
      {/* Last name as header */}
      <h2 className="card-header">{reservation.last_name}</h2>

      {/* Card avatar image */}
      <img
        src={avatarUrl}
        className="p-3 card-img-top"
        alt="reservation avatar"
      />

      {/* Card main body */}
      <div className="card-footer">
        <h4 className="card-title">
          {reservation.first_name} {reservation.last_name}
          <br />
          {reservation.reservation_time}
        </h4>
        <p className="card-text">
          Party of {reservation.people}
          <br />
          Status: {reservation ? groomStatus(reservation.status) : null}
        </p>
        <p className="card-text">{reservation ? groomPhone(reservation.mobile_number) : null}</p>
      </div>
    </div>
  );
}

export default SeatReservationCard;
