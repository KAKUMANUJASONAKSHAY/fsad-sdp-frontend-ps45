function UserHome() {
  const user = JSON.parse(sessionStorage.getItem('loggedInStudent') || '{}')

  return (
    <section className="panel">
      <p className="eyebrow">Welcome</p>
      <h1 className="panel-title">{user.name || 'Student Dashboard'}</h1>
      <p className="section-lead">
        Manage your academic profile, submit new achievements, and follow the
        current approval status of each submission.
      </p>

      <div className="summary-grid">
        <div className="summary-card">
          <span>Department</span>
          <strong>{user.department || '-'}</strong>
        </div>
        <div className="summary-card">
          <span>Roll Number</span>
          <strong>{user.rollNumber || '-'}</strong>
        </div>
        <div className="summary-card">
          <span>Email</span>
          <strong>{user.email || '-'}</strong>
        </div>
      </div>
    </section>
  )
}

export default UserHome
