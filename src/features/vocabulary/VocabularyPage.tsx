import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { topics } from '../../data/vocabularyData'
import './VocabularyPage.css'

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }

export default function VocabularyPage() {
  return (
    <div className="page vocab-page" id="vocabulary-page">
      <div className="page-header">
        <h1 className="page-title">📖 Kho từ vựng</h1>
        <p className="page-subtitle">Chọn chủ đề yêu thích để bắt đầu học</p>
      </div>

      <motion.div
        className="vocab-grid"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {topics.map((topic) => (
          <motion.div key={topic.id} variants={item}>
            <Link
              to={`/vocabulary/${topic.id}`}
              className="vocab-card"
              style={{ '--topic-color': topic.color } as React.CSSProperties}
              id={`topic-${topic.id}`}
            >
              <div className="vocab-card__icon-wrap">
                <span className="vocab-card__icon">{topic.icon}</span>
              </div>
              <div className="vocab-card__info">
                <h3 className="vocab-card__name">{topic.name}</h3>
                <p className="vocab-card__name-vi">{topic.nameVi}</p>
                <div className="vocab-card__meta">
                  <span className="vocab-card__count">{topic.wordCount} từ</span>
                  <span className="vocab-card__level">{topic.level}</span>
                </div>
              </div>
              <span className="vocab-card__arrow">›</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
