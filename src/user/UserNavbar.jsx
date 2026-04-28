import { useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageNotFound from '../pages/PageNotFound'
import AddAchievement from './AddAchievement'
import MyAchievements from './MyAchievements'
import PaymentPage from './PaymentPage'
import UserHome from './UserHome'
import UserProfile from './UserProfile'

function UserNavbar() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const closeSidebarOnSmallScreen = () => {
    if (window.innerWidth <= 1024) {
      setIsSidebarOpen(false)
    }
  }

  return (
    <div className={`dashboard-shell ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <button
        type="button"
        className="sidebar-toggle"
        aria-label={isSidebarOpen ? 'Hide control panel' : 'Show control panel'}
        aria-expanded={isSidebarOpen}
        onClick={() => setIsSidebarOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
      </button>

      {isSidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close control panel"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className="sidebar sidebar-user">
        <div className="sidebar-top">
          <p className="eyebrow">Student Space</p>
          <h2>Student Panel</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/student/home" onClick={closeSidebarOnSmallScreen}>Home</Link>
          <Link to="/student/profile" onClick={closeSidebarOnSmallScreen}>Profile</Link>
          <Link to="/student/add-achievement" onClick={closeSidebarOnSmallScreen}>Add Achievement</Link>
          <Link to="/student/my-achievements" onClick={closeSidebarOnSmallScreen}>My Achievements</Link>
          <Link to="/student/payment" onClick={closeSidebarOnSmallScreen}>Payment</Link>
          <button type="button" onClick={handleLogout} className="sidebar-logout">
            Logout
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <Routes>
          <Route path="/" element={<Navigate to="/student/home" replace />} />
          <Route path="/home" element={<UserHome />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/add-achievement" element={<AddAchievement />} />
          <Route path="/my-achievements" element={<MyAchievements />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default UserNavbar
