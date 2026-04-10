import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    role: '',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleRoleSelect = (role) => {
    setFormData((current) => ({ ...current, role }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await axiosClient.post('/auth/login', formData)

      const { token, role, user } = response.data

      if (role === 'ADMIN') {
        sessionStorage.setItem('loggedInAdmin', JSON.stringify(user))
        sessionStorage.removeItem('loggedInStudent')
      } else {
        sessionStorage.setItem('loggedInStudent', JSON.stringify(user))
        sessionStorage.removeItem('loggedInAdmin')
      }

      login({ token, role })
      setError('')

      if (role === 'ADMIN') {
        navigate('/admin/home')
      } else {
        navigate('/student/home')
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError(typeof err.response.data === 'string' ? err.response.data : 'Login failed.')
      } else if (err.request) {
        setError('Network error. Check whether the backend server is running.')
      } else {
        setError('Unable to login right now.')
      }
    }
  }

  return (
    <section className="auth-layout">
      <div className="auth-card login-card-unified">
        <p className="eyebrow">Secure Access</p>
        <h2>Login</h2>
        <p className="section-lead">
          Login with your student email or admin username, then pick your portal below.
        </p>

        {error && <p className="status-banner status-error">{error}</p>}

        <form onSubmit={handleSubmit} className="form-grid single-column">
          <div className="field">
            <span>Role</span>
            <div className="role-toggle" role="group" aria-label="Select login role">
              <button
                type="button"
                className={`role-chip ${formData.role === 'STUDENT' ? 'role-chip-active' : ''}`}
                onClick={() => handleRoleSelect('STUDENT')}
              >
                Student
              </button>
              <button
                type="button"
                className={`role-chip ${formData.role === 'ADMIN' ? 'role-chip-active' : ''}`}
                onClick={() => handleRoleSelect('ADMIN')}
              >
                Admin
              </button>
            </div>
          </div>

          <label className="field">
            <span>User / Email</span>
            <input
              type="text"
              name="login"
              value={formData.login}
              onChange={handleChange}
              placeholder="Enter your username or email"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </label>

          <button type="submit" className="btn btn-primary form-submit">
            Login
          </button>
        </form>
      </div>
    </section>
  )
}

export default Login
