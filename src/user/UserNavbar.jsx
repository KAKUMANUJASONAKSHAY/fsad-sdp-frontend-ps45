import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageNotFound from '../pages/PageNotFound'
import AddAchievement from './AddAchievement'
import MyAchievements from './MyAchievements'
import UserHome from './UserHome'
import UserProfile from './UserProfile'

function UserNavbar() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar sidebar-user">
        <div className="sidebar-top">
          <p className="eyebrow">Student Space</p>
          <h2>Student Panel</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/student/home">Home</Link>
          <Link to="/student/profile">Profile</Link>
          <Link to="/student/add-achievement">Add Achievement</Link>
          <Link to="/student/my-achievements">My Achievements</Link>
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
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default UserNavbar
