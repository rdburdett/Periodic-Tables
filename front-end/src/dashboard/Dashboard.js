import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import useQuery from "../utils/useQuery";

import ErrorAlert from "../layout/ErrorAlert";
// import Card from "../components/reservations/Card.js";
import Reservations from "../routes/reservations/Reservations.js";
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

  const query = useQuery();
  const dateQuery = query.get("date");

  /////////

  if (dateQuery) date = dateQuery;

  // formats the date variable to be human readable
  const dateObj = new Date(`${date} PDT`);
  const dateString = dateObj.toDateString();

  console.log(dateString)

  /////////


  // useEffect(() => {
  //   loadDashboard()
  // }, [date])
  // useEffect(loadDashboard, [date]);

  // function loadDashboard() {
  //   const abortController = new AbortController();
  //   setReservationsError(null);
  //   listReservations({ date }, abortController.signal)
  //     .then(setReservations)
  //     .catch(setReservationsError);
  //   listTables(abortController.signal)
  //   .then(setTables)
  //   .catch(setReservationsError);
  //   return () => abortController.abort();
  // }

    ////////
  
    // Get request of reservations by date
    useEffect(() => {
      const abortController = new AbortController();
  
      async function loadReservations() {
        setReservationsError(null);
        try {
          const data = await listReservations({ date }, abortController.signal);
          setReservations(data);
        } catch (error) {
          setReservationsError(error);
        }
      }
      loadReservations();
      return () => abortController.abort();
    }, [date]);

    // loads all tables
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
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {/* {JSON.stringify(reservations)} */}
      <Reservations reservations={reservations} />
      <div className="mb-3 mx-3"> 
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
