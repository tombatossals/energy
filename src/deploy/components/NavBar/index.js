import React from 'react';
import { Link } from 'react-router'
import './styles.css'

export default () =>
  <nav className="pt-navbar NavBar">
    <div>
      <div className="pt-navbar-group pt-align-left">
        <div className="pt-navbar-heading"><Link to='/'>Energy</Link></div>
      </div>
      <div className="pt-navbar-group pt-align-right">
        <Link to='/dashboard'><button className="pt-button pt-minimal pt-icon-home">Dashboard</button></Link>
        <Link to='/login'><button className="pt-button pt-minimal pt-icon-document">Login</button></Link>
      </div>
    </div>
  </nav>
