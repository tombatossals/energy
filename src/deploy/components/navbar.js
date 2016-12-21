import React from 'react';

export default () =>
  <nav className="pt-navbar pt-dark">
    <div>
      <div className="pt-navbar-group pt-align-left">
        <div className="pt-navbar-heading">Energy</div>
      </div>
      <div className="pt-navbar-group pt-align-right">
        <button className="pt-button pt-minimal pt-icon-home">Home</button>
        <button className="pt-button pt-minimal pt-icon-document">Files</button>
        <span className="pt-navbar-divider"></span>
        <button className="pt-button pt-minimal pt-icon-user"></button>
        <button className="pt-button pt-minimal pt-icon-notifications"></button>
        <button className="pt-button pt-minimal pt-icon-cog"></button>
      </div>
    </div>
  </nav>
