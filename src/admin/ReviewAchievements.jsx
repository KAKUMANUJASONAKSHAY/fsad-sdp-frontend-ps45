import { useCallback, useEffect, useState } from 'react'
import axiosClient from '../api/axiosClient'
import AchievementFilesList from '../components/AchievementFilesList'

function ReviewAchievements() {
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [achievements, setAchievements] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchAchievements = useCallback(async () => {
    const url =
      statusFilter === 'ALL'
        ? '/adminapi/viewallachievements'
        : '/adminapi/viewachievementsbystatus'

    try {
      setLoading(true)
      const response =
        statusFilter === 'ALL'
          ? await axiosClient.get(url)
          : await axiosClient.get(url, { params: { status: statusFilter } })
      setAchievements(response.data || [])
      setError('')
    } catch (err) {
      if (err.response?.status === 204) {
        setAchievements([])
        setError('')
      } else {
        setError('Failed to fetch achievements.')
      }
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  const updateStatus = async (id, nextStatus) => {
    try {
      const response = await axiosClient.post('/adminapi/updateachievementstatus', null, {
        params: { id, status: nextStatus },
      })
      setMessage(response.data)
      setError('')
      fetchAchievements()
    } catch {
      setMessage('')
      setError(`Failed to update achievement to ${nextStatus}.`)
    }
  }

  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Moderation</p>
          <h2>Review Achievements</h2>
        </div>

        <label className="field filter-field">
          <span>Status Filter</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </label>
      </div>

      {message && <p className="status-banner status-success">{message}</p>}
      {error && <p className="status-banner status-error">{error}</p>}
      {loading && <p className="section-lead">Loading achievements...</p>}
      {!loading && achievements.length === 0 && (
        <p className="section-lead">No achievements found for this filter.</p>
      )}

      {!loading && achievements.length > 0 && (
        <div className="table-card">
          <table className="data-table wide-table review-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Description</th>
                <th>Level</th>
                <th>Date</th>
                <th>Status</th>
                <th>Faculty Status</th>
                <th>Faculty Remarks</th>
                <th>Student</th>
                <th>Proof</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {achievements.map((achievement) => (
                <tr key={achievement.id}>
                  <td>{achievement.id}</td>
                  <td>{achievement.title}</td>
                  <td>{achievement.category}</td>
                  <td>{achievement.description}</td>
                  <td>{achievement.level}</td>
                  <td>{achievement.achievementDate}</td>
                  <td>
                    <span className={`pill pill-${String(achievement.status).toLowerCase()}`}>
                      {achievement.status}
                    </span>
                  </td>
                  <td>{achievement.facultyStatus || 'PENDING'}</td>
                  <td>{achievement.facultyRemarks || '-'}</td>
                  <td>{achievement.student?.name || '-'}</td>
                  <td>
                    <div className="stacked-links">
                      {achievement.certificateUrl ? (
                        <a href={achievement.certificateUrl} target="_blank" rel="noreferrer">
                          View URL
                        </a>
                      ) : (
                        <span className="inline-meta">No URL</span>
                      )}
                      <AchievementFilesList achievementId={achievement.id} />
                    </div>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="btn btn-success btn-small"
                        onClick={() => updateStatus(achievement.id, 'APPROVED')}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-small"
                        onClick={() => updateStatus(achievement.id, 'REJECTED')}
                      >
                        Reject
                      </button>
                    </div>
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

export default ReviewAchievements
