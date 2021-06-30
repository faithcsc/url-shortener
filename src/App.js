import React from 'react'
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import Urlform from './Urlform'
import ShortUrlRedirect from './ShortUrlRedirect'
import Header from './Header'
import Copyright from './Copyright'
import Notfound from './Notfound'
import * as constants from './constants'

function App() {
  return (
    <Router>
      <Header />
      {/* <div>
        <a href="/dashboard">Dashboard</a>
      </div> */}
      <Switch>
        <Route exact path="/" component={Urlform} />
        <Route exact path="/404">
          <Notfound />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
        <Route path={`/${constants.SHORT_URL_REGEX}`}
          render={(props) => <ShortUrlRedirect {...props} />} >
        </Route>
        <Route component={Notfound} />
      </Switch>
      <Copyright />
    </Router >
  )
}

function Login() {
  return (
    <div><h2>Login</h2></div>
  )
}
function Register() {
  return (
    <div><h2>Register</h2></div>
  )
}
function Dashboard() {
  return (
    <div><h2>Dashboard</h2></div>
  )
}

export default App
