import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Cookies from "js-cookie";
import "../../index.css";

const AuthButton = () => {
  const { isAuthenticated } = useAuth0();
  return isAuthenticated ? <LogoutButton /> : <LoginButton />;
};

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    // eslint-disable-next-line
    <a
      className="btn btn-outline-dark start"
      onClick={() => loginWithRedirect()}
      href="#"
    >
      Log in / Register
    </a>
  );
};

const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    // eslint-disable-next-line
    <a
      className="btn btn-outline-dark start"
      onClick={() => {
        const cookies = Cookies.get();
        Object.keys(cookies).forEach((key) => Cookies.remove(key));
        logout({
          returnTo: window.location.origin,
        });
      }}
      href="#"
    >
      Log Out
    </a>
  );
};

export default AuthButton;
