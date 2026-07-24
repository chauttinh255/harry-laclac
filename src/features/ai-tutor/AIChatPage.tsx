import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getGeminiResponse } from '../../services/gemini'
import { playAudio } from '../../services/audioCache'
import './AIChatPage.css'

const greetings = [
  "Hello! It's Daddy! Are you ready to learn some English with me?",
  "Hi my little angels! Ready to practice English today?",
  "Welcome back! Daddy missed you! Shall we practice some new words together?",
]

export default function AIChatPage() {
  const navigate = useNavigate()
  const [aiSubtitle, setAiSubtitle] = useState('')
  const [userSubtitle, setUserSubtitle] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isThinking, setIsThinking] = useState(false)

  // Initialize with a greeting
  useEffect(() => {
    const greeting = greetings[Math.floor(Math.random() * greetings.length)]
    setAiSubtitle(greeting)
    // Wait a little bit before speaking
    setTimeout(() => {
      setIsSpeaking(true)
      speak(greeting)
    }, 500)
  }, [])

  const speak = (text: string) => {
    const clean = text.replace(/[\u{1F600}-\u{1F9FF}]/gu, '').trim()
    playAudio(clean)
    // Roughly estimate when speaking is done
    const speakingDuration = Math.max(2000, clean.split(' ').length * 350)
    setTimeout(() => {
      setIsSpeaking(false)
    }, speakingDuration)
  }

  const startVoiceInput = () => {
    // 1. Unlock Audio Context on first interaction
    const unlockAudio = new SpeechSynthesisUtterance('');
    speechSynthesis.speak(unlockAudio);

    // 2. Start Speech Recognition
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      setAiSubtitle("Trình duyệt không hỗ trợ nhận diện giọng nói. Bé hãy dùng Chrome hoặc Safari nhé!");
      return
    }
    
    // Stop any current speaking
    setIsSpeaking(false)
    
    const recognition = new SR()
    recognition.lang = 'en-US'
    
    recognition.onstart = () => {
      setIsListening(true)
      setUserSubtitle("Đang nghe...")
      setAiSubtitle("")
    }
    
    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      setUserSubtitle(text)
      handleUserMessage(text)
    }
    
    recognition.onend = () => {
      setIsListening(false)
    }
    
    recognition.onerror = (event: any) => {
      setIsListening(false)
      if (event.error === 'not-allowed') {
        setUserSubtitle("Vui lòng cấp quyền sử dụng Micro cho trình duyệt nhé!");
      } else {
        setUserSubtitle("Không nghe rõ, bé nhấn Mic để thử lại nhé!");
      }
    }
    
    try {
      recognition.start()
    } catch (e) {
      setIsListening(false)
      setUserSubtitle("Lỗi khởi động Micro. Thử lại nhé!");
    }
  }

  const handleUserMessage = async (text: string) => {
    setIsThinking(true)
    
    try {
      const aiResponseText = await getGeminiResponse(text)
      setIsThinking(false)
      setAiSubtitle(aiResponseText)
      setIsSpeaking(true)
      speak(aiResponseText)
    } catch (error) {
      setIsThinking(false)
      setAiSubtitle("Xin lỗi, Daddy đang bận một chút, con gọi lại sau nhé!")
    }
  }

  return (
    <div className="voice-call-page" id="ai-chat-page">
      {/* Header */}
      <div className="voice-call__header">
        <button className="voice-call__back" onClick={() => navigate('/home')}>←</button>
        <span className="voice-call__status">{isListening ? 'Đang nghe...' : isThinking ? 'Đang suy nghĩ...' : 'Đang hoạt động'}</span>
      </div>

      {/* Main Call Area */}
      <div className="voice-call__main">
        <div className={`voice-call__avatar-container ${(isSpeaking || isListening) ? 'active' : ''}`}>
          <div className="voice-call__pulse-ring ring-1"></div>
          <div className="voice-call__pulse-ring ring-2"></div>
          <div className="voice-call__pulse-ring ring-3"></div>
          
          <div className="voice-call__avatar">
            <img src="/assets/laclac.png" alt="Daddy Alex" />
          </div>
        </div>
        
        <h2 className="voice-call__name">Daddy (Alex)</h2>
      </div>

      {/* Subtitles Area */}
      <div className="voice-call__subtitles">
        <AnimatePresence mode="wait">
          {userSubtitle && (
            <motion.div 
              key={`user-${userSubtitle}`}
              className="subtitle subtitle--user"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              "{userSubtitle}"
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          {aiSubtitle && (
            <motion.div 
              key={`ai-${aiSubtitle}`}
              className="subtitle subtitle--ai"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {aiSubtitle}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="voice-call__controls">
        <button 
          className={`voice-call__mic-btn ${isListening ? 'listening' : ''}`}
          onClick={startVoiceInput}
        >
          🎤
        </button>
        <p className="voice-call__hint">Nhấn để nói chuyện với Daddy</p>
      </div>
    </div>
  )
}
