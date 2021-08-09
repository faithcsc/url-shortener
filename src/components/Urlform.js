import React from 'react'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import Cookies from 'js-cookie'

import CopyButton from './CopyButton'
import config from '../shared/config'
import { postShortUrl } from '../shared/requests'

const allowedChars = config.ALLOWED_CHARS_IN_SHORT_URL

const styles = (theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  copyString: {
    margin: theme.spacing(-1, 1, 0),
    color: '#a9a9a9',
  },
})

const validUrl = (string) => {
  let url
  try {
    url = new URL(string)
  } catch (_) {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}

const convertToValidUrl = (string) => {
  let url
  try {
    url = new URL(string)
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return string
    }
    return ''
  } catch (_) {
    if (string.startsWith('http:') || string.startsWith('https:')) {
      return ''
    }
  }

  if (string.includes('://') || !string.includes('.')) {
    return ''
  }

  let removedTrailingSlashes = string
  while (removedTrailingSlashes !== '' && removedTrailingSlashes[0] === '/') {
    removedTrailingSlashes = removedTrailingSlashes.substr(1)
  }

  const withProtocol = `https://${removedTrailingSlashes}`
  if (validUrl(withProtocol)) {
    return `//${removedTrailingSlashes}`
  }
  return ''
}

function createShortUrl() {
  let result = ''
  for (let i = 0; i < 6; i += 1) {
    result += allowedChars[Math.floor(Math.random() * allowedChars.length)]
  }
  return result
}

const getLoggedinUser = () =>
  Cookies.get('userid') === undefined ? '' : Cookies.get('userid')

class Urlform extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isInvalid: false,
      error: '',
      status: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    this.setState({
      userInput: e.target.value,
    })
    const newValidUrl = convertToValidUrl(e.target.value)
    if (newValidUrl === '') {
      this.setState({
        isInvalid: true,
        error: 'Invalid URL',
        userInput: e.target.value,
        userInputValidated: newValidUrl,
      })
    } else {
      this.setState({
        isInvalid: false,
        error: '',
        userInput: e.target.value,
        userInputValidated: newValidUrl,
      })
    }
  }

  async handleSubmit(e) {
    e.preventDefault()
    const { isInvalid } = this.state
    if (!isInvalid) {
      const { userInputValidated } = this.state
      const longUrl = userInputValidated
      let shortUrl
      let response = {}
      let retries = 0
      const userid = getLoggedinUser()
      while (
        retries < config.MAX_RETRIES &&
        !(config.SHORT_URL_KEY in response)
      ) {
        shortUrl = createShortUrl()
        response = await postShortUrl(longUrl, shortUrl, userid)
        retries += 1
      }

      if ('error' in response) {
        this.setState({
          shorturl: '',
          status: JSON.stringify(response),
        })
      } else if (config.SHORT_URL_KEY in response) {
        // TODO better way to generate valid url
        shortUrl = window.location.origin + '/' + response[config.SHORT_URL_KEY]
        this.setState({
          shorturl: shortUrl,
          status: '',
        })
      }
    }
  }

  render() {
    const { classes } = this.props
    let textFieldDisabled = false
    let submitButtonText = 'Shorten'
    const { shorturl } = this.state
    if (validUrl(shorturl)) {
      textFieldDisabled = true
      submitButtonText = 'Copy'
    }

    const { userInput, isInvalid, error, status } = this.state
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
                    styles={{ disableTransition: { transition: 'none' } }}
                    disabled={textFieldDisabled}
                    value={textFieldDisabled ? shorturl : userInput}
                    onChange={this.handleChange}
                    {...(isInvalid ? 'error' : '')}
                    helperText={isInvalid ? error : ''}
                    inputProps={{ inputMode: 'url', style: { fontSize: 16 } }}
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
    )
  }
}

export default withStyles(styles, {})(Urlform)
