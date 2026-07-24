import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import SplashScreen from './features/splash/SplashScreen'
import Dashboard from './features/dashboard/Dashboard'
import VocabularyPage from './features/vocabulary/VocabularyPage'
import FlashCardPage from './features/vocabulary/FlashCardPage'
import PronunciationPage from './features/pronunciation/PronunciationPage'
import AIChatPage from './features/ai-tutor/AIChatPage'
import GamesPage from './features/games/GamesPage'
import LearningPathPage from './features/learning-path/LearningPathPage'
import LessonPage from './features/lessons/LessonPage'
import ParentDashboard from './features/reports/ParentDashboard'
import ProfilePage from './features/profile/ProfilePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route element={<MainLayout />}>
        <Route path="/home" element={<Dashboard />} />
        <Route path="/lessons" element={<LessonPage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path="/vocabulary/:topicId" element={<FlashCardPage />} />
        <Route path="/pronunciation" element={<PronunciationPage />} />
        <Route path="/ai-tutor" element={<AIChatPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/learning-path" element={<LearningPathPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/reports" element={<ParentDashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
