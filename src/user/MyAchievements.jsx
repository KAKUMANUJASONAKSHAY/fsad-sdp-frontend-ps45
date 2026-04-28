import { useEffect, useState } from 'react'
import axiosClient from '../api/axiosClient'
import AchievementFilesList from '../components/AchievementFilesList'

function MyAchievements() {
  const [achievements, setAchievements] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInStudent') || '{}')

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true)
        const response = await axiosClient.get(`/studentapi/viewmyachievements/${loggedInUser.id}`)

        setAchievements(response.data || [])
        setError('')
      } catch (err) {
        if (err.response?.status === 204 || err.response?.status === 404) {
          setAchievements([])
          setError('')
        } else {
          setError('Failed to fetch your achievements.')
        }
      } finally {
        setLoading(false)
      }
    }

    if (loggedInUser.id) {
      fetchAchievements()
    } else {
      setLoading(false)
      setError('No logged in user found.')
    }
  }, [loggedInUser.id])

  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Progress</p>
          <h2>My Achievements</h2>
        </div>
      </div>

      {error && <p className="status-banner status-error">{error}</p>}
      {loading && <p className="section-lead">Loading achievements...</p>}
      {!loading && achievements.length === 0 && !error && (
        <p className="section-lead">No achievements submitted yet.</p>
      )}

      {!loading && achievements.length > 0 && (
        <div className="cards-grid">
          {achievements.map((achievement) => (
            <article className="achievement-card" key={achievement.id}>
              <div className="achievement-top">
                <div>
                  <p className="achievement-category">{achievement.category}</p>
                  <h3>{achievement.title}</h3>
                </div>
                <span className={`pill pill-${String(achievement.status).toLowerCase()}`}>
                  {achievement.status}
                </span>
              </div>
              <p>{achievement.description || 'No description added.'}</p>
              <dl className="achievement-meta">
                <div>
                  <dt>Level</dt>
                  <dd>{achievement.level}</dd>
                </div>
                <div>
                  <dt>Date</dt>
                  <dd>{achievement.achievementDate}</dd>
                </div>
                <div>
                  <dt>Student</dt>
                  <dd>{achievement.student?.name || '-'}</dd>
                </div>
                <div>
                  <dt>Faculty Review</dt>
                  <dd>{achievement.facultyStatus || 'PENDING'}</dd>
                </div>
              </dl>
              <div className="achievement-actions">
                <div className="stacked-links">
                  {achievement.certificateUrl && (
                    <a href={achievement.certificateUrl} target="_blank" rel="noreferrer">
                      View certificate URL
                    </a>
                  )}
                  <AchievementFilesList achievementId={achievement.id} />
                </div>
                {achievement.facultyRemarks && (
                  <span className="inline-meta">Faculty: {achievement.facultyRemarks}</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default MyAchievements
