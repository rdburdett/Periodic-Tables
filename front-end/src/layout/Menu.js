import React from "react";
import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <nav className="navbar navbar-light align-items-start p-0 mt-3">
      <div className="container-fluid d-flex flex-column p-0">
        <Link
          className="navbar-brand justify-content-center align-items-center sidebar-brand m-0"
          to="/"
        >
          <div className="sidebar-brand-text text-light mx-3">
            <span>Periodic Tables</span>
          </div>
        </Link>
        <hr className="sidebar-divider my-0" />
        <ul className="nav navbar-nav text-light d-flex flex-row flex-lg-column flex-xl-column" id="accordionSidebar">
          <li className="nav-item p-1">
            <Link className="nav-link text-light" to="/dashboard">
              <span className="oi oi-dashboard brand-color" />
              &nbsp;Dashboard
            </Link>
          </li>
          <li className="nav-item p-1">
            <Link className="nav-link text-light" to="/search">
              <span className="oi oi-magnifying-glass brand-color" />
              &nbsp;Search
            </Link>
          </li>
          <li className="nav-item p-1">
            <Link className="nav-link text-light" to="/reservations/new">
              <span className="oi oi-plus brand-color" />
              &nbsp;New Reservation
            </Link>
          </li>
          <li className="nav-item p-1">
            <Link className="nav-link text-light" to="/tables/new">
              <span className="oi oi-layers brand-color" />
              &nbsp;New Table
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
