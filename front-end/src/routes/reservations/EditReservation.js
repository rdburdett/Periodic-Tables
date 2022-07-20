import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import * as api from "../../utils/api";
import ReservationForm from "./ReservationForm";

import ErrorAlert from "../../layout/ErrorAlert";
import { today, now } from "../../utils/date-time";
import * as format from "../../utils/format-phone-number"


function EditReservation() {
  const { reservationId } = useParams()
  const abortController = new AbortController();
  const [reservationsError, setReservationsError] = useState(null);

  // console.log(now());
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: today(),
    reservation_time: now(),
    people: 1,
  };
  
  const [formData, setFormData] = useState({ ...initialFormState });
  const history = useHistory();

  // Load initial reservation info
  useEffect(() => {
    const abortController = new AbortController();

    async function loadReservations() {
      setReservationsError(null);
      try {
        const data = await api.readReservation(reservationId, abortController.signal);
        // console.log("Data: ", data);
        // setReservation(data);
        setFormData(data)
      } catch (error) {
        setReservationsError(error);
      }
    }
    loadReservations();
    return () => abortController.abort();
  }, [reservationId]);


  // Fix mobile_number formatting during user input
  useEffect(() => {
    const inputElement = document.getElementById('mobile_number');
    inputElement.addEventListener('keydown', format.enforceFormat);
    inputElement.addEventListener('keyup', format.formatToPhone);
  })

  // Submit
  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log("Form data: ", formData)
    async function apiCall() {
      setReservationsError(null);
      try {
        await api.updateReservation(formData, abortController.signal);
        history.push(`/dashboard?date=${formData.reservation_date}`);
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

  // Change form
  const handleChange = ({ target }) => {
    let value = target.value;

    setFormData({
      ...formData,
      [target.name]: target.name === "people" ? Number(value) : value,
    });
  };

  // Log form data
  // console.log(
  //   "Form Data: ",
  //   formData
  //   // typeof (formData.people)
  // );

  return (
    <div className="container my-3">
      <h2>Edit Reservation</h2>
      <form onSubmit={handleSubmit}>
        <ReservationForm formData={formData} handleChange={handleChange} />
        <button
          type="button"
          onClick={() => history.goBack()}
          className="btn btn-secondary mr-2"
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-success">
          Save
        </button>
      </form>

      <ErrorAlert error={reservationsError} />
    </div>
  );
}

export default EditReservation;
