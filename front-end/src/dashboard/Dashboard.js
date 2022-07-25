// React imports
import React, { useEffect, useState } from "react";

import {
    Link,
    // useQuery
} from "react-router-dom";

// API imports
import { listTables, readByDate } from "../utils/api";

import * as dateTime from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../routes/reservations/ReservationsList.js";
import TablesList from "../routes/tables/TablesList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
    const [reservations, setReservations] = useState([]);
    const [tables, setTables] = useState([]);

    const [reservationsError, setReservationsError] = useState(null);
    const [tablesError, setTablesError] = useState(null);

    const dateString = new Date(`${date} PDT`).toDateString();

    // Get reservations
    useEffect(() => {
        const abortController = new AbortController();

        async function loadReservations() {
            setReservationsError(null);
            try {
                const data = await readByDate(date, abortController.signal);
                // console.log("Data: ", data);
                setReservations(data);
            } catch (error) {
                setReservationsError(error);
            }
        }
        loadReservations();
        return () => abortController.abort();
    }, [date]);

    // Get all tables
    useEffect(() => {
        const abortController = new AbortController();

        async function loadTables() {
            setReservationsError(null);
            try {
                const data = await listTables(abortController.signal);
                setTables(data);
            } catch (error) {
                setTablesError(error);
            }
        }

        loadTables();
        return () => abortController.abort();
    }, []);

    console.log("Reservations: ", reservations);
    console.log("Tables: ", tables);

    return (
        <main className="container my-3 p-3">
				
				{/* Dashboard */}
                <div id="dashboard" className="row">
                    <h1 className="col headingBar text-center">My Dashboard</h1>
                </div>

                {/* Prev, today, next */}
                <div
                    id="prev-today-next"
                    className="d-flex rounded btn-group my-3 p-3"
                >
                    <Link
                        to={`/dashboard?date=${dateTime.previous(date)}`}
                        className="border border-dark btn btn-secondary"
                    >
                        Previous
                    </Link>
                    <Link
                        to={`/dashboard`}
                        className="border border-dark btn btn-secondary btn-primary"
                    >
                        Today
                    </Link>
                    <Link
                        to={`/dashboard?date=${dateTime.next(date)}`}
                        className="border border-dark btn btn-secondary"
                    >
                        Next
                    </Link>
                </div>


            {/* Reservations List */}
            <div id="reservations-list" className="container my-3 p-3">
                <div className="headingBar text-center">
                    <h2>Reservations</h2>
                    <h6>{dateString}</h6>
                </div>
                <ErrorAlert error={reservationsError} />
                <ReservationsList
                    reservations={reservations}
                />
            </div>

            {/* Tables List */}
            <div id="tables-list" className="container my-3 p-3">
                <div className="headingBar text-center">
                    <h2>Tables</h2>
                </div>
                <ErrorAlert error={tablesError} />
                <TablesList tables={tables} reservations={reservations} />
            </div>
        </main>
    );
}

export default Dashboard;
