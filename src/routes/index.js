import React, { Component } from 'react'
import { Match, BrowserRouter, Miss, Redirect } from 'react-router'
import { connect } from 'react-redux'
import { startAuthListener } from '../actions'
import { authPropType } from '../lib/propTypes'
import Layout from '../containers/Layout'
import Login from '../containers/Login'
import Dashboard from '../containers/Dashboard'
import Logout from '../containers/Logout'
import Home from '../components/Home'

const MatchWhenAuthorized = ({ component: Component, auth, ...rest }) => (
  <Match
    {...rest}
    render={(props) => auth.authenticated === true
      ? <Layout><Component {...rest} /></Layout>
      : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
  />
)

MatchWhenAuthorized.propTypes = {
  component: React.PropTypes.any.isRequired,
  auth: authPropType.isRequired,
  location: React.PropTypes.object
}

const MatchWithLayout = ({ component: Component, ...rest }) => (
  <Match
    {...rest}
    render={(props) => <Layout><Component {...props} /></Layout>}
  />
)

MatchWithLayout.propTypes = {
  component: React.PropTypes.any.isRequired
}


class Routes extends Component {
  componentDidMount () {
    this.props.startAuthListener()
  }

  render () {
    return (
      <BrowserRouter>
        {({ router }) => (
          <div className='router'>
            <MatchWithLayout pattern='/' exactly component={Home} />
            <MatchWithLayout pattern='/logout' exactly component={Logout} />
            <MatchWithLayout from={router} auth={this.props.auth} pattern='/login' component={Login} {...this.props} />
            <MatchWhenAuthorized auth={this.props.auth} pattern='/dashboard' component={Dashboard} />
            <Miss render={() => <h1>No Match</h1>} />
          </div>
        )}
      </BrowserRouter>
    )
  }
}

Routes.propTypes = {
  startAuthListener: React.PropTypes.func.isRequired,
  auth: authPropType.isRequired
}

const mapStateToProps = ({ auth }) => ({
  auth
})

export default connect(mapStateToProps, { startAuthListener })(Routes)
