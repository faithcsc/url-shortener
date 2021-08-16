import React from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";

import { withAuthenticationRequired } from "@auth0/auth0-react";
import Container from "@material-ui/core/Container";

import Content from "./Content";
import ShortUrlRedirect from "../../components/Main/ShortUrlRedirect";
import SimpleLinks from "../../components/Main/SimpleLinks";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Auth0ProviderWithHistory from "../../shared/auth0-provider-with-history";
import config from "../../shared/config";
import "../../index.css";

function Index() {
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
          <Footer />
        </Auth0ProviderWithHistory>
      </Router>
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
