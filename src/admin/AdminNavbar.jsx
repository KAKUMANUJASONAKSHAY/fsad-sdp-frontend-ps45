import { useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageNotFound from '../pages/PageNotFound'
import AdminHome from './AdminHome'
import ManageFaculty from './ManageFaculty'
import ReviewAchievements from './ReviewAchievements'
import ViewAllUsers from './ViewAllUsers'

function AdminNavbar() {
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

      <aside className="sidebar sidebar-admin">
        <div className="sidebar-top">
          <p className="eyebrow">Control Center</p>
          <h2>Admin Panel</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin/home" onClick={closeSidebarOnSmallScreen}>Home</Link>
          <Link to="/admin/students" onClick={closeSidebarOnSmallScreen}>View Students</Link>
          <Link to="/admin/faculty" onClick={closeSidebarOnSmallScreen}>Manage Faculty</Link>
          <Link to="/admin/achievements" onClick={closeSidebarOnSmallScreen}>Review Achievements</Link>
          <button type="button" onClick={handleLogout} className="sidebar-logout">
            Logout
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/home" replace />} />
          <Route path="/home" element={<AdminHome />} />
          <Route path="/students" element={<ViewAllUsers />} />
          <Route path="/faculty" element={<ManageFaculty />} />
          <Route path="/achievements" element={<ReviewAchievements />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default AdminNavbar
