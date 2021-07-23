import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import Cookies from 'js-cookie';
import * as constants from '../shared/constants';
import makeRequest from '../shared/requests';

const allowedChars = constants.ALLOWED_CHARS_IN_SHORT_URL;

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(0, 'auto', 0),
    height: '40px',
    display: 'flex',
    size: 'small',
  },
  copyString: {
    margin: theme.spacing(-1, 1, 0),
    color: '#a9a9a9',
  },
});

const validUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
};

const convertToValidUrl = (string) => {
  let url;
  try {
    url = new URL(string);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return string;
    }
    return '';
  } catch (_) {
    if (string.startsWith('http:') || string.startsWith('https:')) {
      return '';
    }
  }

  if (string.includes('://') || !string.includes('.')) {
    return '';
  }

  let removedTrailingSlashes = string;
  while (removedTrailingSlashes !== '' && removedTrailingSlashes[0] === '/') {
    removedTrailingSlashes = removedTrailingSlashes.substr(1);
  }

  const withProtocol = `https://${removedTrailingSlashes}`;
  if (validUrl(withProtocol)) {
    return `//${removedTrailingSlashes}`;
  }
  return '';
};

async function postShortUrl(LongUrl, ShortUrl, userid = '') {
  const data = {
    long: LongUrl,
    short: ShortUrl,
    user: userid,
  };
  const response = await makeRequest(constants.DB_ENDPOINTS.link, data, 'application/json', 'POST');
  return response;
}

function createShortUrl() {
  let result = '';
  for (let i = 0; i < 6; i += 1) {
    result += allowedChars[Math.floor(Math.random() * allowedChars.length)];
  }
  return result;
}

function getLoggedinUser() {
  if (Cookies.get('userid') === undefined) {
    return '';
  }
  return Cookies.get('userid');
}

class Urlform extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isInvalid: false,
      error: '',
      status: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
  }

  handleChange(e) {
    this.setState({
      userInput: e.target.value,
    });
    const newValidUrl = convertToValidUrl(e.target.value);
    console.log(`newValidUrl: ${newValidUrl}`);
    if (newValidUrl === '') {
      this.setState({
        isInvalid: true,
        error: 'Invalid URL',
        userInput: e.target.value,
        userInputValidated: newValidUrl,
      });
    } else {
      this.setState({
        isInvalid: false,
        error: '',
        userInput: e.target.value,
        userInputValidated: newValidUrl,
      });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { isInvalid } = this.state;
    if (!isInvalid) {
      const { userInputValidated } = this.state;
      const longUrl = userInputValidated;
      let shortUrl;
      let response = {};
      let retries = 0;
      const userid = getLoggedinUser();
      while (retries < constants.MAX_RETRIES && !(constants.SHORT_URL_KEY in response)) {
        shortUrl = createShortUrl();
        response = await postShortUrl(longUrl, shortUrl, userid);
        retries += 1;
      }

      if ('error' in response) {
        this.setState({
          shorturl: '',
          status: JSON.stringify(response),
        });
      } else if (constants.SHORT_URL_KEY in response) {
        // TODO better way to generate valid url
        shortUrl = window.location.href + response[constants.SHORT_URL_KEY];
        this.setState({
          shorturl: shortUrl,
          status: '',
        });
      }
    }
  }

  handleCopy(e) {
    e.preventDefault();
    const { shorturl } = this.state;
    if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      navigator.clipboard.writeText(shorturl).then(() => {
        this.setState({ status: 'Copied!' });
      }, (err) => {
        this.setState({ status: 'Error copying :(' });
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = shorturl;
      // make the textarea out of viewport
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res, rej) => {
        if (document.execCommand('copy')) {
          this.setState({ status: 'Copied!' });
          res();
        } else {
          this.setState({ status: 'Error copying :(' });
          rej();
        }
        textArea.remove();
      });
    }
  }

  render() {
    const { classes } = this.props;
    let textFieldDisabled = false;
    let submitButtonText = 'Shorten';
    const { shorturl } = this.state;
    if (validUrl(shorturl)) {
      textFieldDisabled = true;
      submitButtonText = 'Copy';
    }

    const {
      userInput, isInvalid, error, status,
    } = this.state;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box height="20vh">
          <div className={classes.paper}>

            <form className={classes.form}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={9}>
                  <TextField
                    variant="outlined"
                    size="small"
                    required
                    fullWidth
                    autoFocus
                    disabled={textFieldDisabled}
                    value={textFieldDisabled ? shorturl : userInput}
                    onChange={this.handleChange}
                    {...isInvalid ? 'error' : ''}
                    helperText={isInvalid ? error : ''}
                    height="40px"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={textFieldDisabled ? this.handleCopy : this.handleSubmit}
                  >
                    {submitButtonText}
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" className={classes.copyString}>
                    {status}
                  </Typography>
                </Grid>

              </Grid>
            </form>
          </div>
        </Box>
      </Container>
    );
  }
}

export default withStyles(styles, {})(Urlform);
