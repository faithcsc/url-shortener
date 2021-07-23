import React from 'react';
import * as constants from '../shared/constants';

class ShortUrlRedirect extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() {
    let shorturl;
    shorturl = window.location.pathname;
    shorturl = shorturl.substr(1, shorturl.length);
    fetch(constants.DB_ENDPOINTS.link + shorturl, { method: 'GET' })
      .then((response) => response.json())
      .then((result) => {
        if (constants.LONG_URL_KEY in result) {
          this.setState({
            newWindowLocation: result[constants.LONG_URL_KEY],
          });
        } else {
          this.setState({
            newWindowLocation: `${window.location.origin}/404`,
          });
        }
      });
  }

  render() {
    const { newWindowLocation } = this.state;
    if (newWindowLocation) {
      window.location = newWindowLocation;
    }
    return <div><h2>Loading....</h2></div>;
  }
}

export default ShortUrlRedirect;
