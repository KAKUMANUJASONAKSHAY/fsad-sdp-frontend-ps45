import { useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageNotFound from '../pages/PageNotFound'
import FacultyDashboard from './FacultyDashboard'

function FacultyNavbar() {
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

      <aside className="sidebar sidebar-faculty">
        <div className="sidebar-top">
          <p className="eyebrow">Faculty Space</p>
          <h2>Faculty Panel</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/faculty/home" onClick={closeSidebarOnSmallScreen}>Dashboard</Link>
          <button type="button" onClick={handleLogout} className="sidebar-logout">
            Logout
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <Routes>
          <Route path="/" element={<Navigate to="/faculty/home" replace />} />
          <Route path="/home" element={<FacultyDashboard />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default FacultyNavbar
