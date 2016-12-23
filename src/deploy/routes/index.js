import React, { Component } from 'react'
import { Match, BrowserRouter, Miss, Redirect } from 'react-router'
import Layout from '../containers/Layout'
import Home from '../components/Home'
import Login from '../components/Login'
import Dashboard from '../components/Dashboard'
import NavBar from '../components/NavBar'
import Logout from '../components/Logout'

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
      ? <Layout><Component {...props} {...rest} /></Layout>
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
        {({ router }) => (
          <div className="container">
            <NavBar {...this.props } />
            <Match pattern='/' exactly component={Home} />
            <Match pattern='/logout' exactly render={(props) => <Logout firebase={this.props.firebase} />} />
            <MatchWhenUnauthed authed={this.state.authed} pattern='/login' component={Login} {...this.props} />
            <MatchWhenAuthed authed={this.state.authed} pattern='/dashboard' component={Dashboard} />
            <Miss render={() => <h1>No Match</h1>} />
          </div>
        )}
      </BrowserRouter>
    )
  }
}

export default App
