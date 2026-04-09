import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageNotFound from '../pages/PageNotFound'
import AdminHome from './AdminHome'
import ReviewAchievements from './ReviewAchievements'
import ViewAllUsers from './ViewAllUsers'

function AdminNavbar() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar sidebar-admin">
        <div className="sidebar-top">
          <p className="eyebrow">Control Center</p>
          <h2>Admin Panel</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin/home">Home</Link>
          <Link to="/admin/students">View Students</Link>
          <Link to="/admin/achievements">Review Achievements</Link>
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
          <Route path="/achievements" element={<ReviewAchievements />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default AdminNavbar
