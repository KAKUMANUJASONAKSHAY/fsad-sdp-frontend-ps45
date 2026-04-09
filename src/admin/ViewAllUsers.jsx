import { useEffect, useState } from 'react'
import axiosClient from '../api/axiosClient'

function ViewAllUsers() {
  const [students, setStudents] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axiosClient.get('/adminapi/viewallstudentsdto')
      setStudents(response.data)
      setError('')
    } catch {
      setError('Failed to fetch students.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this user?')

    if (!confirmed) {
      return
    }

    try {
      const response = await axiosClient.delete('/adminapi/deletestudent', {
        params: { id },
      })
      setMessage(response.data)
      setError('')
      fetchUsers()
    } catch {
      setMessage('')
      setError('Unable to delete student.')
    }
  }

  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Directory</p>
          <h2>All Students</h2>
        </div>
      </div>

      {message && <p className="status-banner status-success">{message}</p>}
      {error && <p className="status-banner status-error">{error}</p>}
      {loading && <p className="section-lead">Loading students...</p>}
      {!loading && students.length === 0 && (
        <p className="section-lead">No students found.</p>
      )}

      {!loading && students.length > 0 && (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Roll Number</th>
                <th>Gender</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.department}</td>
                  <td>{student.rollNumber}</td>
                  <td>{student.gender}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger btn-small"
                      onClick={() => handleDelete(student.id)}
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
    </section>
  )
}

export default ViewAllUsers
