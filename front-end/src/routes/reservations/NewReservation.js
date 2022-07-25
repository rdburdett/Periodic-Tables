import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../../utils/api";
import ReservationForm from "./ReservationForm";

import ErrorAlert from "../../layout/ErrorAlert";
import { today, now } from "../../utils/date-time";
import { enforceFormat, formatToPhone } from "../../utils/tools"

function NewReservation() {
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

    // Fix mobile_number formatting during user input
    useEffect(() => {
        const inputElement = document.getElementById("mobile_number");
        inputElement.addEventListener("keydown", enforceFormat);
        inputElement.addEventListener("keyup", formatToPhone);
    });

    // Submit
    const handleSubmit = (event) => {
        event.preventDefault();
        async function apiCall() {
            setReservationsError(null);
            try {
                await createReservation(formData, abortController.signal);
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
        setFormData({
            ...formData,
            [target.name]:
                target.name === "people" ? Number(target.value) : target.value,
        });
    };

    return (
        <div className="container my-3">
            <h2>Create a New Reservation</h2>

            <form onSubmit={handleSubmit}>
                {/* Reservation Form */}
                <ReservationForm
                    formData={formData}
                    handleChange={handleChange}
                />

                {/* Buttons */}
                <button
                    type="button"
                    onClick={() => history.goBack()}
                    className="btn btn-secondary mr-2"
                >
                    Cancel
                </button>
                <button type="submit" className="btn btn-success">
                    Submit
                </button>
            </form>

            <ErrorAlert error={reservationsError} />
        </div>
    );
}

export default NewReservation;
