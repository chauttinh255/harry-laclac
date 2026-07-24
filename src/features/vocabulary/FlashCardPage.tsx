import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { topics, vocabularyData } from '../../data/vocabularyData'
import { sounds } from '../../utils/soundManager'
import { playAudio } from '../../services/audioCache'
import './FlashCardPage.css'

export default function FlashCardPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [direction, setDirection] = useState(0)

  const topic = topics.find(t => t.id === topicId)
  const words = vocabularyData[topicId || ''] || []
  const word = words[currentIndex]

  if (!topic || !word) {
    return (
      <div className="page" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center'}}>
        <span style={{fontSize: '4rem', marginBottom: '1rem'}}>🚧</span>
        <h2>Chủ đề này đang được cập nhật...</h2>
        <p style={{color: '#666', marginTop: '0.5rem'}}>Daddy Alex đang thêm từ vựng mới cho phần này nhé!</p>
        <button onClick={() => navigate(-1)} style={{marginTop: '2rem', padding: '12px 24px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600}}>Quay lại</button>
      </div>
    )
  }

  const next = () => {
    if (currentIndex < words.length - 1) {
      sounds.playClick()
      setDirection(1)
      setIsFlipped(false)
      setCurrentIndex(i => i + 1)
    }
  }
  const prev = () => {
    if (currentIndex > 0) {
      sounds.playClick()
      setDirection(-1)
      setIsFlipped(false)
      setCurrentIndex(i => i - 1)
    }
  }
  const speak = (text: string) => {
    playAudio(text)
  }

  const progress = ((currentIndex + 1) / words.length) * 100

  return (
    <div className="page flashcard-page" id="flashcard-page">
      {/* Header */}
      <div className="fc-header">
        <button className="fc-back" onClick={() => navigate('/vocabulary')}>← Quay lại</button>
        <div className="fc-header__info">
          <span className="fc-header__topic">{topic.icon} {topic.name}</span>
          <span className="fc-header__count">{currentIndex + 1} / {words.length}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="fc-progress">
        <motion.div
          className="fc-progress__fill"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          style={{ background: topic.color }}
        />
      </div>

      {/* Flashcard */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          className={`fc-card ${isFlipped ? 'flipped' : ''}`}
          onClick={() => { sounds.playClick(); setIsFlipped(!isFlipped) }}
          custom={direction}
          initial={{ x: direction * 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="fc-card__inner">
            {/* Front */}
            <div className="fc-card__front">
              <img src={word.image} alt={word.word} className="fc-card__image" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%', marginBottom: '1rem', border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <h2 className="fc-card__word">{word.word}</h2>
              <p className="fc-card__phonetic">{word.phonetic}</p>
              <button
                className="fc-card__speak"
                onClick={(e) => { e.stopPropagation(); speak(word.word) }}
              >
                🔊 Nghe phát âm
              </button>
              <p className="fc-card__hint">Nhấn để lật thẻ</p>
            </div>
            {/* Back */}
            <div className="fc-card__back">
              <p className="fc-card__meaning">{word.vietnameseMeaning}</p>
              <p className="fc-card__pos">{word.partOfSpeech}</p>
              <div className="fc-card__example">
                <p className="fc-card__example-label">Ví dụ:</p>
                <p className="fc-card__example-text">"{word.exampleSentence}"</p>
                <button
                  className="fc-card__speak fc-card__speak--small"
                  onClick={(e) => { e.stopPropagation(); speak(word.exampleSentence) }}
                >
                  🔊 Nghe câu
                </button>
              </div>
              <p className="fc-card__hint">Nhấn để lật lại</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="fc-nav">
        <button className="fc-nav__btn" onClick={prev} disabled={currentIndex === 0}>
          ← Trước
        </button>
        <button
          className="fc-nav__btn fc-nav__btn--speak"
          onClick={() => speak(word.word)}
        >
          🔊
        </button>
        <button className="fc-nav__btn" onClick={next} disabled={currentIndex === words.length - 1}>
          Tiếp →
        </button>
      </div>
    </div>
  )
}
