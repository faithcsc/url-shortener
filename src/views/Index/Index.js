import React, { Component } from "react";
import {
  Switch,
  BrowserRouter as Router,
  Route,
  useHistory,
} from "react-router-dom";
import config from "../../shared/config";

import "../../index.css";

import { withAuthenticationRequired } from "@auth0/auth0-react";
import Cookies from "js-cookie";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

import ShortUrlRedirect from "../../components/Main/ShortUrlRedirect";
// import Header from "./components/Header";
import SimpleLinks from "../../components/Main/SimpleLinks";

// import logo from '../../components/Logo/logo.svg';

import Header from "../../components/Header/Header";
import Content from "./Content";
import Footer from "../../components/Footer/Footer";
import Auth0ProviderWithHistory from "../../shared/auth0-provider-with-history";

const { isMobile } = config;

function Index() {
  const history = useHistory();
  const onRedirectCallback = (appState) => {
    history.push(appState?.returnTo || window.location.pathname);
  };
  const ProtectedRoute = ({ component, ...args }) => (
    <Route component={withAuthenticationRequired(component)} {...args} />
  );

  return (
    <div class="main-container">
      <Router>
        <Auth0ProviderWithHistory>
          <Header />
          <Switch>
            <Route exact path="/" component={Content} />
            <Route exact path="/404">
              <Notfound />
            </Route>
            <ProtectedRoute path="/links" component={SimpleLinks} />
            <ProtectedRoute
              path={`/${config.LINKS_REGEX}`}
              component={SimpleLinks}
            />
            <Route render={(props) => <ShortUrlRedirect {...props} />} />
            <Route component={Notfound} />
          </Switch>
          {/* <Cookiesdisplay /> */}
          <Footer />
        </Auth0ProviderWithHistory>
      </Router>
    </div>
  );
}

function Cookiesdisplay() {
  const allcookies = Cookies.get();
  return (
    <div>
      <pre className="col-12 text-light bg-dark p-4">
        Cookies display ={JSON.stringify(allcookies, null, 2)}
      </pre>
    </div>
  );
}

function Notfound() {
  return (
    <Container maxWidth="lg" className="text center">
      <h2>404 Not Found</h2>
      <h5>The page you are looking for doesn&#39;t exist.</h5>
    </Container>
  );
}

export default Index;
