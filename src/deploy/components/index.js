import React, { Component } from 'react'
import { Match, BrowserRouter, Miss, Redirect } from 'react-router'
import firebase from 'firebase'
import { getConfig } from '../../common'
import Home from './Home'
import Login from './Login'
import Dashboard from './Dashboard'
import NavBar from './NavBar'
import './styles.css'

const config = getConfig().firebase
firebase.initializeApp(config)

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
      ? <Component {...props} />
      : <Redirect to='/dashboard' />}
  />
)

class App extends Component {

  state = {
    authed: false,
    loading: true,
  }

  componentDidMount () { 
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
          loading: false,
        })
      } else {
        this.setState({
          loading: false
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
            <NavBar />
            <Match pattern='/' exactly component={Home} />
            <MatchWhenUnauthed authed={this.state.authed} pattern='/login' component={Login} />
            <MatchWhenAuthed authed={this.state.authed} pattern='/dashboard' component={Dashboard} />
            <Miss render={() => <h3>No Match</h3>} />
          </div>
        )}
      </BrowserRouter>
    )
  }
}

export default App
