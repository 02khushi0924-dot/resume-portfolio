export default function HeroSection({ data }) {
  const initials = data.name
    ? data.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <section className="portfolio-hero">
      <div className="portfolio-hero-content animate-in">
        <div className="portfolio-avatar">{initials}</div>
        <h1 className="portfolio-name gradient-text">{data.name || 'Professional'}</h1>
        <p className="portfolio-tagline">{data.title || data.tagline || 'Software Professional'}</p>
        <p className="portfolio-bio">{data.about || data.bio || data.summary || ''}</p>
        <div className="portfolio-links">
          {data.email && (
            <a className="portfolio-link" href={`mailto:${data.email}`}>
              📧 {data.email}
            </a>
          )}
          {data.phone && (
            <a className="portfolio-link" href={`tel:${data.phone}`}>
              📱 {data.phone}
            </a>
          )}
          {data.linkedin && (
            <a className="portfolio-link" href={data.linkedin} target="_blank" rel="noreferrer">
              🔗 LinkedIn
            </a>
          )}
          {data.github && (
            <a className="portfolio-link" href={data.github} target="_blank" rel="noreferrer">
              🐙 GitHub
            </a>
          )}
          {data.location && (
            <span className="portfolio-link">📍 {data.location}</span>
          )}
        </div>
      </div>
    </section>
  )
}
