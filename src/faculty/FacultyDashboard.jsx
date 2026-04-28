import { useCallback, useEffect, useMemo, useState } from 'react'
import axiosClient from '../api/axiosClient'
import AchievementFilesList from '../components/AchievementFilesList'

function FacultyDashboard() {
  const faculty = useMemo(
    () => JSON.parse(sessionStorage.getItem('loggedInFaculty') || '{}'),
    [],
  )
  const department = faculty.department || ''

  const [students, setStudents] = useState([])
  const [pendingAchievements, setPendingAchievements] = useState([])
  const [allAchievements, setAllAchievements] = useState([])
  const [remarks, setRemarks] = useState({})
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [reviewingId, setReviewingId] = useState(null)

  const fetchDashboardData = useCallback(async () => {
    if (!department) {
      setStudents([])
      setPendingAchievements([])
      setAllAchievements([])
      setLoading(false)
      setError('No faculty department information found.')
      return
    }

    try {
      setLoading(true)
      const [studentsResponse, pendingResponse, allResponse] = await Promise.all([
        axiosClient.get('/facultyapi/viewdepartmentstudents', { params: { department } }),
        axiosClient.get('/facultyapi/viewpendingachievements', { params: { department } }),
        axiosClient.get('/facultyapi/viewdepartmentachievements', { params: { department } }),
      ])

      setStudents(studentsResponse.data || [])
      setPendingAchievements(pendingResponse.data || [])
      setAllAchievements(allResponse.data || [])
      setError('')
    } catch {
      setError('Failed to load faculty dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [department])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleReview = async (achievementId, facultyStatus) => {
    const facultyRemarks = (remarks[achievementId] || '').trim()

    if (!facultyRemarks) {
      setMessage('')
      setError('Faculty remarks are required before submitting a review.')
      return
    }

    try {
      setReviewingId(achievementId)
      const response = await axiosClient.post('/facultyapi/reviewachievement', null, {
        params: {
          achievementId,
          facultyStatus,
          facultyRemarks,
        },
      })

      setMessage(response.data)
      setError('')
      setRemarks((current) => ({ ...current, [achievementId]: '' }))
      await fetchDashboardData()
    } catch {
      setMessage('')
      setError('Failed to submit faculty review.')
    } finally {
      setReviewingId(null)
    }
  }

  return (
    <section className="panel">
      <p className="eyebrow">Department Review</p>
      <h1 className="panel-title">Faculty Dashboard</h1>
      <p className="section-lead">
        Review achievement submissions for <strong>{department || 'your department'}</strong> and
        guide them forward with clear recommendations.
      </p>

      <div className="summary-grid">
        <div className="summary-card">
          <span>Faculty</span>
          <strong>{faculty.name || '-'}</strong>
        </div>
        <div className="summary-card">
          <span>Department</span>
          <strong>{department || '-'}</strong>
        </div>
        <div className="summary-card">
          <span>Designation</span>
          <strong>{faculty.designation || '-'}</strong>
        </div>
      </div>

      {message && <p className="status-banner status-success">{message}</p>}
      {error && <p className="status-banner status-error">{error}</p>}
      {loading && <p className="section-lead">Loading faculty dashboard...</p>}

      {!loading && (
        <>
          <div className="section-block">
            <div className="section-head">
              <div>
                <p className="eyebrow">Students</p>
                <h2>Department Students</h2>
              </div>
            </div>

            {students.length === 0 ? (
              <p className="section-lead">No students found for this department.</p>
            ) : (
              <div className="table-card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Roll Number</th>
                      <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.rollNumber}</td>
                        <td>{student.contact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="section-block">
            <div className="section-head">
              <div>
                <p className="eyebrow">Action Required</p>
                <h2>Pending Department Achievements</h2>
              </div>
            </div>

            {pendingAchievements.length === 0 ? (
              <p className="section-lead">No pending achievements for faculty review.</p>
            ) : (
              <div className="table-card">
                <table className="data-table wide-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Student</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Level</th>
                      <th>Description</th>
                      <th>Faculty Remarks</th>
                      <th>Proof</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingAchievements.map((achievement) => (
                      <tr key={achievement.id}>
                        <td>{achievement.id}</td>
                        <td>{achievement.student?.name || '-'}</td>
                        <td>{achievement.title}</td>
                        <td>{achievement.category}</td>
                        <td>{achievement.level}</td>
                        <td>{achievement.description}</td>
                        <td>
                          <textarea
                            className="table-remarks"
                            rows="3"
                            value={remarks[achievement.id] || ''}
                            onChange={(event) =>
                              setRemarks((current) => ({
                                ...current,
                                [achievement.id]: event.target.value,
                              }))
                            }
                            placeholder="Add your recommendation remarks"
                          />
                        </td>
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
                              disabled={reviewingId === achievement.id}
                              onClick={() => handleReview(achievement.id, 'RECOMMENDED')}
                            >
                              Recommend
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-small"
                              disabled={reviewingId === achievement.id}
                              onClick={() => handleReview(achievement.id, 'NOT_RECOMMENDED')}
                            >
                              Not Recommend
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="section-block">
            <div className="section-head">
              <div>
                <p className="eyebrow">Overview</p>
                <h2>All Department Achievements</h2>
              </div>
            </div>

            {allAchievements.length === 0 ? (
              <p className="section-lead">No achievements available for this department yet.</p>
            ) : (
              <div className="table-card">
                <table className="data-table wide-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Student</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Faculty Status</th>
                      <th>Faculty Remarks</th>
                      <th>Proof</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allAchievements.map((achievement) => (
                      <tr key={achievement.id}>
                        <td>{achievement.id}</td>
                        <td>{achievement.student?.name || '-'}</td>
                        <td>{achievement.title}</td>
                        <td>
                          <span className={`pill pill-${String(achievement.status).toLowerCase()}`}>
                            {achievement.status}
                          </span>
                        </td>
                        <td>{achievement.facultyStatus || 'PENDING'}</td>
                        <td>{achievement.facultyRemarks || '-'}</td>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  )
}

export default FacultyDashboard
