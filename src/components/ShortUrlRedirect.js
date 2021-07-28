import React from 'react';
import config from '../shared/config';

class ShortUrlRedirect extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() {
    let shorturl;
    shorturl = window.location.pathname;
    shorturl = shorturl.substr(1, shorturl.length);
    fetch(config.DB_ENDPOINTS.link + shorturl, { method: 'GET' })
      .then((response) => response.json())
      .then((result) => {
        if (config.LONG_URL_KEY in result) {
          this.setState({
            newWindowLocation: result[config.LONG_URL_KEY],
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
    return (
      <div>
        <h1 style={{ textAlign: "center"}}>Loading....</h1>
      </div>
    );
  }
}

export default ShortUrlRedirect;
