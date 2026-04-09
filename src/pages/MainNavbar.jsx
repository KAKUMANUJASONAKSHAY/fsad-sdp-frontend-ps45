import { Link, Navigate, Route, Routes } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import PageNotFound from './PageNotFound'
import UserRegistration from './UserRegistration'

function MainNavbar() {
  return (
    <div className="public-shell">
      <header className="topbar">
        <Link to="/" className="brandmark">
          <span className="brandmark-badge">SA</span>
          <span>
            <strong>Student Achievement Portal</strong>
            <small>Track, submit, and review academic milestones</small>
          </span>
        </Link>

        <nav className="topnav">
          <Link to="/">Home</Link>
          <Link to="/student-registration">Student Registration</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student-registration" element={<UserRegistration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student-login" element={<Navigate to="/login" replace />} />
        <Route path="/admin-login" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  )
}

export default MainNavbar
