import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom'

const Navbar = (props) => {
  return (
    <nav className="grey darken-4 z-depth-0">
      <div className="nav-wrapper container">
        <a href="/" className="brand-logo">Sqoodle Admin</a>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li><Link to="/">HOME</Link></li>
          <li><NavLink to="/add_token">ADD TOKEN</NavLink></li>
          <li><NavLink to="/about">ABOUT</NavLink></li>
        </ul>
      </div>

    </nav>
  )
}

export default withRouter(Navbar);
