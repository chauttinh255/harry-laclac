import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useAppStore } from '../../stores/useAppStore'
import { useNavigate } from 'react-router-dom'
import './ParentDashboard.css'

const weekData = [
  { day: 'T2', minutes: 20, words: 5 },
  { day: 'T3', minutes: 35, words: 8 },
  { day: 'T4', minutes: 15, words: 3 },
  { day: 'T5', minutes: 40, words: 10 },
  { day: 'T6', minutes: 25, words: 6 },
  { day: 'T7', minutes: 30, words: 8 },
  { day: 'CN', minutes: 45, words: 12 },
]

export default function ParentDashboard() {
  const { user, todayReport } = useAppStore()
  const navigate = useNavigate()

  const skillData = [
    { skill: 'Nghe', value: todayReport.skills.listening },
    { skill: 'Nói', value: todayReport.skills.speaking },
    { skill: 'Đọc', value: todayReport.skills.reading },
    { skill: 'Viết', value: todayReport.skills.writing },
  ]

  return (
    <div className="page report-page" id="parent-dashboard">
      <div className="report-header">
        <button className="report-header__back" onClick={() => navigate('/profile')}>← Quay lại</button>
        <h1 className="page-title">📊 Báo cáo học tập</h1>
        <p className="page-subtitle">Dành cho phụ huynh · {todayReport.date}</p>
      </div>

      {/* Student Summary */}
      <motion.div className="report-student" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="report-student__avatar">
          <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%', padding: '4px' }} />
        </div>
        <div>
          <h2>{user.name}</h2>
          <p>Level {user.level} · Streak {user.streak} ngày 🔥</p>
        </div>
      </motion.div>

      {/* Today Stats */}
      <motion.div className="report-today" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
        <h3 className="report-section-title">📅 Kết quả hôm nay</h3>
        <div className="report-stats">
          <div className="report-stat" style={{ '--stat-color': '#4A90D9' } as React.CSSProperties}>
            <span className="report-stat__value">{todayReport.lessonsCompleted}</span>
            <span className="report-stat__label">Bài học</span>
          </div>
          <div className="report-stat" style={{ '--stat-color': '#2ECC71' } as React.CSSProperties}>
            <span className="report-stat__value">{todayReport.wordsLearned}</span>
            <span className="report-stat__label">Từ mới</span>
          </div>
          <div className="report-stat" style={{ '--stat-color': '#FF6B35' } as React.CSSProperties}>
            <span className="report-stat__value">{todayReport.minutesPracticed}p</span>
            <span className="report-stat__label">Thời gian</span>
          </div>
          <div className="report-stat" style={{ '--stat-color': '#9B59B6' } as React.CSSProperties}>
            <span className="report-stat__value">{todayReport.pronunciationAvg}%</span>
            <span className="report-stat__label">Phát âm</span>
          </div>
        </div>
      </motion.div>

      {/* Skills Radar */}
      <motion.div className="report-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <h3 className="report-section-title">🎯 Năng lực 4 kỹ năng</h3>
        <div className="report-chart">
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={skillData}>
              <PolarGrid stroke="#E8F0FE" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 13, fontWeight: 700, fill: '#2C3E50' }} />
              <Radar dataKey="value" stroke="#4A90D9" fill="#4A90D9" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Weekly Progress */}
      <motion.div className="report-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        <h3 className="report-section-title">📈 Tiến bộ tuần này</h3>
        <div className="report-chart">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F0FE" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="minutes" fill="#4A90D9" radius={[4, 4, 0, 0]} name="Phút học" />
              <Bar dataKey="words" fill="#2ECC71" radius={[4, 4, 0, 0]} name="Từ vựng" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div className="report-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
        <h3 className="report-section-title">💡 Gợi ý cho phụ huynh</h3>
        <div className="report-tips">
          <div className="report-tip">
            <span>🎤</span>
            <p>Bé cần luyện thêm <strong>kỹ năng Nói</strong>. Hãy khuyến khích bé sử dụng AI Tutor mỗi ngày 10 phút.</p>
          </div>
          <div className="report-tip">
            <span>📖</span>
            <p>Kỹ năng <strong>Đọc</strong> đang rất tốt! Bé có thể thử các bài đọc nâng cao.</p>
          </div>
          <div className="report-tip">
            <span>🔥</span>
            <p>Chuỗi học {user.streak} ngày liên tục. <strong>Tuyệt vời!</strong> Hãy duy trì nhé!</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
