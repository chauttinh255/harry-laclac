import { motion } from 'framer-motion'
import { useAppStore } from '../../stores/useAppStore'
import './LearningPathPage.css'

const levels = [
  { id: 'L0', name: 'Pre-Starter', age: '4-5 tuổi', cambridge: 'Pre-A1', words: 100, color: '#FFD93D', status: 'completed' as const },
  { id: 'L1', name: 'Starter', age: '5-6 tuổi', cambridge: 'Pre-A1', words: 300, color: '#2ECC71', status: 'current' as const },
  { id: 'L2', name: 'Mover', age: '7-8 tuổi', cambridge: 'A1', words: 400, color: '#4A90D9', status: 'locked' as const },
  { id: 'L3', name: 'Flyer', age: '8-9 tuổi', cambridge: 'A1+', words: 350, color: '#9B59B6', status: 'locked' as const },
  { id: 'L4', name: 'Advanced', age: '9-10 tuổi', cambridge: 'A2', words: 500, color: '#FF6B35', status: 'locked' as const },
  { id: 'L5', name: 'Master', age: '10-12 tuổi', cambridge: 'A2+', words: 600, color: '#E91E63', status: 'locked' as const },
]

export default function LearningPathPage() {
  const { user } = useAppStore()

  return (
    <div className="page lp-page" id="learning-path-page">
      <div className="page-header">
        <h1 className="page-title">🗺️ Lộ trình học</h1>
        <p className="page-subtitle">Hành trình phát triển ngôn ngữ toàn diện</p>
      </div>

      {/* Current Level Badge */}
      <motion.div
        className="lp-current"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="lp-current__avatar">
          <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%', padding: '4px' }} />
        </div>
        <div>
          <p className="lp-current__name">{user.name}</p>
          <p className="lp-current__level">Level {user.level} · Chuẩn Cambridge</p>
        </div>
        <div className="lp-current__badge">⭐</div>
      </motion.div>

      {/* Path */}
      <div className="lp-path">
        {levels.map((level, i) => (
          <motion.div
            key={level.id}
            className={`lp-node lp-node--${level.status}`}
            initial={{ x: i % 2 === 0 ? -30 : 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            {i > 0 && <div className={`lp-connector ${levels[i-1].status === 'completed' || levels[i-1].status === 'current' ? 'active' : ''}`} />}
            <div className="lp-node__circle" style={{ '--node-color': level.color } as React.CSSProperties}>
              {level.status === 'completed' ? '✅' : level.status === 'current' ? '📍' : '🔒'}
            </div>
            <div className="lp-node__info">
              <h3 className="lp-node__name">{level.name}</h3>
              <p className="lp-node__detail">{level.cambridge} · {level.age}</p>
              <p className="lp-node__words">{level.words} từ vựng</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
