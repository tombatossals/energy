import React from 'react'
import { Link } from 'react-router'
import './styles.css'
import logo from '../../assets/logo.png'
export default ({ auth }) =>
  <nav className='NavBar'>
    <h1><img role='presentation' src={logo} />Energy</h1>
    <div className='Menu'>
      { auth.authenticated && <Link className='Logout' to='/logout'>Logout</Link> }
    </div>
  </nav>
