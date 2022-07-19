// React imports
import React, {
  useEffect,
  useState
} from "react";

import {
  Link,
  // useQuery
} from "react-router-dom";

// API imports
import {
  // listReservations,
  listTables,
  readByDate
} from "../utils/api";

import * as dateTime from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../routes/reservations/ReservationsList.js";
import TableDetail from "../routes/tables/TableDetail";

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

  const dateString = (new Date(`${date} PDT`)).toDateString();

  // Get reservations
  useEffect(() => {
    const abortController = new AbortController();

    async function loadReservations() {
      setReservationsError(null);
      try {
        const data = await readByDate(date, abortController.signal);
        console.log("Data: ", data)
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

  return (
    <main>
      <h1>Dashboard</h1>

      {/* Prev, today, next */}
      <div className="container d-md-flex mb-3">
        <div className="btn-group">
          <Link to={`/dashboard?date=${dateTime.previous(date)}`} className="btn btn-dark">
            Previous
          </Link>
          <Link to={`/dashboard`} className="btn btn-success">
            Today
          </Link>
          <Link to={`/dashboard?date=${dateTime.next(date)}`} className="btn btn-dark">
            Next
          </Link>
        </div>
      </div>

      {/* Reservations List */}
      <div className="container">
      <div className="headingBar my-3 p-2">
          <h2>Reservations for {dateString}</h2>
        </div>
        <ErrorAlert error={reservationsError} />
        <ReservationsList reservations={reservations} />
      </div>
      {/* Tables List */}
      <div className="container">
        <div className="headingBar my-3 p-2">
          <h2>Tables</h2>
        </div>
        <ErrorAlert error={tablesError} />
        <TableDetail tables={tables} />
      </div>
    </main>
  );
}

export default Dashboard;
