import React from 'react';
import { withAuth0 } from '@auth0/auth0-react';
import Cookies from 'js-cookie';
import config from '../shared/config';
import makeRequest from '../shared/requests';
import Linechart from './Chart';
import convertData from '../shared/chartshelper';
import placeholderData from '../shared/placeholderdata';

// AUTHENTICATION

async function requestAuthToken(userData) {
  const sendUserData = {
    name: userData.name,
    email: userData.email,
    password: userData.sub,
    userid: userData.sub,
  };

  const response = await makeRequest(config.DB_ENDPOINTS.newuser, sendUserData, 'application/json', 'POST');
  const idKey = 'id';
  if (idKey in response) { // user is in database
    Cookies.set('userid', response[idKey]);
    const authToken = makeRequest(config.DB_ENDPOINTS.userauth, sendUserData, 'application/json', 'POST');
    return authToken;
  }
  return {};
}

const saveDictToCookie = (dict) => {
  Object.keys(dict).forEach((e) => Cookies.set(e, dict[e]));
};

const cookieExpiryDays = 1;

async function onSuccessfulLogin(auth0data) {
  if (Cookies.get('user') === undefined) {
    const { user } = auth0data;
    user.datetime = Date.now();
    Cookies.set('user', user, { expires: cookieExpiryDays });
  }
  const userData = JSON.parse(Cookies.get('user'));
  const authToken = await requestAuthToken(userData);

  saveDictToCookie(authToken);

  return Cookies.get();
}

async function retrieveUserLinks(cookiesUser) {
  const { userid } = cookiesUser;
  const userlinks = await makeRequest(config.DB_ENDPOINTS.userlinks + userid, {}, '', 'GET');
  return userlinks;
}

// DISPLAY & FORMATTING

const displayLink = (rawlink) => {
  while (rawlink !== '' && rawlink.startswith('/')) {
    rawlink = rawlink.substr(1);
  }
  return rawlink;
};

class Mylinks extends React.Component {
  constructor() {
    super();
    this.state = {
      userlinks: [],
      cookies: {},
    };
  }

  async componentDidMount() {
    const { auth0 } = this.props;
    const cookies = await onSuccessfulLogin(auth0);
    this.setState({ cookies });

    const userlinks = placeholderData;
    this.setState({ userlinks: placeholderData });
    // const userlinks = await retrieveUserLinks(cookies);
    // this.setState({ userlinks });
    const formattedUserlinks = convertData(userlinks);
    console.log(`formattedUserlinks: ${JSON.stringify(formattedUserlinks)}`);
    this.setState({ formattedUserlinks });
  }

  render() {
    const { auth0 } = this.props;
    const { user } = auth0;
    const { name, picture, email } = user;
    const { userlinks, cookies, formattedUserlinks } = this.state;

    return (
      <div>
        <h2>Links</h2>
        <div className="row">
          <pre>
            <Linechart data={formattedUserlinks} />
          </pre>

          <pre className="col-12 text-light bg-dark p-4">
            User data =
            {JSON.stringify(user, null, 2)}
          </pre>
          <pre className="col-12 text-light bg-dark p-4">
            this.state.userlinks =
            {JSON.stringify(userlinks, null, 2)}
          </pre>
          <pre className="col-12 text-light bg-dark p-4">
            this.state.cookies =
            {JSON.stringify(cookies, null, 2)}
          </pre>
        </div>
      </div>
    );
  }
}
export default withAuth0(Mylinks);
