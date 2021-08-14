import React from "react";
import config from "../../shared/config";
import Loading from "./Loading";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { displayUrl } from "./UrlformHelper";

class ShortUrlRedirect extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() {
    let shorturl;
    shorturl = window.location.pathname;
    shorturl = shorturl.substr(1, shorturl.length);
    fetch(config.DB_ENDPOINTS.link + shorturl, { method: "GET" })
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
      return (
        <Box mt={2}>
          <Container maxWidth="lg" className="text center">
            <h4>You are being redirected to:</h4>
            <a href={newWindowLocation}>
              <h3>{displayUrl(newWindowLocation)}</h3>
            </a>
          </Container>
        </Box>
      );
    }
    return <Loading />;
  }
}

export default ShortUrlRedirect;
