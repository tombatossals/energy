import React, { Component } from 'react'
import { Match, BrowserRouter, Miss, Redirect } from 'react-router'
import { connect } from 'react-redux'
import { startAuthListener } from '../actions'
import Layout from '../containers/Layout'
import Login from '../containers/Login'
import Dashboard from '../components/Dashboard'
import Logout from '../containers/Logout'

const MatchWhenAuthed = ({ component: Component, authed, ...rest }) => (
  <Match
    {...rest}
    render={(props) => authed === true
      ? <Layout><Component {...props} {...rest} /></Layout>
      : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
  />
)

const MatchAnonymous = ({ component: Component, ...rest }) => (
  <Match
    {...rest}
    render={(props) => <Layout><Component {...props} {...rest} /></Layout>}
  />
)

const MatchWhenUnauthed = ({ component: Component, authed, ...rest }) => (
  <Match
    {...rest}
    render={(props) => authed === false
      ? <Layout><Component {...props} {...rest} /></Layout>
      : <Redirect to='/' />}
  />
)

class Routes extends Component {
  componentDidMount () {
    this.props.startAuthListener()
  }

  render () {
    return (
      <BrowserRouter>
        {({ router }) => (
          <div className='router'>
            <MatchAnonymous pattern='/logout' exactly component={Logout} />
            <MatchWhenAuthed authed={this.props.auth.authenticated} pattern='/' component={Dashboard} {...this.props} />
            <MatchWhenUnauthed authed={this.props.auth.authenticated} pattern='/login' component={Login} {...this.props} />
            <MatchWhenAuthed authed={this.props.auth.authenticated} pattern='/dashboard' component={Dashboard} />
            <Miss render={() => <h1>No Match</h1>} />
          </div>
        )}
      </BrowserRouter>
    )
  }
}

Routes.propTypes = {
  startAuthListener: React.PropTypes.func.isRequired,
  auth: React.PropTypes.shape({
    authenticated: React.PropTypes.bool.isRequired
  }).isRequired
}

const mapStateToProps = ({ auth }) => ({
  auth
})

export default connect(mapStateToProps, { startAuthListener })(Routes)
