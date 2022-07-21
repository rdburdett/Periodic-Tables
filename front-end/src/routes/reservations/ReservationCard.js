import React from "react";
import {
  Link,
  useHistory
} from "react-router-dom";

import { updateReservationStatus } from "../../utils/api";

// import deleteReservation from "../../utils/deleteReservation";

function ReservationCard({ reservation, index }) {
  const avatarUrl = `https://avatars.dicebear.com/api/bottts/reservation${
    reservation.reservation_id * 17
  }.svg`;
  const areaCode = reservation.mobile_number.slice(0, 3);
  const localNumber = reservation.mobile_number.slice(4);
  const groomedReservationStatus = reservation.status && `${reservation.status[0].toUpperCase()}${reservation.status.slice(1)}`
  const history = useHistory();

  // Handle cancel button action
  const handleCancel = async ({ target }) => {
    const abortController = new AbortController();
    // const value = target.value;
    const confirmedCancel = window.confirm(
      `Do you want to cancel this reservation? This cannot be undone.`
    );
    if (confirmedCancel) {
      async function deleteData() {
        try {
          await updateReservationStatus({
              ...reservation,
              status: "cancelled"
            },
            abortController.signal
          );
          history.go(0);
        } catch (error) {
          if (error.name === "AbortError") {
            // Ignore `AbortError`
            console.log("Aborted");
          } else {
            throw error;
          }
        }
      }
      deleteData();
    }
  };

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
        <h5 className="card-title">
          {reservation.first_name} {reservation.last_name}{" "}
        </h5>
        <p className="card-text">Party of {reservation.people}</p>
        <p className="card-text">Status: {groomedReservationStatus}</p>
        <p className="card-text">Time: {reservation.reservation_time}</p>
        <p className="card-text">{`(${areaCode})${localNumber}`}</p>
      </div>

      {/* Action Buttons */}
      {/* <div className="card-header"> */}
      <div className="btn-group">
        {/* Cancel button */}
        <button
          onClick={handleCancel}
          className="p-1 btn rounded-left btn-secondary btn-shade"
          value={reservation.reservation_id}
          data-reservation-id-cancel={reservation.reservation_id}>
          Cancel
        </button>

        {/* Edit button */}
        <Link
          to={`/reservations/${reservation.reservation_id}/edit`} className="p-1 btn rounded-0 btn-secondary btn-shade">
          Edit
        </Link>

        {/* Seat button */}
        <Link
          to={`/reservations/${reservation.reservation_id}/seat`}
          className="p-1 btn rounded-right btn-secondary btn-shade">
          Seat
        </Link>

      </div>
    </div>
  );
}

export default ReservationCard;
