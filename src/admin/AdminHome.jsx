import { useEffect, useState } from 'react'
import axiosClient from '../api/axiosClient'

function AdminHome() {
  const admin = JSON.parse(sessionStorage.getItem('loggedInAdmin') || '{}')
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axiosClient.get('/adminapi/dashboard')
        setStats(response.data)
      } catch {
        setStats(null)
      }
    }

    fetchDashboard()
  }, [])

  return (
    <section className="panel">
      <p className="eyebrow">Welcome back</p>
      <h1 className="panel-title">Admin Dashboard</h1>
      <p className="section-lead">
        Signed in as <strong>{admin.username || 'Admin'}</strong>. Use the left
        panel to manage users and moderate achievement submissions.
      </p>

      <div className="summary-grid">
        <div className="summary-card">
          <span>Students</span>
          <strong>{stats ? stats.studentCount : '...'} registered students</strong>
        </div>
        <div className="summary-card">
          <span>Achievements</span>
          <strong>{stats ? stats.totalAchievements : '...'} total achievement records</strong>
        </div>
        <div className="summary-card">
          <span>Pending</span>
          <strong>{stats ? stats.pendingCount : '...'} waiting for review</strong>
        </div>
      </div>
    </section>
  )
}

export default AdminHome
