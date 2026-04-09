import { Navigate, Route, Routes } from 'react-router-dom'
import AdminNavbar from './admin/AdminNavbar'
import { useAuth } from './context/AuthContext'
import MainNavbar from './pages/MainNavbar'
import UserNavbar from './user/UserNavbar'

function ProtectedRoute({ allowedRole, children }) {
  const { role } = useAuth()

  if (role !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route path="/*" element={<MainNavbar />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminNavbar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRole="student">
            <UserNavbar />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
