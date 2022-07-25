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
        <div className="col-xl-2 col-lg-2">
          <Menu />
        </div>
        <div className="col col-lg-8">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default Layout;
