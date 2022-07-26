import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import * as api from "../../utils/api";
import ReservationForm from "./ReservationForm";

import ErrorAlert from "../../layout/ErrorAlert";
import { today, now } from "../../utils/date-time";
import { enforceFormat, formatToPhone } from "../../utils/tools"



function EditReservation() {
  const { reservationId } = useParams()
  const abortController = new AbortController();
  const [reservationsError, setReservationsError] = useState(null);

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
    inputElement.addEventListener('keydown', enforceFormat);
    inputElement.addEventListener('keyup', formatToPhone);
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
  // typeof (formData.people)
  // );

  return (
    <main id="edit-reservation-page">
      <h1 className="text-center">Edit Reservation</h1>
      <ErrorAlert error={reservationsError} />

      <form onSubmit={handleSubmit}>
        <ReservationForm formData={formData} handleChange={handleChange} />
        <button
          type="button"
          onClick={() => history.goBack()}
          className="btn btn-secondary mr-2"
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-proceed">
          Submit
        </button>
      </form>

    </main>
  );
}

export default EditReservation;
