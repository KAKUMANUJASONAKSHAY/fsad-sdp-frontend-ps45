import { useEffect, useState } from 'react'
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

function ManageFaculty() {
  const [facultyList, setFacultyList] = useState([])
  const [formData, setFormData] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchFaculty = async () => {
    try {
      setLoading(true)
      const response = await axiosClient.get('/adminapi/viewallfaculty')
      setFacultyList(Array.isArray(response.data) ? response.data : [])
      setError('')
    } catch (err) {
      if (err.response?.status === 204) {
        setFacultyList([])
        setError('')
      } else {
        setError('Failed to fetch faculty.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFaculty()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSubmitting(true)
      const response = await axiosClient.post('/adminapi/addfaculty', formData)
      setMessage(response.data)
      setError('')
      setFormData(initialForm)
      await fetchFaculty()
    } catch (err) {
      setMessage('')
      setError(typeof err.response?.data === 'string' ? err.response.data : 'Unable to add faculty.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this faculty account?')

    if (!confirmed) {
      return
    }

    try {
      const response = await axiosClient.delete(`/adminapi/deletefaculty/${id}`)
      setMessage(response.data)
      setError('')
      await fetchFaculty()
    } catch (err) {
      setMessage('')
      setError(typeof err.response?.data === 'string' ? err.response.data : 'Unable to delete faculty.')
    }
  }

  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Faculty Access</p>
          <h2>Manage Faculty</h2>
        </div>
      </div>

      {message && <p className="status-banner status-success">{message}</p>}
      {error && <p className="status-banner status-error">{error}</p>}

      <div className="section-block">
        <h3>Add Faculty</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <label className="field">
            <span>Full Name</span>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>

          <label className="field">
            <span>Email</span>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>

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

          <button type="submit" className="btn btn-primary form-submit" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Faculty'}
          </button>
        </form>
      </div>

      <div className="section-block">
        <div className="section-head">
          <div>
            <p className="eyebrow">Directory</p>
            <h2>All Faculty</h2>
          </div>
        </div>

        {loading && <p className="section-lead">Loading faculty...</p>}
        {!loading && facultyList.length === 0 && <p className="section-lead">No faculty found.</p>}

        {!loading && facultyList.length > 0 && (
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Contact</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {facultyList.map((faculty) => (
                  <tr key={faculty.id}>
                    <td>{faculty.id}</td>
                    <td>{faculty.name}</td>
                    <td>{faculty.email}</td>
                    <td>{faculty.department}</td>
                    <td>{faculty.designation}</td>
                    <td>{faculty.contact}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-small"
                        onClick={() => handleDelete(faculty.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default ManageFaculty
