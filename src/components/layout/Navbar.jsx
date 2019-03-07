import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom'

const Navbar = (props) => {
  return (
    <nav className="grey darken-4 z-depth-0">
      <div className="nav-wrapper container">
        <a href="/" className="brand-logo">Sqoodle Admin</a>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li><Link to="/"><i className="material-icons left">home</i>HOME</Link></li>
          <li><NavLink to="/add_token"><i className="material-icons left">add_circle</i>ADD TOKEN</NavLink></li>
          <li><NavLink to="/minters"><i className="material-icons left">group</i>MINTERS</NavLink></li>
          <li><NavLink to="/about"><i className="material-icons left">favorite</i>ABOUT</NavLink></li>
        </ul>
      </div>
    </nav>
  )
}

export default withRouter(Navbar);
