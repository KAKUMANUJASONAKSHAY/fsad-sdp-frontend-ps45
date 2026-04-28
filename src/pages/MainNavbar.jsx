import { Link, Navigate, Route, Routes } from 'react-router-dom'
import Home from './Home'
import FacultyRegistration from './FacultyRegistration'
import Login from './Login'
import PageNotFound from './PageNotFound'
import Support from './Support'
import UserRegistration from './UserRegistration'

function MainNavbar() {
  return (
    <div className="public-shell">
      <header className="topbar">
        <Link to="/" className="brandmark">
          <span className="brandmark-badge brandmark-logo" aria-hidden="true">
            <span className="logo-ring">
              <span className="logo-ribbon logo-ribbon-left" />
              <span className="logo-ribbon logo-ribbon-right" />
              <span className="logo-core">
                <span className="logo-star">A</span>
              </span>
            </span>
          </span>
          <span>
            <strong>Student Achievement Portal</strong>
            <small>Track, submit, and review academic milestones</small>
          </span>
        </Link>

        <nav className="topnav">
          <Link to="/">Home</Link>
          <Link to="/student-registration">Student Registration</Link>
          <Link to="/faculty-registration">Faculty Registration</Link>
          <Link to="/support">Support</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student-registration" element={<UserRegistration />} />
        <Route path="/faculty-registration" element={<FacultyRegistration />} />
        <Route path="/support" element={<Support />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student-login" element={<Navigate to="/login" replace />} />
        <Route path="/admin-login" element={<Navigate to="/login" replace />} />
        <Route path="/faculty-login" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  )
}

export default MainNavbar
