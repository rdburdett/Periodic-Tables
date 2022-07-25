import React from "react";
import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
    return (
        <nav className="navbar navbar-light align-items-start mt-3 w-100">
            <div className="container-fluid d-flex flex-column p-1">
                <Link
                    className="navbar-brand justify-content-center align-items-center sidebar-brand m-0"
                    to="/"
                >
                    <div className="sidebar-brand-text text-light mb-3">
                        <span className="mr-2 oi oi-beaker brand-color" />
                        Periodic Tables
                    </div>
                </Link>
                <hr className="sidebar-divider my-0" />
                <ul
                    className="nav navbar-nav text-light d-flex flex-row flex-lg-column flex-xl-column justify-content-center"
                    id="accordionSidebar"
                >
                    <div className="row mx-1">
                        <li className="nav-item mr-3">
                            <Link
                                className="nav-link text-light"
                                to="/dashboard"
                            >
                                <span className="mr-2 oi oi-dashboard" />
                                Dashboard
                            </Link>
                        </li>
                    </div>
                    <div className="row mx-1">
                        <li className="nav-item mr-3">
                            <Link className="nav-link text-light" to="/search">
                                <span className="mr-2 oi oi-magnifying-glass" />
                                Search
                            </Link>
                        </li>
                    </div>

                    <div className="row mx-1">
                        <li className="nav-item mr-3">
                            <Link
                                className="nav-link text-light"
                                to="/reservations/new"
                                style={{width: 140}}
                            >
                                <span className="mr-2 oi oi-plus" />
                                New Reservation
                            </Link>
                        </li>
                    </div>

                    <div className="row mx-1">
                        <li className="nav-item">
                            <Link
                                className="nav-link text-light"
                                to="/tables/new"
                            >
                                <span className="mr-2 oi oi-layers" />
                                New Table
                            </Link>
                        </li>
                    </div>
                </ul>
            </div>
        </nav>
    );
}

export default Menu;
