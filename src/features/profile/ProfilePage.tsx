import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../../stores/useAppStore'
import './ProfilePage.css'

export default function ProfilePage() {
  const { user, badges } = useAppStore()

  return (
    <div className="page profile-page" id="profile-page">
      {/* Profile Card */}
      <motion.div className="profile-card" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="profile-card__avatar">
          <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%', padding: '4px' }} />
        </div>
        <h1 className="profile-card__name">{user.name}</h1>
        <p className="profile-card__level">Level {user.level} · {user.age} tuổi</p>
        <div className="profile-card__stats">
          <div><strong>{user.streak}</strong><span>🔥 Streak</span></div>
          <div><strong>{user.xp}</strong><span>⚡ XP</span></div>
          <div><strong>{user.coins}</strong><span>⭐ Sao</span></div>
        </div>
      </motion.div>

      {/* Badges */}
      <div className="profile-section">
        <h2 className="dash-section-title">🏆 Huy hiệu</h2>
        <div className="badges-grid">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.id}
              className={`badge-card ${badge.earnedAt ? 'earned' : 'locked'}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05, type: 'spring' }}
            >
              <span className="badge-card__icon">{badge.icon}</span>
              <span className="badge-card__name">{badge.nameVi}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="profile-section">
        <h2 className="dash-section-title">⚙️ Cài đặt</h2>
        <div className="profile-menu">
          <Link to="/reports" className="profile-menu__item">
            <span>📊</span><span>Báo cáo cho phụ huynh</span><span>›</span>
          </Link>
          <div className="profile-menu__item">
            <span>🌐</span><span>Ngôn ngữ</span><span className="profile-menu__value">Tiếng Việt</span>
          </div>
          <div className="profile-menu__item">
            <span>🔔</span><span>Thông báo</span><span className="profile-menu__value">Bật</span>
          </div>
          <div className="profile-menu__item">
            <span>🎵</span><span>Âm thanh</span><span className="profile-menu__value">Bật</span>
          </div>
        </div>
      </div>
    </div>
  )
}
