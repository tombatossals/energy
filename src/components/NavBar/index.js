import React from 'react'
import { Link } from 'react-router'
import './styles.css'
import logo from './logo.png'

const NavBar = ({ auth }) =>
  <nav className='NavBar'>
    <h1><Link to='/dashboard'><img role='presentation' src={logo} />Energy</Link></h1>
    <div className='Menu'>
      { auth.authenticated && <Link className='Logout' to='/logout'>Logout</Link> }
    </div>
  </nav>

NavBar.propTypes = {
  auth: React.PropTypes.object.isRequired
}

export default NavBar
