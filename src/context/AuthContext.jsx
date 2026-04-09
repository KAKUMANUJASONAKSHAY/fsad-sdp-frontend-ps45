import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const normalizeRole = (value) => {
  if (!value) return null

  const normalized = value.toString().trim().toUpperCase()

  if (normalized === 'ADMIN') return 'admin'
  if (normalized === 'STUDENT') return 'student'

  return value.toString().trim().toLowerCase()
}

const getInitialAuthState = () => ({
  token: sessionStorage.getItem('token'),
  role: normalizeRole(sessionStorage.getItem('loggedInRole') || sessionStorage.getItem('role')),
})

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getInitialAuthState)

  const login = ({ token, role }) => {
    const normalizedRole = normalizeRole(role)

    if (token) sessionStorage.setItem('token', token)
    else sessionStorage.removeItem('token')

    if (role) {
      sessionStorage.setItem('role', role)
      sessionStorage.setItem('loggedInRole', normalizedRole)
    } else {
      sessionStorage.removeItem('role')
      sessionStorage.removeItem('loggedInRole')
    }

    setAuth({
      token: token || null,
      role: normalizedRole,
    })
  }

  const logout = () => {
    const currentRole =
      auth.role || normalizeRole(sessionStorage.getItem('loggedInRole') || sessionStorage.getItem('role'))

    if (currentRole === 'admin') {
      sessionStorage.removeItem('loggedInAdmin')
    } else if (currentRole === 'student') {
      sessionStorage.removeItem('loggedInStudent')
    }

    sessionStorage.removeItem('token')
    sessionStorage.removeItem('role')
    sessionStorage.removeItem('loggedInRole')

    setAuth({
      token: null,
      role: null,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        role: auth.role,
        isAuthenticated: Boolean(auth.token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
