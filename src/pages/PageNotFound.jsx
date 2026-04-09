import { Link } from 'react-router-dom'

function PageNotFound() {
  return (
    <section className="notfound">
      <div className="notfound-card">
        <p className="eyebrow">404</p>
        <h2>Page not found</h2>
        <p className="section-lead">
          The route you tried to open does not exist in this frontend.
        </p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    </section>
  )
}

export default PageNotFound
