import { useState } from 'react'
import axios from 'axios'

const initialForm = {
  name: '',
  email: '',
  username: '',
  password: '',
  contact: '',
  department: '',
  rollNumber: '',
  gender: '',
}

function UserRegistration() {
  const [formData, setFormData] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/studentapi/registration`,
        formData,
      )

      setMessage(response.data)
      setError('')
      setFormData(initialForm)
    } catch (err) {
      setMessage('')
      if (err.request) {
        setError('Network error. Check whether the backend server is running.')
      } else {
        setError('Registration failed. Please verify your details and try again.')
      }
    }
  }

  return (
    <section className="auth-layout">
      <div className="auth-card auth-card-wide">
        <p className="eyebrow">New Student Account</p>
        <h2>Student Registration</h2>
        <p className="section-lead">
          Create an account using your student details to start recording
          achievements.
        </p>

        {message && <p className="status-banner status-success">{message}</p>}
        {error && <p className="status-banner status-error">{error}</p>}

        <form onSubmit={handleSubmit} className="form-grid">
          <label className="field">
            <span>Full Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </label>

          <label className="field">
            <span>Username</span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose username"
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
              placeholder="Create password"
              required
            />
          </label>

          <label className="field">
            <span>Contact</span>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter contact number"
              required
            />
          </label>

          <label className="field">
            <span>Department</span>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Enter department"
              required
            />
          </label>

          <label className="field">
            <span>Roll Number</span>
            <input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="Enter roll number"
              required
            />
          </label>

          <label className="field">
            <span>Gender</span>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
          </label>

          <button type="submit" className="btn btn-primary form-submit">
            Register
          </button>
        </form>
      </div>
    </section>
  )
}

export default UserRegistration
