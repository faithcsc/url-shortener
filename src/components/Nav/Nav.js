import React from "react";
import CopyButton from "../Main/CopyButton";
import DeleteButton from "../Main/DeleteButton";
import AuthButton from "../Main/AuthButton";

function Nav() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light static-top header-a">
      <div className="container nav-container">
        <a className="navbar-brand brand" href={window.location.origin}>
          URL Shortener
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse alink"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav ml-auto">
            {/* <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Courses
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="#">
                  Action
                </a>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </div>
            </li>

            <li className="nav-item active">
              <a className="nav-link" href="/links">
                Why Us <span className="sr-only">(current)</span>
              </a>
            </li> */}

            {/* <a className="btn btn-outline-dark start" href="#">
              Log in / Register
            </a> */}
            {/* <AuthButton /> */}

            <li className="nav-item">
              <a className="nav-link" href="/links">
                Links
              </a>
            </li>
          </ul>

          <AuthButton />
        </div>
      </div>
    </nav>
  );
}

export default Nav;
