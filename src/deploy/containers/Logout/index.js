import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { logout } from '../../actions'

class Logout extends React.Component {
  static propTypes = {
    logout: React.PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.logout()
  }

  render () {
    return (
      <div>
        <h1>Logged out</h1>
        <Link to='/'>Go to main page</Link>
      </div>
    )
  }
}

export default connect(null, { logout })(Logout)
