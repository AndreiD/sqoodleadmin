import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="nav-wrapper grey darken-3">
      <div className="container">
        <Link to='/' className="brand-logo">Sqoodle Admin</Link>
        <ul className="right">
          <li><NavLink to='/'>Home</NavLink></li>
        </ul>

      </div>
    </nav>
  )
}

export default Navbar
