import { motion } from 'framer-motion'
import './LessonPage.css'

const units = [
  { id: 'u1', name: 'Unit 1: Greetings', nameVi: 'Chào hỏi', icon: '👋', lessons: 3, completed: 2, color: '#4A90D9' },
  { id: 'u2', name: 'Unit 2: Animals', nameVi: 'Động vật', icon: '🐾', lessons: 4, completed: 1, color: '#FF6B35' },
  { id: 'u3', name: 'Unit 3: Family', nameVi: 'Gia đình', icon: '👨‍👩‍👧‍👦', lessons: 3, completed: 0, color: '#E91E63' },
  { id: 'u4', name: 'Unit 4: Colors & Numbers', nameVi: 'Màu sắc & Số', icon: '🎨', lessons: 4, completed: 0, color: '#9B59B6' },
  { id: 'u5', name: 'Unit 5: Food', nameVi: 'Đồ ăn', icon: '🍎', lessons: 3, completed: 0, color: '#2ECC71' },
  { id: 'u6', name: 'Unit 6: My School', nameVi: 'Trường học', icon: '🏫', lessons: 4, completed: 0, color: '#00BCD4' },
]

export default function LessonPage() {
  return (
    <div className="page lesson-page" id="lesson-page">
      <div className="page-header">
        <h1 className="page-title">📚 Bài học</h1>
        <p className="page-subtitle">Cambridge YLE Starters · Level 1</p>
      </div>

      <div className="lesson-list">
        {units.map((unit, i) => {
          const progress = unit.completed / unit.lessons * 100
          return (
            <motion.div
              key={unit.id}
              className="lesson-card"
              style={{ '--unit-color': unit.color } as React.CSSProperties}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="lesson-card__icon">{unit.icon}</div>
              <div className="lesson-card__info">
                <h3 className="lesson-card__name">{unit.name}</h3>
                <p className="lesson-card__name-vi">{unit.nameVi}</p>
                <div className="lesson-card__progress">
                  <div className="lesson-card__bar">
                    <div className="lesson-card__fill" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="lesson-card__count">{unit.completed}/{unit.lessons}</span>
                </div>
              </div>
              <span className="lesson-card__arrow">›</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
