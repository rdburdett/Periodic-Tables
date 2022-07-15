import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NewReservation from "../components/reservations/NewReservation";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import Search from "../components/search/Search";
import NewTable from "../components/tables/NewTable";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

function Routes() {
  return (
    <Switch>
      {/* DASHBOARD */}
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
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
