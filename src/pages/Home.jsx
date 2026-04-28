import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="landing">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Campus Achievement Management</p>
          <h1>Showcase student achievements with one clean workflow.</h1>
          <p className="hero-text">
            Students can register, maintain profiles, submit achievements, and
            track approval status. Faculty can recommend department submissions,
            and admins can finalize every record from a single dashboard.
          </p>
          <div className="hero-actions">
            <Link to="/student-registration" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-card accent-a">
            <span>Students</span>
            <strong>Register and maintain academic profiles</strong>
          </div>
          <div className="stat-card accent-b">
            <span>Achievements</span>
            <strong>Submit events, activities, levels, proof links, and dates</strong>
          </div>
          <div className="stat-card accent-c">
            <span>Faculty Review</span>
            <strong>Recommend or hold department records before admin moderation</strong>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <article className="feature-card">
          <h3>Student-first flow</h3>
          <p>
            Registration, login, profile management, achievement submission, and
            personal achievement history all live in one place.
          </p>
        </article>
        <article className="feature-card">
          <h3>Faculty and admin review</h3>
          <p>
            Faculty can inspect department-specific submissions, while admins retain
            campus-wide visibility and moderation controls.
          </p>
        </article>
        <article className="feature-card">
          <h3>Built for your backend</h3>
          <p>
            The frontend is aligned to your current Spring Boot routes for
            `auth`, `studentapi`, `facultyapi`, `files`, `otp`, `mail`, and `payment`.
          </p>
        </article>
      </section>
    </main>
  )
}

export default Home
