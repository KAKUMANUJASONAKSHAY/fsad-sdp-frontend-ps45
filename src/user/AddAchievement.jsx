import { useState } from 'react'
import axiosClient from '../api/axiosClient'

const initialForm = {
  title: '',
  category: '',
  level: '',
  description: '',
  achievementDate: '',
  certificateUrl: '',
}

function AddAchievement() {
  const [formData, setFormData] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInStudent') || '{}')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await axiosClient.post('/studentapi/submitachievement', {
        ...formData,
        student: {
          id: loggedInUser.id,
        },
      })

      setMessage(response.data)
      setError('')
      setFormData(initialForm)
    } catch {
      setMessage('')
      setError('Failed to submit achievement.')
    }
  }

  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Submission</p>
          <h2>Add Achievement</h2>
        </div>
      </div>

      {message && <p className="status-banner status-success">{message}</p>}
      {error && <p className="status-banner status-error">{error}</p>}

      <form onSubmit={handleSubmit} className="form-grid">
        <label className="field">
          <span>Title</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter achievement title"
            required
          />
        </label>

        <label className="field">
          <span>Category</span>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Sports, arts, tech, cultural..."
            required
          />
        </label>

        <label className="field">
          <span>Level</span>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
          >
            <option value="">Select level</option>
            <option value="College">College</option>
            <option value="State">State</option>
            <option value="National">National</option>
            <option value="International">International</option>
          </select>
        </label>

        <label className="field">
          <span>Achievement Date</span>
          <input
            type="date"
            name="achievementDate"
            value={formData.achievementDate}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span>Certificate URL</span>
          <input
            type="url"
            name="certificateUrl"
            value={formData.certificateUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </label>

        <label className="field field-span-full">
          <span>Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a short description of the achievement"
            rows="5"
            required
          />
        </label>

        <button type="submit" className="btn btn-primary form-submit">
          Submit Achievement
        </button>
      </form>
    </section>
  )
}

export default AddAchievement
