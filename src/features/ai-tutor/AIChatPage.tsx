import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { ChatMessage } from '../../types'
import { getGeminiResponse } from '../../services/gemini'
import { playAudio } from '../../services/audioCache'
import './AIChatPage.css'

// (System prompt is now in services/gemini.ts)

const greetings = [
  "Hello! 👋 It's Daddy! Are you ready to learn some English with me?",
  "Hi my little angels! 🌟 Ready to practice English today? Let's start with something fun!",
  "Welcome back! 🎉 Daddy missed you! Shall we practice some new words together?",
]

export default function AIChatPage() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '0', role: 'assistant',
    content: greetings[Math.floor(Math.random() * greetings.length)],
    timestamp: Date.now(),
  }])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const speak = (text: string) => {
    const clean = text.replace(/[\u{1F600}-\u{1F9FF}]/gu, '').trim()
    playAudio(clean)
  }

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(), role: 'user',
      content: text, timestamp: Date.now(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Call Gemini API
    const aiResponseText = await getGeminiResponse(text)
    
    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(), role: 'assistant',
      content: aiResponseText,
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, aiMsg])
    setIsTyping(false)
    speak(aiMsg.content)
  }

  const startVoiceInput = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    const recognition = new SR()
    recognition.lang = 'en-US'
    recognition.onstart = () => setIsVoiceMode(true)
    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      setInput(text)
      sendMessage(text)
    }
    recognition.onend = () => setIsVoiceMode(false)
    recognition.onerror = () => setIsVoiceMode(false)
    recognition.start()
  }

  return (
    <div className="ai-chat" id="ai-chat-page">
      {/* Header */}
      <div className="ai-chat__header">
        <button className="ai-chat__back" onClick={() => navigate('/home')}>←</button>
        <div className="ai-chat__header-info">
          <div className="ai-chat__avatar">
            <img src="/assets/laclac.png" alt="LacLac" style={{width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%'}} />
          </div>
          <div>
            <h2 className="ai-chat__name">Daddy (Alex)</h2>
            <span className="ai-chat__status">● Đang hoạt động</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="ai-chat__messages">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`ai-chat__msg ai-chat__msg--${msg.role}`}
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              {msg.role === 'assistant' && <img src="/assets/laclac.png" alt="LacLac" className="ai-chat__msg-avatar" style={{width: '32px', height: '32px', objectFit: 'contain', borderRadius: '50%'}} />}
              <div className="ai-chat__msg-bubble">
                <p>{msg.content}</p>
                {msg.role === 'assistant' && (
                  <button className="ai-chat__msg-speak" onClick={() => speak(msg.content)}>🔊</button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            className="ai-chat__msg ai-chat__msg--assistant"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <img src="/assets/laclac.png" alt="LacLac" className="ai-chat__msg-avatar" style={{width: '32px', height: '32px', objectFit: 'contain', borderRadius: '50%'}} />
            <div className="ai-chat__msg-bubble ai-chat__typing">
              <span /><span /><span />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="ai-chat__input-area">
        <motion.button
          className={`ai-chat__voice-btn ${isVoiceMode ? 'active' : ''}`}
          onClick={startVoiceInput}
          animate={isVoiceMode ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          🎤
        </motion.button>
        <input
          className="ai-chat__input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Nhắn tin hoặc nhấn 🎤 để nói..."
        />
        <button
          className="ai-chat__send-btn"
          onClick={() => sendMessage(input)}
          disabled={!input.trim()}
        >
          ➤
        </button>
      </div>
    </div>
  )
}
