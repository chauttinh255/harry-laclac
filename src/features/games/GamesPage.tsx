import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { vocabularyData } from '../../data/vocabularyData'
import { sounds } from '../../utils/soundManager'
import './GamesPage.css'

const allWords = Object.values(vocabularyData).flat()
const getRandomWords = (count: number) => {
  const shuffled = [...allWords].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

type GameType = 'menu' | 'matching' | 'quiz'

export default function GamesPage() {
  const [game, setGame] = useState<GameType>('menu')
  const [matchPairs, setMatchPairs] = useState<Array<{ id: string; text: string; type: 'word' | 'image'; matched: boolean; selected: boolean; wordId: string }>>([])
  const [quizWords, setQuizWords] = useState(getRandomWords(5))
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const startMatching = () => {
    const words = getRandomWords(6)
    const pairs = words.flatMap(w => [
      { id: `w-${w.id}`, text: w.word, type: 'word' as const, matched: false, selected: false, wordId: w.id },
      { id: `e-${w.id}`, text: w.image, type: 'image' as const, matched: false, selected: false, wordId: w.id },
    ]).sort(() => Math.random() - 0.5)
    setMatchPairs(pairs)
    setGame('matching')
  }

  const handleMatchSelect = (id: string) => {
    const selected = matchPairs.filter(p => p.selected && !p.matched)
    if (selected.length === 1 && selected[0].id !== id) {
      const card = matchPairs.find(p => p.id === id)!
      if (selected[0].wordId === card.wordId) {
        setMatchPairs(prev => prev.map(p =>
          p.wordId === card.wordId ? { ...p, matched: true, selected: false } : p
        ))
        sounds.playSuccess()
        
        // Check if all matched now
        const newMatchedCount = matchPairs.filter(p => p.matched).length + 2
        if (newMatchedCount === matchPairs.length) sounds.playComplete()
      } else {
        setMatchPairs(prev => prev.map(p => ({ ...p, selected: p.id === id })))
        sounds.playError()
        setTimeout(() => setMatchPairs(prev => prev.map(p => ({ ...p, selected: false }))), 800)
      }
    } else {
      sounds.playClick()
      setMatchPairs(prev => prev.map(p => p.id === id ? { ...p, selected: true } : { ...p, selected: !p.matched && false }))
    }
  }

  const startQuiz = () => {
    setQuizWords(getRandomWords(5))
    setQuizIndex(0); setQuizScore(0); setSelectedAnswer(null)
    setGame('quiz')
  }

  const currentQuizWord = quizWords[quizIndex]
  const quizOptions = currentQuizWord
    ? [currentQuizWord.vietnameseMeaning, ...getRandomWords(3).map(w => w.vietnameseMeaning)]
        .filter((v, i, a) => a.indexOf(v) === i).sort(() => Math.random() - 0.5).slice(0, 4)
    : []

  const handleQuizAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    if (answer === currentQuizWord.vietnameseMeaning) {
      setQuizScore(s => s + 1)
      sounds.playSuccess()
    } else {
      sounds.playError()
    }
    setTimeout(() => {
      if (quizIndex < quizWords.length - 1) {
        setQuizIndex(i => i + 1); setSelectedAnswer(null)
      } else {
        sounds.playComplete()
      }
    }, 1000)
  }

  const allMatched = matchPairs.length > 0 && matchPairs.every(p => p.matched)
  const quizDone = quizIndex === quizWords.length - 1 && selectedAnswer !== null

  if (game === 'menu') {
    return (
      <div className="page games-page" id="games-page">
        <div className="page-header">
          <h1 className="page-title">🎮 Trò chơi</h1>
          <p className="page-subtitle">Học mà chơi, chơi mà học!</p>
        </div>
        <div className="games-grid">
          {[
            { id: 'matching', icon: '🃏', name: 'Nối từ', desc: 'Nối từ với hình ảnh', color: '#FF6B35', action: startMatching },
            { id: 'quiz', icon: '❓', name: 'Trắc nghiệm', desc: 'Chọn nghĩa đúng', color: '#4A90D9', action: startQuiz },
            { id: 'spelling', icon: '✍️', name: 'Đánh vần', desc: 'Sắp xếp chữ cái', color: '#2ECC71', action: () => {} },
            { id: 'listening', icon: '👂', name: 'Nghe từ', desc: 'Nghe và chọn đúng', color: '#9B59B6', action: () => {} },
          ].map((g, i) => (
            <motion.button
              key={g.id} className="game-card"
              style={{ '--game-color': g.color } as React.CSSProperties}
              onClick={g.action}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="game-card__icon">{g.icon}</span>
              <h3 className="game-card__name">{g.name}</h3>
              <p className="game-card__desc">{g.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  if (game === 'matching') {
    return (
      <div className="page games-page">
        <div className="game-header">
          <button className="game-header__back" onClick={() => setGame('menu')}>← Quay lại</button>
          <h2>🃏 Nối từ - hình</h2>
        </div>
        {allMatched ? (
          <motion.div className="game-complete" initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <span className="game-complete__emoji">🎉</span>
            <h2>Tuyệt vời!</h2>
            <p>Bạn đã hoàn thành!</p>
            <button className="game-complete__btn" onClick={startMatching}>Chơi lại</button>
          </motion.div>
        ) : (
          <div className="match-grid">
            {matchPairs.map(p => (
              <motion.button
                key={p.id}
                className={`match-card ${p.selected ? 'selected' : ''} ${p.matched ? 'matched' : ''}`}
                onClick={() => !p.matched && handleMatchSelect(p.id)}
                whileTap={{ scale: 0.95 }}
                animate={p.matched ? { scale: [1, 1.1, 1] } : {}}
              >
                {p.type === 'image' ? <img src={p.text} alt="matching" className="match-card__image" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '16px' }} /> : <span className="match-card__word">{p.text}</span>}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="page games-page">
      <div className="game-header">
        <button className="game-header__back" onClick={() => setGame('menu')}>← Quay lại</button>
        <h2>❓ Trắc nghiệm · {quizIndex + 1}/{quizWords.length}</h2>
      </div>
      {quizDone ? (
        <motion.div className="game-complete" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <span className="game-complete__emoji">{quizScore >= 4 ? '🏆' : quizScore >= 3 ? '⭐' : '💪'}</span>
          <h2>{quizScore}/{quizWords.length} điểm</h2>
          <p>{quizScore >= 4 ? 'Xuất sắc!' : quizScore >= 3 ? 'Giỏi lắm!' : 'Cố gắng thêm nhé!'}</p>
          <button className="game-complete__btn" onClick={startQuiz}>Chơi lại</button>
        </motion.div>
      ) : currentQuizWord && (
        <div className="quiz-content">
          <motion.div className="quiz-word" key={quizIndex} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <img src={currentQuizWord.image} alt={currentQuizWord.word} className="quiz-word__image" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '24px', marginBottom: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <h2 className="quiz-word__text">{currentQuizWord.word}</h2>
            <p className="quiz-word__phonetic">{currentQuizWord.phonetic}</p>
          </motion.div>
          <div className="quiz-options">
            {quizOptions.map(opt => {
              const isCorrect = opt === currentQuizWord.vietnameseMeaning
              const isSelected = selectedAnswer === opt
              let cls = 'quiz-option'
              if (selectedAnswer) cls += isCorrect ? ' correct' : isSelected ? ' wrong' : ''
              return (
                <motion.button
                  key={opt} className={cls}
                  onClick={() => !selectedAnswer && handleQuizAnswer(opt)}
                  whileTap={{ scale: 0.97 }}
                >
                  {opt}
                </motion.button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
