import React, { useEffect, useState } from "react";

import ReservationList from "../reservations/ReservationsList";
import SearchForm from "./SearchForm";
import ErrorAlert from "../../layout/ErrorAlert";

import { searchByMobileNumber } from "../../utils/api";
import { enforceFormat, formatToPhone } from "../../utils/tools";

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
        const inputElement = document.getElementById("mobile_number");
        inputElement.addEventListener("keydown", enforceFormat);
        inputElement.addEventListener("keyup", formatToPhone);
    });

    // Submit form
    const handleSubmit = (event) => {
        event.preventDefault();

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
    };

    return (
        <div id="search-page">
            <h1 className="text-center my-5">Search for a Reservation</h1>

            <form onSubmit={handleSubmit}>
                <SearchForm formData={formData} handleChange={handleChange} />
                <div className="btn-group mt-4 w-100">
                    <button type="submit" className="btn btn-proceed">
                        Find
                    </button>
                </div>
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
