import React from "react";
// import InputMask from "react-input-mask"

const ReservationForm = ({ formData, handleChange }) => {
  return (
    <div>
      {/* First Name */}
      <div className="form-group">
        <label>First Name</label>
        <input
          className="form-control"
          id="first_name"
          type="text"
          name="first_name"
          placeholder={`ex. John`}
          onChange={handleChange}
          value={formData.first_name}
          style={{ width: "50%" }}
          required
        />
      </div>

      {/* Last Name */}
      <div className="form-group">
        <label>Last Name</label> <br />
        <input
          className="form-control"
          id="last_name"
          type="text"
          name="last_name"
          placeholder={`ex. Doe`}
          onChange={handleChange}
          value={formData.last_name}
          style={{ width: "50%" }}
          required
        />
      </div>

      {/* Mobile Number */}
      <div className="form-group">
        <label>Mobile Number</label> <br />
        <input
          className="form-control"
          id="mobile_number"
          type="text"
          name="mobile_number"
          maxLength={12}
          placeholder={`ex. "123-456-7890"`}
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          onChange={handleChange}
          value={formData.mobile_number}
          style={{ width: "50%" }}
          required
        />
        <small id="phoneNumberHelp" className="form-text text-muted">Format: 123-456-7890</small>
      </div>

      {/* Reservation Date */}
      <div className="form-group">
        <label>Reservation Date</label>
        <input
          className="form-control"
          id="reservation_date"
          type="date"
          name="reservation_date"
          onChange={handleChange}
          value={formData.reservation_date}
          style={{ width: "50%" }}
          required
        />
      </div>

      {/* Reservation Time */}
      <div className="form-group">
        <label>Reservation Time</label>
        <input
          className="form-control"
          id="reservation_time"
          type="time"
          name="reservation_time"
          onChange={handleChange}
          value={formData.reservation_time}
          style={{ width: "50%" }}
          required
        />
      </div>

      {/* Number of people in the party */}
      <div className="form-group">
        <label>Number of people in the party</label>
        <input
          className="form-control"
          id="people"
          type="number"
          name="people"
          onChange={handleChange}
          value={formData.people}
          style={{ width: "50%" }}
          required
        />
        <small id="capacityHelp" className="form-text text-muted">
          Party size must be at least 1.
        </small>
      </div>
    </div>
  );
};
export default ReservationForm;
