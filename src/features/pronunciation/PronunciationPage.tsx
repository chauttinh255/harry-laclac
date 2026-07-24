import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { vocabularyData } from '../../data/vocabularyData'
import './PronunciationPage.css'

const allWords = Object.values(vocabularyData).flat()

export default function PronunciationPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [result, setResult] = useState<{ text: string; score: number; status: string } | null>(null)
  const recognitionRef = useRef<any>(null)

  const word = allWords[currentIndex % allWords.length]

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'; u.rate = 0.75
    speechSynthesis.speak(u)
  }

  const startListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert('Trình duyệt không hỗ trợ nhận diện giọng nói'); return }

    const recognition = new SR()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognitionRef.current = recognition

    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (e: any) => {
      const spoken = e.results[0][0].transcript.toLowerCase().trim()
      const target = word.word.toLowerCase().trim()
      const confidence = e.results[0][0].confidence
      const isMatch = spoken.includes(target) || target.includes(spoken)
      const score = isMatch ? Math.round(confidence * 100) : Math.round(confidence * 40)
      const status = score >= 80 ? 'correct' : score >= 50 ? 'close' : 'incorrect'
      setResult({ text: spoken, score, status })
    }
    recognition.onerror = () => { setIsListening(false); setResult({ text: '', score: 0, status: 'error' }) }
    recognition.onend = () => setIsListening(false)
    recognition.start()
  }

  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false) }

  const nextWord = () => {
    setResult(null)
    setCurrentIndex(i => i + 1)
  }

  const statusConfig: Record<string, { emoji: string; text: string; color: string }> = {
    correct: { emoji: '🎉', text: 'Tuyệt vời! Chính xác!', color: 'var(--success)' },
    close: { emoji: '👍', text: 'Gần đúng rồi! Thử lại nhé!', color: 'var(--warning)' },
    incorrect: { emoji: '💪', text: 'Chưa đúng, nghe lại và thử lại!', color: 'var(--danger)' },
    error: { emoji: '🎤', text: 'Không nghe được, thử lại nhé!', color: 'var(--text-secondary)' },
  }

  return (
    <div className="page pron-page" id="pronunciation-page">
      <div className="page-header">
        <h1 className="page-title">🎤 Luyện phát âm</h1>
        <p className="page-subtitle">Nghe, nói theo và nhận phản hồi ngay</p>
      </div>

      {/* Word Display */}
      <motion.div
        className="pron-word-card"
        key={currentIndex}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <img src={word.image} alt={word.word} className="pron-word-card__image" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '24px', marginBottom: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
        <h2 className="pron-word-card__word">{word.word}</h2>
        <p className="pron-word-card__phonetic">{word.phonetic}</p>
        <p className="pron-word-card__meaning">{word.vietnameseMeaning}</p>
      </motion.div>

      {/* Listen Button */}
      <div className="pron-actions">
        <button className="pron-btn pron-btn--listen" onClick={() => speak(word.word)}>
          <span>🔊</span> Nghe chuẩn
        </button>

        {/* Record Button */}
        <motion.button
          className={`pron-btn pron-btn--record ${isListening ? 'recording' : ''}`}
          onClick={isListening ? stopListening : startListening}
          animate={isListening ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <span>{isListening ? '⏹️' : '🎙️'}</span>
          {isListening ? 'Đang nghe...' : 'Bé nói'}
        </motion.button>
      </div>

      {/* Waveform Animation */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            className="pron-waveform"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="pron-waveform__bar"
                animate={{ height: [4, Math.random() * 30 + 10, 4] }}
                transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5, delay: i * 0.05 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            className="pron-result"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            style={{ '--result-color': statusConfig[result.status]?.color } as React.CSSProperties}
          >
            <div className="pron-result__header">
              <span className="pron-result__emoji">{statusConfig[result.status]?.emoji}</span>
              <div>
                <p className="pron-result__status">{statusConfig[result.status]?.text}</p>
                {result.text && <p className="pron-result__heard">Bé nói: "{result.text}"</p>}
              </div>
            </div>

            {result.status !== 'error' && (
              <div className="pron-result__score-wrap">
                <div className="pron-result__score-ring">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#E8F0FE" strokeWidth="8" />
                    <motion.circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke={statusConfig[result.status]?.color}
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={264}
                      initial={{ strokeDashoffset: 264 }}
                      animate={{ strokeDashoffset: 264 - (264 * result.score / 100) }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="pron-result__score-text">{result.score}%</span>
                </div>
              </div>
            )}

            <div className="pron-result__actions">
              <button className="pron-btn pron-btn--retry" onClick={startListening}>🔄 Thử lại</button>
              <button className="pron-btn pron-btn--next" onClick={nextWord}>Tiếp → </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
