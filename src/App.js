import React from 'react'
import {
  Switch,
  BrowserRouter as Router,
  Route,
  useHistory,
} from 'react-router-dom'
import { withAuthenticationRequired } from '@auth0/auth0-react'
import Auth0ProviderWithHistory from './shared/auth0-provider-with-history'
import Cookies from 'js-cookie'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'

import Urlform from './components/Urlform'
import ShortUrlRedirect from './components/ShortUrlRedirect'
import Header from './components/Header'
import SimpleLinks from './components/SimpleLinks'
import config from './shared/config'

import './index.css'

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const { isMobile } = config

const theme = createMuiTheme({
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
  },
})

function App() {
  const history = useHistory()
  const onRedirectCallback = (appState) => {
    history.push(appState?.returnTo || window.location.pathname)
  }
  const ProtectedRoute = ({ component, ...args }) => (
    <Route component={withAuthenticationRequired(component)} {...args} />
  )

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Auth0ProviderWithHistory>
          <Header className="helv" />
          <Box className="text center" padding={isMobile ? 0 : 4}>
            <Container maxWidth="lg">
              <Switch>
                <Route exact path="/" component={Urlform} />
                <Route exact path="/404">
                  <Notfound />
                </Route>
                <ProtectedRoute path="/links" component={SimpleLinks} />
                <Route
                  path={`/${config.SHORT_URL_REGEX}`}
                  render={(props) => <ShortUrlRedirect {...props} />}
                />
                <Route component={Notfound} />
              </Switch>
            </Container>
          </Box>
          {/* <Cookiesdisplay /> */}
          <Copyright />
        </Auth0ProviderWithHistory>
      </Router>
    </ThemeProvider>
  )
}

function Cookiesdisplay() {
  const allcookies = Cookies.get()
  return (
    <div>
      <pre className="col-12 text-light bg-dark p-4">
        Cookies display ={JSON.stringify(allcookies, null, 2)}
      </pre>
    </div>
  )
}

function Notfound() {
  return (
    <Box>
      <h2>404 Not Found</h2>
      <h5>The page you are looking for doesn&#39;t exist.</h5>
    </Box>
  )
}

function Copyright() {
  return (
    <Box m={2}>
      <Typography variant="body2" color="textSecondary" align="center">
        {'© '}
        <Link color="inherit" href={window.location.origin}>
          Faith Chia
        </Link>{' '}
        {new Date().getFullYear()}
      </Typography>
    </Box>
  )
}
export default App
