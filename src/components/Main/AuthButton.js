import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@material-ui/core/Button";
import Cookies from "js-cookie";
import Box from "@material-ui/core/Box";
import config from "../../shared/config";
import "../../index.css";

import styled from "styled-components";

const StyledButton = styled(Button)`
  &:hover {
    background: none;
  }
`;

const { isMobile } = config;
const buttonVariant = isMobile ? "text" : "text"; // 'outlined'

const AuthButton = () => {
  const { isAuthenticated } = useAuth0();
  return isAuthenticated ? <LogoutButton /> : <LoginButton />;
};

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <a
      className="btn btn-outline-dark start"
      onClick={() => loginWithRedirect()}
    >
      Log in / Register
    </a>
  );
};

const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <a
      className="btn btn-outline-dark start"
      onClick={() => {
        const cookies = Cookies.get();
        Object.keys(cookies).forEach((key) => Cookies.remove(key));
        logout({
          returnTo: window.location.origin,
        });
      }}
    >
      Log Out
    </a>
  );
};

// const LoginButton = () => {
//   const { loginWithRedirect } = useAuth0();
//   return (
//     <StyledButton
//       size="large"
//       variant={buttonVariant}
//       color="primary"
//       onClick={() => loginWithRedirect()}
//     >
//       Log In / Register
//     </StyledButton>
//   );
// };

// const LogoutButton = () => {
//   const { logout } = useAuth0();
//   return (
//     <StyledButton
//       size="large"
//       variant={buttonVariant}
//       color="secondary"
//       onClick={() => {
//         const cookies = Cookies.get();
//         Object.keys(cookies).forEach((key) => Cookies.remove(key));
//         logout({
//           returnTo: window.location.origin,
//         });
//       }}
//       style={{ backgroundColor: "transparent" }}
//     >
//       Log Out
//     </StyledButton>
//   );
// };

export default AuthButton;
