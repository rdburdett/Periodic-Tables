import React from "react";
import {
  Link
} from "react-router-dom";

import deleteReservation from "../../utils/deleteReservation";

function ReservationCard({ reservation, index }) {
  const avatarUrl = `https://avatars.dicebear.com/api/bottts/reservation${
    reservation.reservation_id * 17
  }.svg`;
  const areaCode = reservation.mobile_number.slice(0, 3);
  const localNumber = reservation.mobile_number.slice(4);

  return (
    <div className="card bg-secondary border-0 rounded-bottom my-3">
      {/* Last name as header */}
      <h2 className="card-header">{reservation.last_name}</h2>

      {/* Card image placeholder */}
      <img
        src={avatarUrl}
        className="p-3 card-img-top"
        alt="reservation avatar"
      />

      {/* Card main body */}
      <div className="card-footer">
        <h5 className="card-title">
          {reservation.first_name} {reservation.last_name}{" "}
        </h5>
        <p className="card-text">Party of {reservation.people}</p>
        <p className="card-text">Time: {reservation.reservation_time}</p>
        <p className="card-text">{`(${areaCode})${localNumber}`}</p>
      </div>

      {/* Action Buttons */}
      {/* <div className="card-header"> */}
      <div className="btn-group">
        {/* <Link
          to={`/reservations/${reservation.reservation_id}/edit`}
          className="btn btn-secondary"
        >
          Edit
        </Link> */}

        <button
          onClick={deleteReservation}
          className="p-1 btn rounded-left btn-secondary btn-shade"
        >
          Cancel
        </button>
        <Link to={`/reservations/${reservation.reservation_id}/edit`} className="p-1 btn rounded-0 btn-secondary btn-shade">
          Edit
        </Link>
        <button className="p-1 btn rounded-right btn-secondary btn-shade">
          Seat
        </button>
        {/* </div> */}
      </div>
    </div>
  );
}

export default ReservationCard;
