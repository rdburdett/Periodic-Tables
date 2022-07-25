import React from "react";
import Menu from "./Menu.js";
import Routes from "./Routes.js";

import "./Layout.css";

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {
    return (
        <div className="container-fluid bg-dark text-light min-vh-100">
            <div className="row h-100">
                <div className="col-lg-2 col-xl-2 mw-100">
                    <Menu />
                </div>
                <div className="col col-lg-8">
                    <div className="my-3 row mx-auto justify-content-center">
                        <Routes />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;
