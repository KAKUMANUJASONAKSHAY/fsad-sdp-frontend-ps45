import { useState } from 'react'
import axiosClient from '../api/axiosClient'

const initialForm = {
  fullname: '',
  subject: '',
  message: '',
  receiveremail: '',
  contact: '',
}

function Support() {
  const [formData, setFormData] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)
      const response = await axiosClient.post('/mail/sendemail', formData)
      setMessage(response.data)
      setError('')
      setFormData(initialForm)
    } catch (err) {
      setMessage('')
      setError(typeof err.response?.data === 'string' ? err.response.data : 'Unable to send email right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-layout">
      <div className="auth-card auth-card-wide">
        <p className="eyebrow">Support</p>
        <h2>Contact & Email Support</h2>
        <p className="section-lead">
          Share your message, subject, and contact details to send a support email through the platform.
        </p>

        {message && <p className="status-banner status-success">{message}</p>}
        {error && <p className="status-banner status-error">{error}</p>}

        <form onSubmit={handleSubmit} className="form-grid">
          <label className="field">
            <span>Full Name</span>
            <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} required />
          </label>

          <label className="field">
            <span>Receiver Email</span>
            <input
              type="email"
              name="receiveremail"
              value={formData.receiveremail}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field field-span-full">
            <span>Subject</span>
            <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
          </label>

          <label className="field">
            <span>Contact</span>
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
          </label>

          <div className="field" />

          <label className="field field-span-full">
            <span>Message</span>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              placeholder="Write your message"
              required
            />
          </label>

          <button type="submit" className="btn btn-primary form-submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Email'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Support
