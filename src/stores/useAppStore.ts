import { create } from 'zustand'
import type { UserProfile, LevelId, Badge, DailyReport, SkillScores } from '../types'

interface AppState {
  user: UserProfile
  todayReport: DailyReport
  badges: Badge[]
  // Actions
  addXp: (amount: number) => void
  addCoins: (amount: number) => void
  incrementStreak: () => void
  updateSkills: (skills: Partial<SkillScores>) => void
  recordLesson: () => void
  recordWord: () => void
  addMinutes: (mins: number) => void
  recordPronunciation: (score: number) => void
  setLevel: (level: LevelId) => void
  syncToSupabase: () => Promise<void>
}

const defaultUser: UserProfile = {
  id: 'student-1',
  name: 'Bé Harry',
  avatar: '/assets/laclac.png',
  age: 6,
  level: 'L1',
  xp: 320,
  totalXp: 500,
  streak: 5,
  coins: 150,
  badges: ['first-word', 'streak-3', 'perfect-score'],
  interests: ['animals', 'dinosaurs'],
  createdAt: '2026-07-01',
}

const defaultReport: DailyReport = {
  date: new Date().toISOString().split('T')[0],
  lessonsCompleted: 2,
  wordsLearned: 8,
  minutesPracticed: 25,
  pronunciationAvg: 78,
  streakDay: 5,
  skills: { listening: 72, speaking: 65, reading: 80, writing: 55 },
}

const defaultBadges: Badge[] = [
  { id: 'first-word', name: 'First Word', nameVi: 'Từ đầu tiên', description: 'Học từ vựng đầu tiên', icon: '🌟', color: '#FFD93D', earnedAt: '2026-07-01' },
  { id: 'streak-3', name: '3 Day Streak', nameVi: 'Chuỗi 3 ngày', description: 'Học 3 ngày liên tiếp', icon: '🔥', color: '#FF6B35', earnedAt: '2026-07-03' },
  { id: 'perfect-score', name: 'Perfect Score', nameVi: 'Điểm tuyệt đối', description: 'Đạt 100% trong 1 bài', icon: '💎', color: '#9B59B6', earnedAt: '2026-07-05' },
  { id: 'pronunciation-pro', name: 'Pronunciation Pro', nameVi: 'Phát âm chuẩn', description: 'Đạt 90%+ phát âm', icon: '🎯', color: '#2ECC71' },
  { id: 'streak-7', name: '7 Day Streak', nameVi: 'Chuỗi 7 ngày', description: 'Học 7 ngày liên tiếp', icon: '⚡', color: '#E91E63' },
  { id: 'word-master', name: 'Word Master', nameVi: 'Bậc thầy từ vựng', description: 'Học 100 từ vựng', icon: '📖', color: '#4A90D9' },
  { id: 'game-champ', name: 'Game Champion', nameVi: 'Nhà vô địch', description: 'Thắng 10 trò chơi', icon: '🏆', color: '#FFD93D' },
  { id: 'ai-friend', name: 'AI Best Friend', nameVi: 'Bạn thân AI', description: 'Chat 50 tin nhắn với AI', icon: '🤖', color: '#00BCD4' },
]

export const useAppStore = create<AppState>((set, get) => ({
  user: defaultUser,
  todayReport: defaultReport,
  badges: defaultBadges,

  addXp: (amount) => set((s) => ({
    user: { ...s.user, xp: s.user.xp + amount },
  })),
  addCoins: (amount) => set((s) => ({
    user: { ...s.user, coins: s.user.coins + amount },
  })),
  incrementStreak: () => set((s) => ({
    user: { ...s.user, streak: s.user.streak + 1 },
  })),
  updateSkills: (skills) => set((s) => ({
    todayReport: {
      ...s.todayReport,
      skills: { ...s.todayReport.skills, ...skills },
    },
  })),
  recordLesson: () => set((s) => ({
    todayReport: { ...s.todayReport, lessonsCompleted: s.todayReport.lessonsCompleted + 1 },
  })),
  recordWord: () => set((s) => ({
    todayReport: { ...s.todayReport, wordsLearned: s.todayReport.wordsLearned + 1 },
  })),
  addMinutes: (mins) => set((s) => ({
    todayReport: { ...s.todayReport, minutesPracticed: s.todayReport.minutesPracticed + mins },
  })),
  recordPronunciation: (score) => set((s) => ({
    todayReport: {
      ...s.todayReport,
      pronunciationAvg: Math.round((s.todayReport.pronunciationAvg + score) / 2),
    },
  })),
  setLevel: (level) => set((s) => ({
    user: { ...s.user, level },
  })),
  syncToSupabase: async () => {
    // This function can be called periodically or after major state changes
    const state = get()
    const { supabase } = await import('../services/supabase')
    
    // Check if Supabase is actually configured
    if (import.meta.env.VITE_SUPABASE_URL) {
      try {
        await supabase.from('users').upsert({
          id: state.user.id,
          profile_data: state.user,
          report_data: state.todayReport,
          last_sync: new Date().toISOString()
        })
      } catch (err) {
        console.error("Failed to sync to Supabase:", err)
      }
    } else {
      console.log("Supabase not configured, skipping sync")
    }
  }
}))
