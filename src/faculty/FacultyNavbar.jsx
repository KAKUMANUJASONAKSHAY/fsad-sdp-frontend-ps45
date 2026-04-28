import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageNotFound from '../pages/PageNotFound'
import FacultyDashboard from './FacultyDashboard'

function FacultyNavbar() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar sidebar-faculty">
        <div className="sidebar-top">
          <p className="eyebrow">Faculty Space</p>
          <h2>Faculty Panel</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/faculty/home">Dashboard</Link>
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
