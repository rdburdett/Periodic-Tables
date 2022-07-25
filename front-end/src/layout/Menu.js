import React from "react";
import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <nav className="navbar navbar-light align-items-start p-2 mt-3">
      <div className="container-fluid d-flex flex-column p-0">
        <Link
          className="navbar-brand justify-content-center align-items-center sidebar-brand m-0"
          to="/"
        >
          <div className="sidebar-brand-text text-light mb-3">
            <span className="mr-2 oi oi-beaker brand-color"/>Periodic Tables
          </div>
        </Link>
        <hr className="sidebar-divider my-0" />
        <ul className="nav navbar-nav text-light d-flex flex-row flex-lg-column flex-xl-column" id="accordionSidebar">
          <li className="nav-item p-1">
            <Link className="nav-link text-light" to="/dashboard">
              <span className="mr-2 oi oi-dashboard" />
              Dashboard
            </Link>
          </li>
          <li className="nav-item p-1">
            <Link className="nav-link text-light" to="/search">
              <span className="mr-2 oi oi-magnifying-glass" />
              Search
            </Link>
          </li>
          <li className="nav-item p-1">
            <Link className="nav-link text-light" to="/reservations/new">
              <span className="mr-2 oi oi-plus" />
              New Reservation
            </Link>
          </li>
          <li className="nav-item p-1">
            <Link className="nav-link text-light" to="/tables/new">
              <span className="mr-2 oi oi-layers" />
              New Table
            </Link>
          </li>
        </ul>
        {/* <div className="text-center d-none d-md-inline">
          <button
            className="btn rounded-circle border-0"
            id="sidebarToggle"
            type="button"
          >Toggle</button>
        </div> */}
      </div>
    </nav>
  );
}

export default Menu;
