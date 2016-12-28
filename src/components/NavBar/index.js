import React from 'react'
import { Link } from 'react-router'
import './styles.css'
import logo from './logo.png'

const NavBar = ({ auth }) =>
  <nav className='NavBar'>
    <Link to='/'><img className='Logo' role='presentation' src={logo} /></Link>
    <h1><Link to='/'>Energy</Link></h1>
    <div className='Menu'>
      { auth.authenticated && <Link to='/dashboard'>Dashboard</Link> }
      { auth.authenticated
        ? <Link to='/logout'>Logout</Link>
        : <Link to='/dashboard'>Login</Link> }
    </div>
  </nav>

NavBar.propTypes = {
  auth: React.PropTypes.object.isRequired
}

export default NavBar
