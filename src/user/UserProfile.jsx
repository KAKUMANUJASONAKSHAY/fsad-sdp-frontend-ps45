import { useState } from 'react'
import axiosClient from '../api/axiosClient'

function UserProfile() {
  const currentUser = JSON.parse(sessionStorage.getItem('loggedInStudent') || '{}')
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    gender: currentUser.gender || '',
    email: currentUser.email || '',
    username: currentUser.username || '',
    password: '',
    contact: currentUser.contact || '',
    department: currentUser.department || '',
    rollNumber: currentUser.rollNumber || '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const payload = {
        id: currentUser.id,
        name: formData.name,
        password: formData.password,
        contact: formData.contact,
        department: formData.department,
      }

      const response = await axiosClient.post(
        '/studentapi/updateprofile',
        payload,
      )

      const updatedUser = {
        ...currentUser,
        name: formData.name,
        contact: formData.contact,
        department: formData.department,
      }
      sessionStorage.setItem('loggedInStudent', JSON.stringify(updatedUser))
      setMessage(response.data)
      setError('')
    } catch {
      setMessage('')
      setError('Failed to update profile.')
    }
  }

  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Account</p>
          <h2>Update Profile</h2>
        </div>
      </div>

      {message && <p className="status-banner status-success">{message}</p>}
      {error && <p className="status-banner status-error">{error}</p>}

      <form onSubmit={handleSubmit} className="form-grid">
        <label className="field">
          <span>Email</span>
          <input type="email" value={formData.email} disabled />
        </label>

        <label className="field">
          <span>Username</span>
          <input type="text" value={formData.username} disabled />
        </label>

        <label className="field">
          <span>Roll Number</span>
          <input type="text" value={formData.rollNumber} disabled />
        </label>

        <label className="field">
          <span>Gender</span>
          <input type="text" value={formData.gender} disabled />
        </label>

        <label className="field">
          <span>Full Name</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
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
            required
          />
        </label>

        <button type="submit" className="btn btn-primary form-submit">
          Update Profile
        </button>
      </form>
    </section>
  )
}

export default UserProfile
