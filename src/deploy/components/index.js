import React, { Component } from 'react'
import { Match, BrowserRouter, Miss, Redirect } from 'react-router'
import Home from './Home'
import Login from './Login'
import Dashboard from './Dashboard'
import NavBar from './NavBar'
import Logout from './Logout'
import './styles.css'

const MatchWhenAuthed = ({ component: Component, authed, ...rest }) => (
  <Match
    {...rest}
    render={(props) => authed === true
      ? <Component {...props} />
      : <Redirect to={{ pathname: '/login', state: {from: props.location}} } />}
  />
)

const MatchWhenUnauthed = ({ component: Component, authed, ...rest }) => (
  <Match
    {...rest}
    render={(props) => authed === false
      ? <Component {...props} {...rest} />
      : <Redirect to='/dashboard' />}
  />
)

class App extends Component {

  state = {
    authed: false,
    loading: true,
  }

  componentDidMount () {
    this.removeListener = this.props.firebase.auth().onAuthStateChanged((user) => {
      console.log('hola', user)
      if (user) {
        this.setState({
          authed: true,
          loading: false,
        })
      } else {
        this.setState({
          loading: false,
          authed: false
        })
      }
    })
  }

  componentWillUnmount () {
    this.removeListener()
  }

  render() {
    return this.state.loading === true ? <h1>Loading</h1> : (
      <BrowserRouter>
        {({router}) => (
          <div className="container">
            <NavBar {...this.props } />
            <Match pattern='/' exactly component={Home} />
            <MatchWhenUnauthed authed={this.state.authed} pattern='/login' component={Login} {...this.props} />
            <MatchWhenUnauthed authed={this.state.authed} pattern='/logout' component={Logout} />
            <MatchWhenAuthed authed={this.state.authed} pattern='/dashboard' component={Dashboard} />
            <Miss render={() => <h1>No Match</h1>} />
          </div>
        )}
      </BrowserRouter>
    )
  }
}

export default App
