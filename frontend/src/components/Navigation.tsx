import { NavLink } from 'react-router-dom'
import { motion } from 'motion/react'

export default function Navigation() {
  return (
    <nav className="nav-bar">
      <NavLink to="/" style={{ textDecoration: 'none' }}>
        <motion.div
          className="nav-logo"
          whileHover={{ scale: 1.02 }}
        >
          <span className="gradient-text">⚔ Chess AI</span>
          <span style={{ color: 'var(--color-text-muted)', margin: '0 0.5rem' }}>&</span>
          <span className="gradient-text-gold">Anime Ascension ✦</span>
        </motion.div>
      </NavLink>

      <div className="nav-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          Home
        </NavLink>
        <NavLink
          to="/chess"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          ♟ Chess AI
        </NavLink>
        <NavLink
          to="/anime"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          ✦ Anime Ascension
        </NavLink>
      </div>
    </nav>
  )
}
