// ============ User & Profile ============
export interface UserProfile {
  id: string
  name: string
  avatar: string
  age: number
  level: LevelId
  xp: number
  totalXp: number
  streak: number
  coins: number
  badges: string[]
  interests: string[]
  createdAt: string
}

export type LevelId = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5'

export interface LevelInfo {
  id: LevelId
  name: string
  cambridgeLevel: string
  ageRange: string
  description: string
  color: string
  requiredXp: number
}

// ============ Vocabulary ============
export interface Word {
  id: string
  word: string
  phonetic: string
  partOfSpeech: string
  theme: string
  level: LevelId
  vietnameseMeaning: string
  exampleSentence: string
  image: string
  audioUrl?: string
}

export interface Topic {
  id: string
  name: string
  nameVi: string
  icon: string
  color: string
  level: LevelId
  wordCount: number
  words?: Word[]
}

// ============ Lessons ============
export interface Lesson {
  id: string
  unitId: string
  title: string
  titleVi: string
  type: LessonType
  level: LevelId
  duration: number
  xpReward: number
  steps: LessonStep[]
  isCompleted: boolean
  score?: number
}

export type LessonType = 'vocabulary' | 'listening' | 'speaking' | 'dialogue' | 'quiz' | 'game'

export interface LessonStep {
  id: string
  type: 'intro' | 'flashcard' | 'listen_repeat' | 'speak' | 'match' | 'quiz' | 'dialogue' | 'summary'
  content: StepContent
}

export interface StepContent {
  word?: Word
  words?: Word[]
  sentence?: string
  question?: string
  options?: string[]
  correctAnswer?: string
  imageUrl?: string
  audioUrl?: string
  dialogue?: DialogueLine[]
}

export interface DialogueLine {
  speaker: 'teacher' | 'student'
  text: string
  audioUrl?: string
}

// ============ Pronunciation ============
export interface PronunciationResult {
  overallScore: number
  words: WordScore[]
  feedback: string
}

export interface WordScore {
  word: string
  phonetic: string
  score: number
  status: 'correct' | 'close' | 'incorrect'
  feedback?: string
}

// ============ Gamification ============
export interface Badge {
  id: string
  name: string
  nameVi: string
  description: string
  icon: string
  color: string
  earnedAt?: string
}

export interface DailyReport {
  date: string
  lessonsCompleted: number
  wordsLearned: number
  minutesPracticed: number
  pronunciationAvg: number
  streakDay: number
  skills: SkillScores
}

export interface SkillScores {
  listening: number
  speaking: number
  reading: number
  writing: number
}

// ============ AI Tutor ============
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  audioUrl?: string
  timestamp: number
}

// ============ Audio Cache ============
export interface CachedAudio {
  id: string
  text: string
  audioUrl: string
  category: 'encouragement' | 'instruction' | 'feedback' | 'lesson' | 'vocabulary' | 'dynamic'
  createdAt: string
}
