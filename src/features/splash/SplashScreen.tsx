import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './SplashScreen.css'

export default function SplashScreen() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<'logo' | 'tagline' | 'done'>('logo')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('tagline'), 1200)
    const t2 = setTimeout(() => setPhase('done'), 2800)
    const t3 = setTimeout(() => navigate('/home', { replace: true }), 3400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [navigate])

  return (
    <div className="splash" id="splash-screen">
      <div className="splash__bg-circles">
        <div className="splash__circle splash__circle--1" />
        <div className="splash__circle splash__circle--2" />
        <div className="splash__circle splash__circle--3" />
      </div>

      <AnimatePresence mode="wait">
        {phase !== 'done' && (
          <motion.div
            className="splash__content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="splash__mascot"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <img src="/assets/laclac.png" alt="LacLac" className="splash__mascot-img" style={{width: '120px', height: '120px', objectFit: 'contain', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))'}} />
            </motion.div>

            <motion.h1
              className="splash__title"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Harry<span className="splash__amp">&</span>LacLac
            </motion.h1>

            {phase === 'tagline' && (
              <motion.p
                className="splash__tagline"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Học tiếng Anh cùng AI · Phát âm chuẩn bản xứ 🎯
              </motion.p>
            )}

            <motion.div
              className="splash__stars"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {['⭐', '🌟', '✨', '🌟', '⭐'].map((s, i) => (
                <motion.span
                  key={i}
                  className="splash__star"
                  animate={{ y: [0, -8, 0], rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                >
                  {s}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
