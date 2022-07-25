import React, { useEffect, useState } from "react";
import {
    readReservation,
    listTables,
    seatTable,
    updateReservationStatus,
    // updateReservation,
} from "../../utils/api";
import ErrorAlert from "../../layout/ErrorAlert";
import { useParams, useHistory } from "react-router-dom";
import SeatReservationCard from "./SeatReservationCard";

/**
 * Defines the Seat page.
 * This page will take the reservation_id from the params and
 * display the reservation info and then show a list of tables
 * in an adjacet card to select to seat a reservation.
 */

function SeatReservation() {
    const params = useParams();
    const reservation_id = params.reservationId;

    const [reservation, setReservation] = useState();
    const [tables, setTables] = useState([]);
    const history = useHistory();

    const [reservationsError, setReservationsError] = useState(null);
    const [tablesError, setTablesError] = useState(null);
    const [seatingError, setSeatingError] = useState({
        message: "Please select a table",
    });
    const initialFormState = {
        table_id: "x",
    };
    const [formData, setFormData] = useState({ ...initialFormState });

    // Get reservations
    useEffect(() => {
        const abortController = new AbortController();

        async function loadReservations() {
            setReservationsError(null);
            try {
                const data = await readReservation(
                    reservation_id,
                    abortController.signal
                );
                // console.log("Data: ", data);
                setReservation(data);
            } catch (error) {
                setReservationsError(error);
            }
        }
        loadReservations();
        return () => abortController.abort();
    }, [reservation_id]);

    // Get Free tables
    useEffect(() => {
        const abortController = new AbortController();

        async function loadTables() {
            setReservationsError(null);
            try {
                const data = await listTables(abortController.signal);
                setTables(data.filter((table) => table.status === "Free"));
            } catch (error) {
                setTablesError(error);
            }
        }

        loadTables();
        return () => abortController.abort();
    }, []);

    const handleSubmit = (event) => {
        const abortController = new AbortController();

        event.preventDefault();
        if (seatingError === null) {
            async function updateData() {
                try {
                    await seatTable(
                        formData.table_id,
                        reservation_id,
                        abortController.signal
                    );
                    await updateReservationStatus(
                        {
                            ...reservation,
                            table_id: formData.table_id,
                            status: "seated",
                        },
                        abortController.signal
                    );
                    history.push(`/dashboard`);
                } catch (error) {
                    if (error.name === "AbortError") {
                        // Ignore `AbortError`
                        console.log("Aborted");
                    } else {
                        setSeatingError(error);
                    }
                }
            }
            updateData();
            return () => {
                abortController.abort();
            };
        }
    };
    const handleChange = ({ target }) => {
        let value = target.value;
        let matchedTable = tables.filter(
            (table) => table.table_id === Number(value)
        );
        //if the ---select a table--- or a table without enough capacity are chosen, set an error
        if (value === "x") {
            setSeatingError({ message: "Please select a table" });
        } else {
            if (reservation.people > matchedTable[0].capacity) {
                setSeatingError({
                    message: "That table does not have enough capacity",
                });
            } else {
                //else remove all errors.
                setSeatingError(null);
            }
        }
        setFormData({
            ...formData,
            [target.name]: value,
        });
    };

    return (
        <main id="seat-reservation-page">
            <h1 className="text-center">Seat Party</h1>
            <ErrorAlert error={reservationsError} />
            <ErrorAlert error={tablesError} />
            <ErrorAlert error={seatingError} />

            <div className="d-md-flex mb-3">
                {/* Reservation Card */}
                <div className="col-sm-6">
                    {reservation ? (
                        <SeatReservationCard reservation={reservation} />
                    ) : (
                        "Cannot find reservation."
                    )}
                </div>

                {/* Select Table */}
                <div className="col-sm-6">
                    <div className="card text-white bg-secondary my-3">
                        {/* Card Header */}
                        <div className="card-header">
                            <h4>Select a Table</h4>
                        </div>

                        {/* Card Body */}
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <select
                                    name="table_id"
                                    onChange={handleChange}
                                    className="form-control mb-4"
                                    value={formData.table_id}
                                >
                                    <option value="x">
                                        {"Table # - capacity"}
                                    </option>
                                    {tables.map((table) => (
                                        <option
                                            value={table.table_id}
                                            key={table.table_id}
                                        >
                                            {table.table_name} -{" "}
                                            {table.capacity}
                                        </option>
                                    ))}
                                </select>

                                <div className="btn-group w-100">
                                    <button
                                        type="button"
                                        onClick={() => history.goBack()}
                                        className="btn btn-secondary btn-shade mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-proceed"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div></div>
        </main>
    );
}

export default SeatReservation;
