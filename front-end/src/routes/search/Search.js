import React, { useEffect, useState } from "react";

import ReservationList from "../reservations/ReservationsList";
import SearchForm from "./SearchForm";
import ErrorAlert from "../../layout/ErrorAlert";

import { searchByMobileNumber } from "../../utils/api";
import * as format from "../../utils/format-phone-number"

function NewTable() {
  const abortController = new AbortController();
  const [reservationsError, setReservationsError] = useState(null);
  const [reservations, setReservations] = useState([]);

  const initialFormState = {
    mobile_number: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });

  // Fix mobile_number formatting during user input
  useEffect(() => {
    const inputElement = document.getElementById('mobile_number');
    inputElement.addEventListener('keydown', format.enforceFormat);
    inputElement.addEventListener('keyup', format.formatToPhone);
  })

  // Submit form
  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log("Form data: ", formData);

    async function apiCall() {
      try {
        const output = await searchByMobileNumber(
          formData.mobile_number,
          abortController.signal
        );
        setReservations(output);
      } catch (error) {
        if (error.name === "AbortError") {
          // Ignore `AbortError`
          console.log("Aborted");
        } else {
          setReservationsError(error);
        }
      }
    }
    apiCall();
    return () => {
      abortController.abort();
    };
  };

  // Update
  const handleChange = ({ target }) => {
    let value = target.value;

    // Make sure capacity cannot be set below
    if (target.name === "capacity" && target.value <= 0) {
      value = 1;
    }

    setFormData({
      ...formData,
      // Ensure that the value of 'capacity' remains a number when setting form data
      [target.name]: value,
    });

    // console.log("Form Data: ", formData, typeof formData.capacity);
  };

  return (
    <div className="container my-3">
      <h2>Search for a Reservation</h2>
      <form onSubmit={handleSubmit}>
        <SearchForm formData={formData} handleChange={handleChange} />
        <button type="submit" className="btn btn-success">
          Find
        </button>
      </form>
      <ErrorAlert error={reservationsError} />
      <div className="my-3">
        {reservations.length ? <h5>Matching Reservations:</h5> : null}
        <ReservationList reservations={reservations} />
      </div>
    </div>
  );
}

export default NewTable;
