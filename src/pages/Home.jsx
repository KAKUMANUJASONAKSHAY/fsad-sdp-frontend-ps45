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
            track approval status. Admins can review every record from a single
            dashboard.
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
            <span>Review</span>
            <strong>Approve or reject records through the admin dashboard</strong>
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
          <h3>Admin review tools</h3>
          <p>
            View all users, inspect every submitted achievement, and update each
            record status without extra navigation complexity.
          </p>
        </article>
        <article className="feature-card">
          <h3>Built for your backend</h3>
          <p>
            The frontend is aligned to your current Spring Boot routes for
            `auth`, `studentapi`, and `adminapi`.
          </p>
        </article>
      </section>
    </main>
  )
}

export default Home
