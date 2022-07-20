import React from "react";

function ReservationCard({ reservation, index }) {
  const avatarUrl = `https://avatars.dicebear.com/api/bottts/reservation${
    reservation.reservation_id * 18
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
        <p className="card-text">{`(${areaCode})${localNumber}`}</p>
      </div>
      {/* Action Buttons */}
      {/* <div className="card-header"> */}
        <div className="btn-group">

          <button className="p-1 btn rounded-left btn-secondary btn-shade">Cancel</button>
          <button className="p-1 btn rounded-0 btn-secondary btn-shade">Edit</button>
          <button className="p-1 btn rounded-right btn-secondary btn-shade">Seat</button>
        {/* </div> */}
      </div>
    </div>
  );
}

export default ReservationCard;
