import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'
import './MainLayout.css'

export default function MainLayout() {
  const location = useLocation()
  const hideNav = ['/ai-tutor'].includes(location.pathname)

  return (
    <div className="main-layout">
      <div className="main-content">
        <Outlet />
      </div>
      {!hideNav && <BottomNav />}
    </div>
  )
}
