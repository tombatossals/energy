import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../../actions'
import './styles.css'

class Logout extends React.Component {
  componentDidMount () {
    this.props.logout()
  }

  render () {
    return (
      <div className='Logout'>
        <h1>Logged out</h1>
        <Link className='Return' to='/'>Return to main page</Link>
      </div>
    )
  }
}

Logout.propTypes = {
  logout: React.PropTypes.func.isRequired
}

export default connect(null, { logout })(Logout)
