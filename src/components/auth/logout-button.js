import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Cookies from 'js-cookie';

const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <button
      className="btn btn-danger btn-block"
      onClick={() => {
        const cookies = Cookies.get();
        Object.keys(cookies).forEach((key) => Cookies.remove(key));
        logout({
          returnTo: window.location.origin,
        });
      }}
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
