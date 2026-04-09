import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import { useAuth } from '../context/AuthContext'

function UserLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' })
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
        login: formData.email,
        password: formData.password,
        role: 'STUDENT',
      })

      sessionStorage.setItem('loggedInStudent', JSON.stringify(response.data.user))
      login({ token: response.data.token, role: response.data.role })
      setError('')
      navigate('/student/home')
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
        <p className="eyebrow">Student Portal</p>
        <h2>Student Login</h2>
        <p className="section-lead">
          Sign in with your student email to manage your profile and achievements.
        </p>
        {error && <p className="status-banner status-error">{error}</p>}

        <form onSubmit={handleSubmit} className="form-grid single-column">
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
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

export default UserLogin
