import React from 'react';
import {
  Switch, BrowserRouter as Router, Route, useHistory,
} from 'react-router-dom';

import { withAuthenticationRequired } from '@auth0/auth0-react';
import Cookies from 'js-cookie';
import Urlform from './components/Urlform';
import ShortUrlRedirect from './components/ShortUrlRedirect';
import Header from './components/Header';
import Copyright from './components/Copyright';
import Notfound from './components/Notfound';
// import Mylinks from './components/Mylinks';
// import Linechart from './components/Chart';

import config from './shared/config';

import Auth0ProviderWithHistory from './shared/auth0-provider-with-history';

function App() {
  const history = useHistory();
  const onRedirectCallback = (appState) => {
    history.push(appState?.returnTo || window.location.pathname);
  };
  const ProtectedRoute = ({ component, ...args }) => (
    <Route component={withAuthenticationRequired(component)} {...args} />
  );

  return (
    <Router>
      <Auth0ProviderWithHistory>
        <Header />
        <Switch>
          <Route exact path="/" component={Urlform} />
          <Route exact path="/404">
            <Notfound />
          </Route>
          {/* <Route exact path="/deletedaccount">
            <Deletedaccount />
          </Route>
          <ProtectedRoute path="/account" component={Account} />
          <ProtectedRoute path="/links" component={Mylinks} /> */}
          <Route
            path={`/${config.SHORT_URL_REGEX}`}
            render={(props) => <ShortUrlRedirect {...props} />}
          />
          <Route component={Notfound} />
        </Switch>
        {/* <Cookiesdisplay /> */}
        <Copyright />
      </Auth0ProviderWithHistory>
    </Router>
  );
}

function Cookiesdisplay() {
  const allcookies = Cookies.get();
  return (
    <div>
      <pre className="col-12 text-light bg-dark p-4">
        Cookies display =
        {JSON.stringify(allcookies, null, 2)}
      </pre>
    </div>
  );
}

function Deletedaccount() {
  const cookies = Cookies.get();
  Object.keys(cookies).forEach((key) => Cookies.remove(key));
  return (
    <div>
      <h2>We're sorry to see you go.</h2>
      <h3>Your account has been deleted.</h3>
    </div>
  );
}

export default App;
