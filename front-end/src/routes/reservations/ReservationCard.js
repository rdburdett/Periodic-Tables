import React from "react";
import { Link, useHistory } from "react-router-dom";

import { updateReservationStatus } from "../../utils/api";
import groomPhone from "../../utils/groomPhone";
import groomStatus from "../../utils/groomStatus";

// import deleteReservation from "../../utils/deleteReservation";

function ReservationCard({ reservation, index }) {
  const {
    first_name,
    last_name,
    people,
    status,
    mobile_number,
    reservation_id,
    reservation_time,
  } = reservation;

  const avatarUrl = `https://avatars.dicebear.com/api/bottts/reservation${
    reservation.reservation_id * 17
  }.svg`;
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
          await updateReservationStatus(
            {
              ...reservation,
              status: "cancelled",
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
        <h4 className="card-title">
          {first_name} {last_name}
          <br />
          {reservation_time}
        </h4>
        <p className="card-text">
          Party of {people}
          <br />
          Status: {groomStatus(status)}
          <br />
          Reservation ID: {reservation_id}
        </p>
        <p className="card-text">{groomPhone(mobile_number)}</p>
      </div>

      {/* Action Buttons */}
      {/* <div className="card-header"> */}
      <div className="btn-group">
        {/* Cancel button */}
        {status === "cancelled" ? null : (
          <button
            onClick={handleCancel}
            className="p-1 btn btn-secondary btn-shade"
            value={reservation_id}
            data-reservation-id-cancel={reservation_id}
          >
            Cancel
          </button>
        )}

        {/* Edit button */}
        <Link
          to={`/reservations/${reservation_id}/edit`}
          className="p-1 btn btn-secondary btn-shade"
        >
          Edit
        </Link>

        {/* Seat button */}
        {status === "cancelled" ? null : (
          <Link
            to={`/reservations/${reservation_id}/seat`}
            className="p-1 btn rounded-right btn-secondary btn-shade"
          >
            Seat
          </Link>
        )}
      </div>
    </div>
  );
}

export default ReservationCard;
