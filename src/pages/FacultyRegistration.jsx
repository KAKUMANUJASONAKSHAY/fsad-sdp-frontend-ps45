import { useMemo, useState } from 'react'
import axiosClient from '../api/axiosClient'

const initialForm = {
  name: '',
  email: '',
  username: '',
  password: '',
  contact: '',
  department: '',
  designation: '',
}

function FacultyRegistration() {
  const [formData, setFormData] = useState(initialForm)
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const emailReady = useMemo(() => /\S+@\S+\.\S+/.test(formData.email), [formData.email])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))

    if (name === 'email') {
      setOtp('')
      setOtpSent(false)
      setOtpVerified(false)
    }
  }

  const handleSendOtp = async () => {
    if (!emailReady) {
      setMessage('')
      setError('Enter a valid faculty email before sending OTP.')
      return
    }

    try {
      setOtpLoading(true)
      const response = await axiosClient.post('/otp/send', { email: formData.email })
      setOtpSent(true)
      setOtpVerified(false)
      setMessage(response.data)
      setError('')
    } catch (err) {
      setMessage('')
      setError(typeof err.response?.data === 'string' ? err.response.data : 'Failed to send OTP.')
    } finally {
      setOtpLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setMessage('')
      setError('Enter the OTP sent to your email.')
      return
    }

    try {
      setOtpLoading(true)
      const response = await axiosClient.post('/otp/verify', {
        email: formData.email,
        otp,
      })
      setOtpVerified(true)
      setMessage(response.data)
      setError('')
    } catch (err) {
      setMessage('')
      setError(typeof err.response?.data === 'string' ? err.response.data : 'OTP verification failed.')
    } finally {
      setOtpLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!otpVerified) {
      setMessage('')
      setError('Verify OTP before completing faculty registration.')
      return
    }

    try {
      setSubmitting(true)
      const response = await axiosClient.post('/facultyapi/registration', formData)
      setMessage(response.data)
      setError('')
      setFormData(initialForm)
      setOtp('')
      setOtpSent(false)
      setOtpVerified(false)
    } catch (err) {
      setMessage('')
      if (err.response?.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : 'Faculty registration failed.')
      } else if (err.request) {
        setError('Network error. Check whether the backend server is running.')
      } else {
        setError('Faculty registration failed.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-layout">
      <div className="auth-card auth-card-wide">
        <p className="eyebrow">Faculty Onboarding</p>
        <h2>Faculty Registration</h2>
        <p className="section-lead">
          Register department faculty accounts and verify the email before joining the review flow.
        </p>

        {message && <p className="status-banner status-success">{message}</p>}
        {error && <p className="status-banner status-error">{error}</p>}

        <form onSubmit={handleSubmit} className="form-grid">
          <label className="field">
            <span>Full Name</span>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>

          <div className="field">
            <span>Email</span>
            <div className="inline-action">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter faculty email"
                required
              />
              <button
                type="button"
                className="btn btn-secondary inline-btn"
                disabled={otpLoading || !emailReady}
                onClick={handleSendOtp}
              >
                {otpLoading && !otpSent ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </div>

          {otpSent && (
            <div className="field field-span-full">
              <span>Email OTP</span>
              <div className="inline-action">
                <input
                  type="text"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  placeholder="Enter received OTP"
                  required
                />
                <button
                  type="button"
                  className="btn btn-secondary inline-btn"
                  disabled={otpLoading || otpVerified}
                  onClick={handleVerifyOtp}
                >
                  {otpVerified ? 'Verified' : otpLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </div>
          )}

          <label className="field">
            <span>Username</span>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </label>

          <label className="field">
            <span>Password</span>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </label>

          <label className="field">
            <span>Contact</span>
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
          </label>

          <label className="field">
            <span>Department</span>
            <input type="text" name="department" value={formData.department} onChange={handleChange} required />
          </label>

          <label className="field field-span-full">
            <span>Designation</span>
            <input type="text" name="designation" value={formData.designation} onChange={handleChange} required />
          </label>

          <button type="submit" className="btn btn-primary form-submit" disabled={submitting || !otpVerified}>
            {submitting ? 'Registering...' : 'Register Faculty'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default FacultyRegistration
