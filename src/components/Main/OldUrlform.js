import React from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import CopyButton from "./CopyButton";

import { postShortUrl } from "../../shared/requests";
import config from "../../shared/config";
import {
  validUrl,
  convertToValidLongUrl,
  getUnusedShortUrl,
  getLoggedinUser,
} from "./UrlformHelper";

const styles = (theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  copyString: {
    margin: theme.spacing(-1, 1, 0),
    color: "#a9a9a9",
  },
});

class Urlform extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isInvalidLongUrl: false,
      isInvalidShortUrl: false,
      userInputLongUrl: "",
      userInputValidatedLongUrl: "",
      error: "",
      status: "",
      userid: getLoggedinUser(),
    };
    this.handleChangeLongUrl = this.handleChangeLongUrl.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeLongUrl(e) {
    this.setState({
      userInputLongUrl: e.target.value,
    });
    const newValidUrl = convertToValidLongUrl(e.target.value);
    if (newValidUrl === "") {
      this.setState({
        isInvalidLongUrl: true,
        error: "Invalid URL",
        userInputLongUrl: e.target.value,
        userInputValidatedLongUrl: newValidUrl,
      });
    } else {
      this.setState({
        isInvalidLongUrl: false,
        error: "",
        userInputLongUrl: e.target.value,
        userInputValidatedLongUrl: newValidUrl,
      });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { isInvalidLongUrl } = this.state;
    if (!isInvalidLongUrl) {
      const { userInputValidatedLongUrl, userid } = this.state;
      const longUrl = userInputValidatedLongUrl;
      let shortUrl;
      let response = {};
      let retries = 0;
      while (
        retries < config.MAX_RETRIES &&
        !(config.SHORT_URL_KEY in response)
      ) {
        shortUrl = await getUnusedShortUrl();
        response = await postShortUrl(longUrl, shortUrl, userid);
        retries += 1;
      }

      if ("error" in response) {
        this.setState({
          shorturl: "",
          status: JSON.stringify(response),
        });
      } else if (config.SHORT_URL_KEY in response) {
        // TODO better way to generate valid url
        shortUrl =
          window.location.origin + "/" + response[config.SHORT_URL_KEY];
        this.setState({
          shorturl: shortUrl,
          status: "",
        });
      }
    }
  }

  render() {
    const { classes } = this.props;
    let textFieldDisabled = false;
    let submitButtonText = "Shorten";
    const { shorturl, userid } = this.state;
    if (validUrl(shorturl)) {
      textFieldDisabled = true;
      submitButtonText = "Copy";
    }

    const { userInput, isInvalidLongUrl, error, status } = this.state;
    return (
      <Box height="200px">
        <Container component="main" maxWidth="xs">
          <div className="paper">
            <form className="form">
              <Grid container spacing={1} height="40px">
                <Grid item xs={12} sm={9} className="text left">
                  <TextField
                    variant="outlined"
                    size="small"
                    required
                    fullWidth
                    autoFocus
                    styles={{ disableTransition: { transition: "none" } }}
                    disabled={textFieldDisabled}
                    value={textFieldDisabled ? shorturl : userInput}
                    onChange={this.handleChangeLongUrl}
                    {...(isInvalidLongUrl ? "error" : "")}
                    helperText={
                      isInvalidLongUrl ? error : userid === "" ? "" : "Your URL"
                    }
                    inputProps={{ inputMode: "url", style: { fontSize: 16 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  {textFieldDisabled ? (
                    <CopyButton
                      copyValue={shorturl}
                      buttonSize="medium"
                      inheritedClassName="submit"
                    />
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className="submit"
                      onClick={this.handleSubmit}
                    >
                      {submitButtonText}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </form>
          </div>
          <Box mt={2}>
            <Grid container>
              <Typography variant="subtitle1" className={classes.copyString}>
                {status}
              </Typography>
            </Grid>
          </Box>
        </Container>
      </Box>
    );
  }
}

export default withStyles(styles, {})(Urlform);
