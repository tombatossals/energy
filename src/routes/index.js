import React, { Component } from 'react'
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import { startAuthListener } from '../actions'
import { authPropType } from '../lib/propTypes'
import Layout from '../containers/Layout'
import Login from '../containers/Login'
import Dashboard from '../containers/Dashboard'
import Logout from '../containers/Logout'
import Home from '../components/Home'

const AuthorizedRoute = ({ component: Component, auth, ...rest }) =>
  <Route
    {...rest}
    render={props => auth.authenticated
      ? <Layout><Component {...props} /></Layout>
      : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
  />

AuthorizedRoute.propTypes = {
  component: React.PropTypes.any.isRequired,
  auth: authPropType.isRequired,
  location: React.PropTypes.object
}

class Routes extends Component {
  componentDidMount () {
    this.props.startAuthListener()
  }

  render () {
    return (
      <Router>
        <Layout>
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/logout' component={Logout} {...this.props} />
            <Route path='/login' component={Login} {...this.props} />
            <Route path='/dashboard' exact component={() =>
              <Redirect to={`/dashboard/interval/day/date/${moment().subtract(2, 'day').format('YYYYMMDD')}`} />}
            />
            <AuthorizedRoute auth={this.props.auth} path='/dashboard/interval/:interval/date/:date' component={Dashboard} />
            <AuthorizedRoute auth={this.props.auth} path='/dashboard/:location/interval/:interval/date/:date' component={Dashboard} />
            <Route component={() => <h1>No Match</h1>} />
          </Switch>
        </Layout>
      </Router>
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
