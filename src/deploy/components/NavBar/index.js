import React from 'react';
import { Link } from 'react-router'
import './styles.css'

export default ({ auth }) => 
  <nav className="NavBar">
    <h1>Energy</h1>
    { auth.authenticated && <Link className='Logout' to='/logout'>Logout</Link> }
  </nav>