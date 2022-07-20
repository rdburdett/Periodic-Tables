import React from "react";

import {
  Redirect,
  Route,
  Switch,
  useLocation
} from "react-router-dom";

import Dashboard from "../dashboard/Dashboard";
import NewReservation from "../routes/reservations/NewReservation";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import Search from "../routes/search/Search";
import NewTable from "../routes/tables/NewTable";
import EditReservation from "../routes/reservations/EditReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

function Routes() {
  const params = new URLSearchParams(useLocation().search);
  const date = params.get("date");
  return (
    <Switch>
      {/* DASHBOARD */}
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route path="/dashboard">
        <Dashboard date={date ? date : today()} />
      </Route>

      {/* SEARCH */}
      <Route exact={true} path="/search">
        <Search />
      </Route>

      {/* RESERVATIONS */}
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation />
      </Route>

      <Route exact={true} path="/reservations/:reservationId/edit">
        {/* <NewReservation /> */}
        <EditReservation />
      </Route>

      {/* TABLES */}
      <Route exact={true} path="/tables/new">
        <NewTable />
      </Route>

      {/* ERROR HANDLING */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
