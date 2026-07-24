import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import './BottomNav.css'

const navItems = [
  { path: '/home', icon: '🏠', label: 'Trang chủ' },
  { path: '/lessons', icon: '📚', label: 'Bài học' },
  { path: '/ai-tutor', icon: '🤖', label: 'AI Tutor', special: true },
  { path: '/games', icon: '🎮', label: 'Trò chơi' },
  { path: '/profile', icon: '👤', label: 'Cá nhân' },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="bottom-nav" id="bottom-navigation">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={`bottom-nav__item ${isActive ? 'active' : ''} ${item.special ? 'special' : ''}`}
            id={`nav-${item.path.slice(1)}`}
          >
            {item.special ? (
              <motion.div
                className="bottom-nav__ai-btn"
                whileTap={{ scale: 0.9 }}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: isActive ? Infinity : 0, duration: 2 }}
              >
                <span className="bottom-nav__icon">{item.icon}</span>
              </motion.div>
            ) : (
              <motion.span
                className="bottom-nav__icon"
                animate={isActive ? { y: -2 } : { y: 0 }}
              >
                {item.icon}
              </motion.span>
            )}
            <span className="bottom-nav__label">{item.label}</span>
            {isActive && !item.special && (
              <motion.div
                className="bottom-nav__indicator"
                layoutId="nav-indicator"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
