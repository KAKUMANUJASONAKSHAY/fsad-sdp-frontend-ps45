import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import { useAuth } from '../context/AuthContext'

function AdminLogin() {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await axiosClient.post('/auth/login', {
        login: formData.username,
        password: formData.password,
        role: 'ADMIN',
      })

      sessionStorage.setItem('loggedInAdmin', JSON.stringify(response.data.user))
      login({ token: response.data.token, role: response.data.role })
      setError('')
      navigate('/admin/home')
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError(err.response.data)
      } else if (err.request) {
        setError('Network error. Check whether the backend server is running.')
      } else {
        setError('Unable to login right now.')
      }
    }
  }

  return (
    <section className="auth-layout">
      <div className="auth-card">
        <p className="eyebrow">Administrator</p>
        <h2>Admin Login</h2>
        <p className="section-lead">
          Sign in with your admin username to manage students and achievements.
        </p>
        {error && <p className="status-banner status-error">{error}</p>}

        <form onSubmit={handleSubmit} className="form-grid single-column">
          <label className="field">
            <span>Username</span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter admin username"
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
              placeholder="Enter password"
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

export default AdminLogin
