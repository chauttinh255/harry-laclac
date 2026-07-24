import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../../stores/useAppStore'
import './Dashboard.css'

const quickActions = [
  { path: '/lessons', icon: '📚', label: 'Bài học', color: '#4A90D9', bg: '#E8F0FE' },
  { path: '/vocabulary', icon: '🔤', label: 'Từ vựng', color: '#2ECC71', bg: '#E8F8F0' },
  { path: '/pronunciation', icon: '🎤', label: 'Phát âm', color: '#FF6B35', bg: '#FFF0E8' },
  { path: '/games', icon: '🎮', label: 'Trò chơi', color: '#9B59B6', bg: '#F3E8FF' },
  { path: '/learning-path', icon: '🗺️', label: 'Lộ trình', color: '#00BCD4', bg: '#E0F7FA' },
  { path: '/reports', icon: '📊', label: 'Báo cáo', color: '#E91E63', bg: '#FCE4EC' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

export default function Dashboard() {
  const { user, todayReport } = useAppStore()
  const xpPercent = Math.round((user.xp / user.totalXp) * 100)

  return (
    <div className="page dashboard" id="dashboard-page">
      {/* Header */}
      <motion.div
        className="dash-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="dash-header__left">
          <div className="dash-header__avatar">
            <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%', padding: '4px' }} />
          </div>
          <div>
            <h1 className="dash-header__name">Xin chào, {user.name}! 👋</h1>
            <p className="dash-header__level">Level {user.level} · Streak {user.streak} ngày 🔥</p>
          </div>
        </div>
        <div className="dash-header__coins">
          <span className="dash-header__coin-icon">⭐</span>
          <span>{user.coins}</span>
        </div>
      </motion.div>

      {/* XP Progress */}
      <motion.div
        className="dash-xp"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="dash-xp__info">
          <span className="dash-xp__label">Kinh nghiệm</span>
          <span className="dash-xp__value">{user.xp} / {user.totalXp} XP</span>
        </div>
        <div className="dash-xp__bar">
          <motion.div
            className="dash-xp__fill"
            initial={{ width: 0 }}
            animate={{ width: `${xpPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Today Stats */}
      <motion.div
        className="dash-stats"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="dash-section-title">📅 Hôm nay</h2>
        <div className="dash-stats__grid">
          <div className="dash-stat-card">
            <span className="dash-stat-card__icon">📖</span>
            <span className="dash-stat-card__value">{todayReport.lessonsCompleted}</span>
            <span className="dash-stat-card__label">Bài học</span>
          </div>
          <div className="dash-stat-card">
            <span className="dash-stat-card__icon">🔤</span>
            <span className="dash-stat-card__value">{todayReport.wordsLearned}</span>
            <span className="dash-stat-card__label">Từ mới</span>
          </div>
          <div className="dash-stat-card">
            <span className="dash-stat-card__icon">⏱️</span>
            <span className="dash-stat-card__value">{todayReport.minutesPracticed}</span>
            <span className="dash-stat-card__label">Phút</span>
          </div>
          <div className="dash-stat-card">
            <span className="dash-stat-card__icon">🎯</span>
            <span className="dash-stat-card__value">{todayReport.pronunciationAvg}%</span>
            <span className="dash-stat-card__label">Phát âm</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="dash-actions"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="dash-section-title">🚀 Bắt đầu học</h2>
        <div className="dash-actions__grid">
          {quickActions.map((action) => (
            <motion.div key={action.path} variants={itemVariants}>
              <Link
                to={action.path}
                className="dash-action-card"
                style={{ '--action-color': action.color, '--action-bg': action.bg } as React.CSSProperties}
                id={`action-${action.path.slice(1)}`}
              >
                <span className="dash-action-card__icon">{action.icon}</span>
                <span className="dash-action-card__label">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Tutor CTA */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Link to="/ai-tutor" className="dash-ai-cta" id="ai-tutor-cta">
          <div className="dash-ai-cta__content">
            <span className="dash-ai-cta__mascot">🤖</span>
            <div>
              <h3 className="dash-ai-cta__title">Chat với AI Tutor</h3>
              <p className="dash-ai-cta__desc">Luyện nói tiếng Anh cùng giáo viên số 24/7</p>
            </div>
          </div>
          <span className="dash-ai-cta__arrow">→</span>
        </Link>
      </motion.div>
    </div>
  )
}
